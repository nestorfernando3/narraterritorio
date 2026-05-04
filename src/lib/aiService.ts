export interface AIProvider {
  name: string;
  generate(prompt: string, textType: string): Promise<string>;
  isAvailable(): boolean;
}

class OllamaProvider implements AIProvider {
  name = 'Ollama (Local)';
  private url = 'http://localhost:11434/api/generate';

  isAvailable() {
    return true; // Always try, fails gracefully
  }

  async generate(prompt: string, textType: string): Promise<string> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: `Actúa como un profesor de escritura creativa colombiano. El estudiante está escribiendo una ${textType} sobre el territorio del Caribe colombiano. NO resuelvas el texto ni corrijas la gramática. Lee lo que lleva escrito y hazle UNA pregunta inspiradora para que describa mejor los sentidos (olor, sonido, vista) o expanda un detalle.\n\nTexto del estudiante:\n${prompt}\n\nPregunta inspiradora:`,
        stream: false,
      }),
    });

    if (!response.ok) throw new Error('Ollama no responde');
    const data = await response.json();
    return data.response?.trim() || '';
  }
}

class GroqProvider implements AIProvider {
  name = 'Groq Cloud';
  private apiKey: string;
  private url = 'https://api.groq.com/openai/v1/chat/completions';

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
  }

  isAvailable() {
    return this.apiKey.length > 10;
  }

  async generate(prompt: string, textType: string): Promise<string> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-3b-preview',
        messages: [
          {
            role: 'system',
            content: 'Eres un profesor de escritura creativa colombiano. NUNCA corrijas gramática ni escribas por el estudiante. Solo haces UNA pregunta inspiradora breve para ayudar a expandir descripciones sensoriales.',
          },
          {
            role: 'user',
            content: `El estudiante está escribiendo una ${textType} sobre el territorio del Caribe colombiano. Este es su texto:\n\n${prompt}\n\nHazle UNA pregunta inspiradora de máximo 2 oraciones para que describa mejor los sentidos (olor, sonido, vista, tacto) o expanda un detalle específico.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Groq API error');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }
}

class GeminiProvider implements AIProvider {
  name = 'Google Gemini';
  private apiKey: string;
  private url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  isAvailable() {
    return this.apiKey.length > 10;
  }

  async generate(prompt: string, textType: string): Promise<string> {
    const response = await fetch(`${this.url}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Actúa como un profesor de escritura creativa colombiano. El estudiante está escribiendo una ${textType} sobre el territorio del Caribe colombiano. NO resuelvas el texto ni corrijas la gramática. Lee lo que lleva escrito y hazle UNA pregunta inspiradora breve (máximo 2 oraciones) para que describa mejor los sentidos (olor, sonido, vista) o expanda un detalle específico.\n\nTexto del estudiante:\n${prompt}\n\nPregunta inspiradora:`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 150,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  }
}

// Priority: Groq → Gemini → Ollama
const providers = [new GroqProvider(), new GeminiProvider(), new OllamaProvider()];

export async function generateAIQuestion(text: string, textType: string): Promise<string> {
  const errors: string[] = [];

  for (const provider of providers) {
    if (!provider.isAvailable()) continue;

    try {
      const result = await provider.generate(text, textType);
      if (result && result.length > 10) {
        return result;
      }
    } catch (err) {
      errors.push(`${provider.name}: ${(err as Error).message}`);
      console.warn(`AI provider ${provider.name} failed:`, err);
    }
  }

  console.error('All AI providers failed:', errors);
  return '¿Qué olor o sonido podrías describir aquí para que el lector sienta que está en ese lugar?';
}

export function getAvailableProvider(): string {
  const available = providers.find((p) => p.isAvailable());
  return available?.name || 'Ninguno (modo offline)';
}
