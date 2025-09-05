import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "API_KEY not set in environment" });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const data = req.body;
    if (!data || !data.messages) {
      res.status(400).json({ error: "Missing 'messages'" });
      return;
    }

    const messagesFromFrontend = data.messages;
    const userPrompt = messagesFromFrontend[messagesFromFrontend.length - 1].content;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(userPrompt);

    res.status(200).json({ text: result.response.text() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
}
