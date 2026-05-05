import { databases, isAppwriteConfigured, DB_ID, COLLECTION_PROMPTS, COLLECTION_PROJECTS, COLLECTION_STUDENTS, COLLECTION_SESSIONS } from './appwrite';
import { Query } from 'appwrite';
import { mockPrompts, mockProjects } from './mockData';
import type { Prompt, WritingProject, Student } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// Unified service that auto-detects backend or falls back to WebSocket/mock
class NarraService {
  private ws: WebSocket | null = null;
  private wsCallbacks: Map<string, ((data: any) => void)[]> = new Map();
  private isWsConnected = false;

  constructor() {
    this.initWebSocket();
  }

  private initWebSocket() {
    try {
      this.ws = new WebSocket(WS_URL);
      
      this.ws.onopen = () => {
        console.log('🔗 WebSocket connected');
        this.isWsConnected = true;
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          const callbacks = this.wsCallbacks.get(msg.type) || [];
          callbacks.forEach((cb) => cb(msg.payload));
        } catch (err) {
          console.error('WS message error:', err);
        }
      };

      this.ws.onclose = () => {
        this.isWsConnected = false;
        setTimeout(() => this.initWebSocket(), 3000);
      };
    } catch {
      console.log('WebSocket not available, using offline mode');
    }
  }

  private wsSend(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
      return true;
    }
    return false;
  }

  onWsMessage(type: string, callback: (data: any) => void) {
    if (!this.wsCallbacks.has(type)) {
      this.wsCallbacks.set(type, []);
    }
    this.wsCallbacks.get(type)!.push(callback);
  }

  // ============ PROMPTS ============
  async getPrompts(): Promise<Prompt[]> {
    if (isAppwriteConfigured) {
      try {
        const result = await databases.listDocuments(DB_ID, COLLECTION_PROMPTS);
        return result.documents as unknown as Prompt[];
      } catch {
        return mockPrompts;
      }
    }
    return mockPrompts;
  }

  // ============ SESSIONS ============
  async joinSession(code: string, nickname: string): Promise<Student | null> {
    if (this.isWsConnected) {
      return new Promise((resolve) => {
        const handler = (payload: any) => {
          resolve(payload.student);
        };
        this.onWsMessage('init', handler);
        this.wsSend('join', { sessionCode: code, nickname });
      });
    }

    if (isAppwriteConfigured) {
      try {
        const session = await databases.listDocuments(
          DB_ID, 
          COLLECTION_SESSIONS,
          [Query.equal('code', code)]
        );
        
        if (session.documents.length === 0) {
          return null;
        }

        const newStudent = await databases.createDocument(
          DB_ID,
          COLLECTION_STUDENTS,
          'unique()',
          { session_code: code, nickname }
        );
        return newStudent as unknown as Student;
      } catch {
        return this.createMockStudent(code, nickname);
      }
    }

    return this.createMockStudent(code, nickname);
  }

  private createMockStudent(code: string, nickname: string): Student {
    return {
      id: `student-${Date.now()}`,
      session_code: code,
      nickname,
      created_at: new Date().toISOString(),
    };
  }

  // ============ PROJECTS ============
  async createProject(data: Partial<WritingProject>): Promise<WritingProject> {
    if (this.isWsConnected) {
      this.wsSend('createProject', data);
      return new Promise((resolve) => {
        this.onWsMessage('projectCreated', resolve);
      });
    }

    if (isAppwriteConfigured) {
      try {
        const doc = await databases.createDocument(
          DB_ID,
          COLLECTION_PROJECTS,
          'unique()',
          data
        );
        return doc as unknown as WritingProject;
      } catch {
        return this.createMockProject(data);
      }
    }

    return this.createMockProject(data);
  }

  async updateProject(id: string, updates: Partial<WritingProject>): Promise<WritingProject | null> {
    if (this.isWsConnected) {
      this.wsSend('updateProject', { projectId: id, updates });
      return null; // Will be synced via broadcast
    }

    if (isAppwriteConfigured) {
      try {
        const doc = await databases.updateDocument(
          DB_ID,
          COLLECTION_PROJECTS,
          id,
          updates
        );
        return doc as unknown as WritingProject;
      } catch {
        return null;
      }
    }
    return null;
  }

  async publishProject(id: string): Promise<WritingProject | null> {
    if (this.isWsConnected) {
      this.wsSend('publishProject', { projectId: id });
      return null;
    }

    if (isAppwriteConfigured) {
      try {
        const doc = await databases.updateDocument(
          DB_ID,
          COLLECTION_PROJECTS,
          id,
          { is_published: true, published_at: new Date().toISOString() }
        );
        return doc as unknown as WritingProject;
      } catch {
        return null;
      }
    }
    return null;
  }

  async getPublishedProjects(): Promise<WritingProject[]> {
    if (this.isWsConnected) {
      this.wsSend('requestGallery', {});
      return new Promise((resolve) => {
        this.onWsMessage('galleryData', resolve);
      });
    }

    if (isAppwriteConfigured) {
      try {
        const result = await databases.listDocuments(
          DB_ID,
          COLLECTION_PROJECTS,
          [Query.equal('is_published', true), Query.orderDesc('published_at')]
        );
        return result.documents as unknown as WritingProject[];
      } catch {
        return mockProjects.filter((p) => p.is_published);
      }
    }

    return mockProjects.filter((p) => p.is_published);
  }

  private createMockProject(data: Partial<WritingProject>): WritingProject {
    return {
      id: `proj-${Date.now()}`,
      student_id: data.student_id || '',
      prompt_id: data.prompt_id || '',
      selected_type: data.selected_type || 'cronica',
      content: data.content || '',
      ai_interactions: 0,
      is_published: false,
      updated_at: new Date().toISOString(),
      ...data,
    } as WritingProject;
  }
}

export const narraService = new NarraService();
