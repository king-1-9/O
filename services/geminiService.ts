import { GoogleGenAI, Chat } from '@google/genai';

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private chat: Chat | null = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  public async initChat(systemInstruction: string = 'You are a helpful and professional IT tutor assistant for first-year students.') {
    if (!this.ai) return;

    this.chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
    });
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.ai || !this.chat) {
      return "AI Service is not initialized or API Key is missing.";
    }

    try {
      const response = await this.chat.sendMessage({ message });
      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Sorry, I encountered an error connecting to the AI service.";
    }
  }
}

export const geminiService = new GeminiService();
