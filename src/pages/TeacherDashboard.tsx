import { useEffect, useState } from 'react';
import { pb, isPocketBaseConfigured } from '../lib/pocketbase';
import { mockProjects } from '../lib/mockData';
import type { WritingProject } from '../types';

export default function TeacherDashboard() {
  const [projects, setProjects] = useState<WritingProject[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');

  useEffect(() => {
    const loadProjects = async () => {
      if (isPocketBaseConfigured) {
        const result = await pb.collection('writing_projects').getList(1, 100, {
          sort: '-updated_at',
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
        setProjects(mockProjects);
      }
    };

    loadProjects();
    const interval = setInterval(loadProjects, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (filter === 'draft') return !p.is_published;
    if (filter === 'published') return p.is_published;
    return true;
  });

  const stats = {
    total: projects.length,
    published: projects.filter((p) => p.is_published).length,
    drafts: projects.filter((p) => !p.is_published).length,
  };

  return (
    <div className="min-h-screen bg-paper px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-6">Dashboard Docente</h2>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm">
            <div className="text-3xl font-bold text-ink">{stats.total}</div>
            <div className="text-sm text-gray-500">Total textos</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm">
            <div className="text-3xl font-bold text-green-600">{stats.published}</div>
            <div className="text-sm text-gray-500">Publicados</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm">
            <div className="text-3xl font-bold text-amber-600">{stats.drafts}</div>
            <div className="text-sm text-gray-500">En progreso</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'draft', 'published'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-ink text-paper'
                  : 'bg-white text-gray-600 border border-[var(--border)] hover:border-ink'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'draft' ? 'Borradores' : 'Publicados'}
            </button>
          ))}
        </div>

        {/* Projects list */}
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        project.is_published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {project.is_published ? 'Publicado' : 'Borrador'}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">{project.selected_type}</span>
                    <span className="text-sm text-gray-400">
                      {project.student?.nickname || 'Anónimo'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2">
                    {project.prompt?.title || 'Sin título'}
                  </h3>
                  <div
                    className="prose prose-sm max-w-none text-gray-700 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                </div>
                <div className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                  {new Date(project.updated_at).toLocaleString('es-CO')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
