import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { pb, isPocketBaseConfigured } from '../lib/pocketbase';
import { mockProjects } from '../lib/mockData';
import type { WritingProject } from '../types';

export default function ClassGallery() {
  const [projects, setProjects] = useState<WritingProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { sessionCode, setScreen } = useAppStore();

  useEffect(() => {
    const loadProjects = async () => {
      if (isPocketBaseConfigured) {
        const result = await pb.collection('writing_projects').getList(1, 100, {
          filter: 'is_published = true',
          sort: '-published_at',
          expand: 'prompt,student',
        });
        if (result.items.length > 0) {
          const mapped = result.items.map((item: any) => ({
            ...item,
            prompt: item.expand?.prompt,
            student: item.expand?.student,
          }));
          setProjects(mapped as WritingProject[]);
        } else {
          setProjects([]);
        }
      } else {
        setProjects(mockProjects.filter((p) => p.is_published));
      }
      setIsLoading(false);
    };

    loadProjects();

    // Subscribe to realtime updates if PocketBase is configured
    if (isPocketBaseConfigured) {
      pb.collection('writing_projects').subscribe('*', () => {
        loadProjects();
      });
    }

    return () => {
      if (isPocketBaseConfigured) {
        pb.collection('writing_projects').unsubscribe('*');
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="animate-spin text-2xl">⟳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold">Galería del Salón</h2>
            <p className="text-gray-600">Sesión: {sessionCode}</p>
          </div>
          <button
            onClick={() => setScreen('welcome')}
            className="px-4 py-2 border-2 border-ink text-ink rounded-lg hover:bg-ink hover:text-paper transition-all"
          >
            Nueva sesión
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aún no hay textos publicados en esta sesión.</p>
            <p className="text-gray-400 mt-2">Sé el primero en publicar tu historia del territorio.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-md border border-[var(--border)] hover:shadow-lg transition-shadow"
              >
                {project.prompt?.image_url && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={project.prompt.image_url}
                      alt={project.prompt.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-gray-500">
                      {project.selected_type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {project.student?.nickname || 'Anónimo'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2">
                    {project.prompt?.title || 'Sin título'}
                  </h3>
                  <div
                    className="prose prose-sm max-w-none text-gray-700 line-clamp-6"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
