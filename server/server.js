const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'session-data.json');

// In-memory data store
let data = {
  sessions: {}, // key: sessionCode, value: { students: [], projects: [] }
};

// Load from disk if exists
try {
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log('📁 Loaded data from disk');
  }
} catch (err) {
  console.warn('Could not load data:', err.message);
}

// Save to disk
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn('Could not save data:', err.message);
  }
}

// Auto-save every 10 seconds
setInterval(saveData, 10000);

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Track connected clients per session
const clients = new Map(); // ws -> { sessionCode, studentId }

function broadcast(sessionCode, message, excludeWs = null) {
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      const info = clients.get(client);
      if (info && info.sessionCode === sessionCode) {
        client.send(JSON.stringify(message));
      }
    }
  });
}

wss.on('connection', (ws) => {
  console.log('🔗 Client connected');
  clients.set(ws, { sessionCode: null, studentId: null });

  ws.on('message', (rawMessage) => {
    try {
      const msg = JSON.parse(rawMessage);
      const { type, payload } = msg;
      const info = clients.get(ws);

      switch (type) {
        case 'join': {
          const { sessionCode, nickname } = payload;
          const studentId = `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          if (!data.sessions[sessionCode]) {
            data.sessions[sessionCode] = { students: [], projects: [] };
          }

          const student = { id: studentId, nickname, sessionCode, joinedAt: Date.now() };
          data.sessions[sessionCode].students.push(student);
          clients.set(ws, { sessionCode, studentId });

          // Send current state to new client
          ws.send(JSON.stringify({
            type: 'init',
            payload: {
              student,
              projects: data.sessions[sessionCode].projects,
            }
          }));

          // Notify others
          broadcast(sessionCode, {
            type: 'studentJoined',
            payload: student,
          }, ws);

          console.log(`👤 ${nickname} joined session ${sessionCode}`);
          break;
        }

        case 'createProject': {
          if (!info.sessionCode) return;
          const project = {
            id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...payload,
            studentId: info.studentId,
            aiInteractions: 0,
            isPublished: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          
          data.sessions[info.sessionCode].projects.push(project);
          
          ws.send(JSON.stringify({
            type: 'projectCreated',
            payload: project,
          }));

          console.log(`📝 Project created in session ${info.sessionCode}`);
          break;
        }

        case 'updateProject': {
          if (!info.sessionCode) return;
          const { projectId, updates } = payload;
          const project = data.sessions[info.sessionCode].projects.find(
            (p) => p.id === projectId
          );
          
          if (project) {
            Object.assign(project, updates, { updatedAt: Date.now() });
            
            // Notify all clients in session about the update
            broadcast(info.sessionCode, {
              type: 'projectUpdated',
              payload: project,
            });

            saveData();
          }
          break;
        }

        case 'publishProject': {
          if (!info.sessionCode) return;
          const { projectId } = payload;
          const project = data.sessions[info.sessionCode].projects.find(
            (p) => p.id === projectId
          );
          
          if (project) {
            project.isPublished = true;
            project.publishedAt = Date.now();
            
            broadcast(info.sessionCode, {
              type: 'projectPublished',
              payload: project,
            });

            saveData();
            console.log(`🎉 Project published in session ${info.sessionCode}`);
          }
          break;
        }

        case 'requestGallery': {
          if (!info.sessionCode) return;
          const publishedProjects = data.sessions[info.sessionCode].projects.filter(
            (p) => p.isPublished
          );
          
          ws.send(JSON.stringify({
            type: 'galleryData',
            payload: publishedProjects,
          }));
          break;
        }

        case 'teacherDashboard': {
          const { sessionCode } = payload;
          if (!data.sessions[sessionCode]) {
            ws.send(JSON.stringify({
              type: 'teacherData',
              payload: { students: [], projects: [] },
            }));
            return;
          }
          
          ws.send(JSON.stringify({
            type: 'teacherData',
            payload: {
              students: data.sessions[sessionCode].students,
              projects: data.sessions[sessionCode].projects,
            },
          }));
          break;
        }

        default:
          console.log('Unknown message type:', type);
      }
    } catch (err) {
      console.error('Error handling message:', err);
      ws.send(JSON.stringify({ type: 'error', payload: err.message }));
    }
  });

  ws.on('close', () => {
    const info = clients.get(ws);
    if (info && info.sessionCode) {
      console.log(`👋 Client left session ${info.sessionCode}`);
    }
    clients.delete(ws);
  });
});

server.listen(PORT, () => {
  console.log(`
🚀 NarraTerritorio Sync Server running on ws://localhost:${PORT}

Para usar:
1. Corre este servidor en tu laptop
2. Los estudiantes abren la app en el navegador
3. Ingresan el mismo código de sesión (ej: RIO1)
4. ¡Listo! Todos sincronizados en tiempo real.

Datos guardados en: ${DATA_FILE}
  `);
});
