import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockProjects } from '../lib/mockData';
import type { WritingProject } from '../types';

export default function ClassGallery() {
  const [projects, setProjects] = useState<WritingProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { sessionCode, setScreen } = useAppStore();

  useEffect(() => {
    const loadProjects = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase
          .from('writing_projects')
          .select('*, prompt:prompts(*), student:students(*)')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (data) {
          setProjects(data as WritingProject[]);
        }
      } else {
        setProjects(mockProjects.filter((p) => p.is_published));
      }
      setIsLoading(false);
    };

    loadProjects();

    // Subscribe to realtime updates if Supabase is configured
    let subscription: ReturnType<typeof supabase.channel> | null = null;
    if (isSupabaseConfigured) {
      subscription = supabase
        .channel('writing_projects_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'writing_projects' },
          () => {
            loadProjects();
          }
        )
        .subscribe();
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
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
