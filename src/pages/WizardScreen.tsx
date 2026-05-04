import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockPrompts } from '../lib/mockData';
import type { Prompt, TextType } from '../types';

export default function WizardScreen() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPromptLocal, setSelectedPromptLocal] = useState<Prompt | null>(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedPrompt, setSelectedType, setScreen } = useAppStore();

  useEffect(() => {
    const loadPrompts = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase.from('prompts').select('*');
        if (data && data.length > 0) {
          setPrompts(data);
        } else {
          setPrompts(mockPrompts);
        }
      } else {
        setPrompts(mockPrompts);
      }
      setIsLoading(false);
    };
    loadPrompts();
  }, []);

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPromptLocal(prompt);
    setShowTypeModal(true);
  };

  const handleSelectType = (type: TextType) => {
    setSelectedPrompt(selectedPromptLocal);
    setSelectedType(type);
    setScreen('editor');
  };

  const textTypes: { type: TextType; label: string; description: string }[] = [
    { type: 'microcuento', label: 'Microcuento', description: 'Una historia breve, intensa y memorable.' },
    { type: 'cronica', label: 'Crónica', description: 'Un relato periodístico con tu voz personal.' },
    { type: 'carta', label: 'Carta', description: 'Una carta íntima dirigida a alguien del territorio.' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="animate-spin text-2xl">⟳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold mb-2">Elige tu misión territorial</h2>
          <p className="text-gray-600">Selecciona un estímulo para comenzar a escribir</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handleSelectPrompt(prompt)}
              className="group bg-white rounded-xl overflow-hidden shadow-md border border-[var(--border)] hover:shadow-xl transition-all text-left"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={prompt.image_url}
                  alt={prompt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-serif font-bold text-lg mb-2">{prompt.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{prompt.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showTypeModal && selectedPromptLocal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-serif font-bold mb-2">{selectedPromptLocal.title}</h3>
            <p className="text-gray-600 mb-6">¿Qué formato quieres usar?</p>

            <div className="space-y-3">
              {textTypes.map(({ type, label, description }) => (
                <button
                  key={type}
                  onClick={() => handleSelectType(type)}
                  className="w-full p-4 border-2 border-[var(--border)] rounded-xl hover:border-ink hover:bg-paper transition-all text-left"
                >
                  <div className="font-bold text-lg">{label}</div>
                  <div className="text-sm text-gray-600">{description}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTypeModal(false)}
              className="w-full mt-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
