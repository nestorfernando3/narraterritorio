import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

interface WebSocketMessage {
  type: string;
  payload: any;
}

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const { sessionCode, student, setStudent, setProject } = useAppStore();
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('🔗 WebSocket connected');
        // Re-join session if we have one
        if (sessionCode && student) {
          ws.current?.send(JSON.stringify({
            type: 'join',
            payload: { sessionCode, nickname: student.nickname },
          }));
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const msg: WebSocketMessage = JSON.parse(event.data);
          
          switch (msg.type) {
            case 'init':
              setStudent(msg.payload.student);
              break;
            
            case 'projectCreated':
              setProject(msg.payload);
              break;
            
            case 'projectUpdated':
              setProject(msg.payload);
              break;
            
            case 'projectPublished':
              // Refresh gallery if we're viewing it
              setProject(msg.payload);
              break;
            
            case 'studentJoined':
              console.log('Student joined:', msg.payload);
              break;
            
            case 'error':
              console.error('Server error:', msg.payload);
              break;
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      ws.current.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        // Attempt reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(connect, 3000);
      };

      ws.current.onerror = (err) => {
        console.error('WebSocket error:', err);
      };
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  }, [sessionCode, student, setStudent, setProject]);

  const sendMessage = useCallback((type: string, payload: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected');
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.current?.close();
    };
  }, [connect]);

  return { sendMessage, isConnected: ws.current?.readyState === WebSocket.OPEN };
}
