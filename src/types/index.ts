export type TextType = 'microcuento' | 'cronica' | 'carta' | 'ensayo';

export interface Prompt {
  id: string;
  title: string;
  image_url: string;
  description: string;
  keywords: string[];
}

export interface WritingProject {
  id: string;
  student_id: string;
  prompt_id: string;
  selected_type: TextType;
  content: string;
  ai_interactions: number;
  is_published: boolean;
  published_at?: string;
  updated_at: string;
  prompt?: Prompt;
  student?: Student;
}

export interface Student {
  id: string;
  nickname: string;
  session_code: string;
  created_at: string;
}

export interface Session {
  id: string;
  code: string;
  teacher_id?: string;
  created_at: string;
  expires_at?: string;
}

export type AppScreen = 'welcome' | 'wizard' | 'editor' | 'publish' | 'gallery' | 'teacher-dashboard';

export interface AIInteraction {
  id: string;
  question: string;
  timestamp: number;
}
