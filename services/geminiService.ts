
import { GoogleGenAI, Chat } from "@google/genai";
import { DR_RHESUS_SYSTEM_INSTRUCTION } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export function createChatSession(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: DR_RHESUS_SYSTEM_INSTRUCTION,
    },
  });
  return chat;
}

export async function sendMessage(chat: Chat, message: string): Promise<string> {
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "I'm sorry, I encountered an error while processing your request. Please check the console for more details.";
  }
}
