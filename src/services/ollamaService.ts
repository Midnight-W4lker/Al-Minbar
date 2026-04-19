import { env } from '@/config/env';
import type { ChatMessage } from "@/types";

const SYSTEM_INSTRUCTION = `
You are 'Noor', a knowledgeable and respectful Islamic assistant for the 'Al-Minbar' application.
Your Goal: Provide accurate, well-referenced answers strictly based on the Quran, Sahih Hadith, and established Fiqh.
Guidance Rules:
1.  **Sources**: Always cite your sources. Format citations as (Surah Name [No]: Ayah [No]) or (Book Name, Hadith [No]).
2.  **Humility**: If you do not know the answer based on the context or standard Islamic knowledge, explicitly state "I do not know" or "Allahu A'lam" (Allah knows best). Do not hallucinate religious rulings.
3.  **Neutrality**: Avoid sectarian bias. If there are multiple reputable opinions (e.g., differing schools of thought), mention them respectfully.
4.  **Prohibitions**: Do NOT issue personal Fatwas (religious decrees). You are an AI reference tool, not a Mufti.
5.  **Language**: Respond in the language the user asks (English or Urdu). If Urdu, use proper Nastaliq-friendly phrasing.
6.  **Tone**: Gentle, spiritual, and respectful.
`;

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaChatResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = env.VITE_OLLAMA_BASE_URL;
    this.model = env.VITE_OLLAMA_MODEL;
  }

  async sendMessage(history: ChatMessage[], userMessage: string): Promise<string> {
    try {
      const messages: OllamaMessage[] = [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...history.map((msg) => ({
          role: msg.role === 'model' ? 'assistant' as const : 'user' as const,
          content: msg.text,
        })),
        { role: 'user', content: userMessage },
      ];

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaChatResponse = await response.json();
      return data.message?.content || "Allahu A'lam. I could not generate a response.";
    } catch (error) {
      console.error("Ollama Error:", error);
      return "I apologize, I am currently unable to connect to the knowledge base. Please ensure Ollama is running locally and try again.";
    }
  }
}

let _instance: OllamaService | null = null;
export const getOllamaService = () => {
  if (!_instance) _instance = new OllamaService();
  return _instance;
};
