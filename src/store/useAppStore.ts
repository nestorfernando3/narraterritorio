import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppScreen, Prompt, TextType, WritingProject, Student, AIInteraction } from '../types';

interface AppState {
  // Navigation
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;

  // Session
  sessionCode: string | null;
  setSessionCode: (code: string | null) => void;

  // Student
  student: Student | null;
  setStudent: (student: Student | null) => void;

  // Wizard selection
  selectedPrompt: Prompt | null;
  setSelectedPrompt: (prompt: Prompt | null) => void;

  selectedType: TextType | null;
  setSelectedType: (type: TextType | null) => void;

  // Editor
  project: WritingProject | null;
  setProject: (project: WritingProject | null) => void;

  // AI Coach
  aiInteractions: AIInteraction[];
  aiCallsRemaining: number;
  addAIInteraction: (interaction: AIInteraction) => void;
  decrementAICalls: () => void;

  // Offline mode
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  // Reset
  resetSession: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      screen: 'welcome',
      setScreen: (screen) => set({ screen }),

      sessionCode: null,
      setSessionCode: (sessionCode) => set({ sessionCode }),

      student: null,
      setStudent: (student) => set({ student }),

      selectedPrompt: null,
      setSelectedPrompt: (selectedPrompt) => set({ selectedPrompt }),

      selectedType: null,
      setSelectedType: (selectedType) => set({ selectedType }),

      project: null,
      setProject: (project) => set({ project }),

      aiInteractions: [],
      aiCallsRemaining: 3,
      addAIInteraction: (interaction) =>
        set((state) => ({
          aiInteractions: [...state.aiInteractions, interaction],
        })),
      decrementAICalls: () =>
        set((state) => ({
          aiCallsRemaining: Math.max(0, state.aiCallsRemaining - 1),
        })),

      isOnline: navigator.onLine,
      setIsOnline: (isOnline) => set({ isOnline }),

      resetSession: () =>
        set({
          screen: 'welcome',
          sessionCode: null,
          student: null,
          selectedPrompt: null,
          selectedType: null,
          project: null,
          aiInteractions: [],
          aiCallsRemaining: 3,
        }),
    }),
    {
      name: 'narraterritorio-storage',
      partialize: (state) => ({
        sessionCode: state.sessionCode,
        student: state.student,
        selectedPrompt: state.selectedPrompt,
        selectedType: state.selectedType,
        project: state.project,
        aiInteractions: state.aiInteractions,
        aiCallsRemaining: state.aiCallsRemaining,
      }),
    }
  )
);
