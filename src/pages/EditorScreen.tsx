import { useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAutoSave } from '../hooks/useAutoSave';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import TerritoryEditor from '../components/TerritoryEditor';
import SideCoach from '../components/SideCoach';
import { databases, isAppwriteConfigured, DB_ID, COLLECTION_PROJECTS } from '../lib/appwrite';
import type { WritingProject } from '../types';

export default function EditorScreen() {
  const { selectedPrompt, selectedType, student, project, setProject, setScreen } = useAppStore();
  const [content, setContent] = useState(project?.content || '');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const isOnline = useOnlineStatus();

  const saveProject = useCallback(async () => {
    if (!student || !selectedPrompt || !selectedType) return;

    setSaveStatus('saving');
    try {
      let savedProject;
      if (isAppwriteConfigured && isOnline) {
        if (project?.id) {
          savedProject = await databases.updateDocument(DB_ID, COLLECTION_PROJECTS, project.id, {
            content,
            updated_at: new Date().toISOString(),
          });
        } else {
          savedProject = await databases.createDocument(DB_ID, COLLECTION_PROJECTS, 'unique()', {
            student_id: student.id,
            prompt_id: selectedPrompt.id,
            selected_type: selectedType,
            content,
          });
        }
      } else {
        savedProject = {
          id: project?.id || `proj-${Date.now()}`,
          student_id: student.id,
          prompt_id: selectedPrompt.id,
          selected_type: selectedType,
          content,
          ai_interactions: project?.ai_interactions || 0,
          is_published: false,
          updated_at: new Date().toISOString(),
        };
      }

      if (savedProject) {
        setProject(savedProject as WritingProject);
      }
      setSaveStatus('saved');
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('unsaved');
    }
  }, [content, student, selectedPrompt, selectedType, project, setProject, isOnline]);

  const triggerAutoSave = useAutoSave(saveProject, 5000);

  const handleContentChange = (html: string) => {
    setContent(html);
    setSaveStatus('unsaved');
    triggerAutoSave();
  };

  const handlePublish = () => {
    saveProject();
    setScreen('publish');
  };

  if (!selectedPrompt || !selectedType) {
    setScreen('wizard');
    return null;
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setScreen('wizard')}
            className="text-gray-500 hover:text-ink transition-colors"
          >
            ← Volver
          </button>
          <div>
            <h1 className="font-serif font-bold text-lg">{selectedPrompt.title}</h1>
            <p className="text-sm text-gray-500 capitalize">{selectedType}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {!isOnline && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                Modo desconectado
              </span>
            )}
            <span
              className={`text-xs ${
                saveStatus === 'saved'
                  ? 'text-green-600'
                  : saveStatus === 'saving'
                  ? 'text-amber-600'
                  : 'text-gray-400'
              }`}
            >
              {saveStatus === 'saved' ? 'Guardado' : saveStatus === 'saving' ? 'Guardando...' : 'Sin guardar'}
            </span>
          </div>
          <button
            onClick={handlePublish}
            className="px-6 py-2 bg-ink text-paper rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Terminar y Publicar
          </button>
        </div>
      </header>

      {/* Stimulus image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={selectedPrompt.image_url}
          alt={selectedPrompt.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <p className="text-lg font-serif italic">{selectedPrompt.description}</p>
          </div>
        </div>
      </div>

      {/* Split screen layout */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-[70] overflow-y-auto p-6">
          <TerritoryEditor content={content} onChange={handleContentChange} />
        </div>
        <div className="flex-[30] border-l border-[var(--border)] p-4 overflow-y-auto bg-paper">
          <SideCoach currentText={content} />
        </div>
      </div>
    </div>
  );
}
