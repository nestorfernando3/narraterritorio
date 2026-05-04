import type { Prompt, WritingProject, Student } from '../types';

export const mockPrompts: Prompt[] = [
  {
    id: 'prompt-1',
    title: 'La tienda de la esquina',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    description: 'Escribe sobre ese lugar del barrio donde todos se reúnen, donde el tiempo parece detenerse y las historias fluyen como el café recién hecho.',
    keywords: ['comunidad', 'vecinos', 'café', 'historias', 'esquina'],
  },
  {
    id: 'prompt-2',
    title: 'El arroyo que nos vio crecer',
    image_url: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?w=800&q=80',
    description: 'Describe ese rincón natural que fue testigo de tus juegos de infancia, donde el agua cantaba y los árboles ofrecían sombra.',
    keywords: ['naturaleza', 'infancia', 'agua', 'árboles', 'memoria'],
  },
  {
    id: 'prompt-3',
    title: 'Un mito del barrio',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    description: 'Crea una historia basada en esa leyenda que todos los abuelos cuentan cuando cae la noche y el viento trae susurros del pasado.',
    keywords: ['leyenda', 'abuelos', 'noche', 'misterio', 'tradición'],
  },
];

export const mockProjects: WritingProject[] = [
  {
    id: 'proj-1',
    student_id: 'student-1',
    prompt_id: 'prompt-1',
    selected_type: 'cronica',
    content: '<p>La tienda de doña María sigue ahí, en la misma esquina donde la dejó el tiempo...</p>',
    ai_interactions: 2,
    is_published: true,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockStudents: Student[] = [
  {
    id: 'student-1',
    nickname: 'Escritor del Río',
    session_code: 'ABCD',
    created_at: new Date().toISOString(),
  },
];
