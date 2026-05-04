export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          description: string;
          keywords: string[];
        };
        Insert: {
          title: string;
          image_url: string;
          description: string;
          keywords?: string[];
        };
        Update: {
          title?: string;
          image_url?: string;
          description?: string;
          keywords?: string[];
        };
      };
      writing_projects: {
        Row: {
          id: string;
          student_id: string;
          prompt_id: string;
          selected_type: string;
          content: string;
          ai_interactions: number;
          is_published: boolean;
          published_at: string | null;
          updated_at: string;
        };
        Insert: {
          student_id: string;
          prompt_id: string;
          selected_type: string;
          content?: string;
          ai_interactions?: number;
          is_published?: boolean;
          published_at?: string | null;
        };
        Update: {
          student_id?: string;
          prompt_id?: string;
          selected_type?: string;
          content?: string;
          ai_interactions?: number;
          is_published?: boolean;
          published_at?: string | null;
        };
      };
      students: {
        Row: {
          id: string;
          nickname: string;
          session_code: string;
          created_at: string;
        };
        Insert: {
          nickname: string;
          session_code: string;
        };
        Update: {
          nickname?: string;
          session_code?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          code: string;
          teacher_id: string | null;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          code: string;
          teacher_id?: string | null;
          expires_at?: string | null;
        };
        Update: {
          code?: string;
          teacher_id?: string | null;
          expires_at?: string | null;
        };
      };
    };
  };
}
