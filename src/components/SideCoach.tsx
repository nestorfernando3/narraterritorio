import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateAIQuestion, getAvailableProvider } from '../lib/aiService';
import type { AIInteraction } from '../types';

interface SideCoachProps {
  currentText: string;
}

export default function SideCoach({ currentText }: SideCoachProps) {
  const [activeTab, setActiveTab] = useState<'planificar' | 'inspiracion' | 'sugerencias'>('planificar');
  const [isLoading, setIsLoading] = useState(false);
  const { selectedType, aiCallsRemaining, decrementAICalls, addAIInteraction } = useAppStore();
  const providerName = getAvailableProvider();

  const askAI = async () => {
    if (aiCallsRemaining <= 0 || !selectedType) return;
    if (!currentText || currentText.length < 20) {
      alert('Escribe al menos unas cuantas líneas para que el coach pueda ayudarte.');
      return;
    }

    setIsLoading(true);
    try {
      const question = await generateAIQuestion(currentText, selectedType);

      const interaction: AIInteraction = {
        id: Date.now().toString(),
        question,
        timestamp: Date.now(),
      };

      addAIInteraction(interaction);
      decrementAICalls();
    } catch (err) {
      console.error('AI error:', err);
      const fallbackQuestion = '¿Qué olor o sonido podrías describir aquí para que el lector sienta que está en ese lugar?';
      addAIInteraction({
        id: Date.now().toString(),
        question: fallbackQuestion,
        timestamp: Date.now(),
      });
      decrementAICalls();
    } finally {
      setIsLoading(false);
    }
  };

  const planificarContent = (
    <div className="space-y-4">
      <div className="bg-[#faf8f3] p-4 rounded-lg border border-[var(--border)]">
        <h4 className="font-serif font-bold mb-2">Estructura sugerida</h4>
        {selectedType === 'microcuento' && (
          <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
            <li>Inicio impactante (una imagen, un sonido)</li>
            <li>Desarrollo en una sola escena</li>
            <li>Final con giros o revelación</li>
          </ul>
        )}
        {selectedType === 'cronica' && (
          <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
            <li>Descripción del lugar y momento</li>
            <li>Personajes y acciones</li>
            <li>Reflexión o significado</li>
          </ul>
        )}
        {selectedType === 'carta' && (
          <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
            <li>Saludo y contexto</li>
            <li>Cuerpo: mensaje principal</li>
            <li>Despedida emotiva</li>
          </ul>
        )}
        {selectedType === 'ensayo' && (
          <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
            <li>Tesis o idea central</li>
            <li>Argumentos con ejemplos</li>
            <li>Conclusión reflexiva</li>
          </ul>
        )}
      </div>
    </div>
  );

  const inspiracionContent = (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 mb-3">Palabras clave del territorio para inspirarte:</p>
      <div className="flex flex-wrap gap-2">
        {['brisa', 'mangle', 'cumbia', 'sancocho', 'arroyo', 'palmera', 'hamaca', 'carnaval', 'mar', 'arena', 'coconut', 'vallenato', 'soleá', 'champeta', 'patacón'].map((word) => (
          <span key={word} className="px-3 py-1 bg-[#f0ebe0] text-[#5c4d3c] rounded-full text-sm font-medium">
            {word}
          </span>
        ))}
      </div>
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm italic text-amber-800">
          "Escribe lo que conozcas, pero sobre todo, escribe lo que sientas. El territorio no es solo geografía, es memoria."
        </p>
      </div>
    </div>
  );

  const sugerenciasContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Llamadas restantes:</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i <= aiCallsRemaining ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Coach: {providerName}
      </div>

      <button
        onClick={askAI}
        disabled={aiCallsRemaining <= 0 || isLoading}
        className="w-full py-3 bg-ink text-paper rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⟳</span>
            Pensando...
          </>
        ) : (
          <>
            💡 Pedir sugerencia
          </>
        )}
      </button>

      {aiCallsRemaining <= 0 && (
        <p className="text-xs text-center text-amber-700 bg-amber-50 p-2 rounded">
          Has usado tus 3 sugerencias. Confía en tu voz y sigue escribiendo.
        </p>
      )}

      <div className="space-y-3 mt-4">
        {useAppStore.getState().aiInteractions.map((interaction) => (
          <div key={interaction.id} className="p-3 bg-white border border-[var(--border)] rounded-lg shadow-sm">
            <p className="text-sm text-gray-800">{interaction.question}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-[#faf8f3] rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="flex border-b border-[var(--border)]">
        {(['planificar', 'inspiracion', 'sugerencias'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-white text-ink border-b-2 border-ink'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'inspiracion' ? 'Inspiración' : tab}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'planificar' && planificarContent}
        {activeTab === 'inspiracion' && inspiracionContent}
        {activeTab === 'sugerencias' && sugerenciasContent}
      </div>
    </div>
  );
}
