import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { useAppStore } from '../store/useAppStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function PublishScreen() {
  const { selectedPrompt, student, project, setProject, setScreen } = useAppStore();
  const posterRef = useRef<HTMLDivElement>(null);

  const handlePublish = async () => {
    if (!project || !student) return;

    try {
      let updatedProject;
      if (isSupabaseConfigured) {
        const { data } = await supabase
          .from('writing_projects')
          .update({
            is_published: true,
            published_at: new Date().toISOString(),
          })
          .eq('id', project.id)
          .select()
          .single();
        updatedProject = data;
      } else {
        updatedProject = {
          ...project,
          is_published: true,
          published_at: new Date().toISOString(),
        };
      }

      if (updatedProject) {
        setProject(updatedProject);
      }
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  const downloadImage = useCallback(async () => {
    if (posterRef.current === null) return;

    try {
      const dataUrl = await toPng(posterRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `narraterritorio-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export error:', err);
      alert('Error al exportar la imagen. Intenta de nuevo.');
    }
  }, [posterRef]);

  if (!selectedPrompt || !project) {
    setScreen('editor');
    return null;
  }

  return (
    <div className="min-h-screen bg-paper px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold mb-2">¡Tu texto está listo!</h2>
          <p className="text-gray-600">Así se ve tu creación del territorio</p>
        </div>

        {/* Poster */}
        <div
          ref={posterRef}
          className="bg-white rounded-2xl overflow-hidden shadow-xl border border-[var(--border)]"
        >
          <div className="h-64 overflow-hidden relative">
            <img
              src={selectedPrompt.image_url}
              alt={selectedPrompt.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="text-xs uppercase tracking-wider opacity-80">{project.selected_type}</span>
              <h3 className="text-2xl font-serif font-bold mt-1">{selectedPrompt.title}</h3>
              <p className="text-sm opacity-90 mt-1">por {student?.nickname || 'Anónimo'}</p>
            </div>
          </div>
          <div className="p-8">
            <div
              className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </div>
          <div className="px-8 py-4 bg-[#faf8f3] border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-wider">NarraTerritorio ✍️🗺️</span>
            <span className="text-xs text-gray-400">{new Date().toLocaleDateString('es-CO')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 justify-center">
          {!project.is_published && (
            <button
              onClick={handlePublish}
              className="px-8 py-3 bg-ink text-paper rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Publicar en la galería
            </button>
          )}
          <button
            onClick={downloadImage}
            className="px-8 py-3 border-2 border-ink text-ink rounded-xl font-medium hover:bg-ink hover:text-paper transition-all"
          >
            Descargar imagen
          </button>
        </div>

        {project.is_published && (
          <div className="mt-6 text-center">
            <p className="text-green-600 font-medium mb-4">✓ Publicado en la galería del salón</p>
            <button
              onClick={() => setScreen('gallery')}
              className="text-ink underline hover:no-underline"
            >
              Ver galería de la clase
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => setScreen('editor')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Seguir editando
          </button>
        </div>
      </div>
    </div>
  );
}
