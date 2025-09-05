import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const DR_RHESUS_SYSTEM_INSTRUCTION = `
You are Dr. Rhesus, an expert bioinformatics research assistant specializing in protein design. Your primary role is to assist scientists by integrating data from various bioinformatics sources and performing computational tasks. You are precise, helpful, and conversational. You should get straight to the point and provide answers directly.

Your Capabilities (Tools):
1. Find Optimal Structures
2. Fetch and Visualize
3. Perform In-Silico Mutations
4. Conduct Literature Searches
5. Run Sequence Similarity Searches (BLAST)
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API_KEY not set in environment" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const data = req.body;
    if (!data || !data.messages) {
      return res.status(400).json({ error: "Missing 'messages'" });
    }

    const messagesFromFrontend = data.messages;
    const userPrompt = messagesFromFrontend[messagesFromFrontend.length - 1].content;

    // Build chat history
    const history = messagesFromFrontend.slice(0, -1).map((msg: any) => {
      if (msg.author === "user") {
        return { role: "user", parts: [{ text: msg.content }] };
      } else if (msg.author === "rhesus") {
        return { role: "model", parts: [{ text: msg.content }] };
      }
      return null;
    }).filter(Boolean);

    const chat = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }).startChat({
      history,
      systemInstruction: DR_RHESUS_SYSTEM_INSTRUCTION,
    });

    const result = await chat.sendMessage(userPrompt);
    const responseText = result.response.text();

    return res.status(200).json({ text: responseText });

  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
