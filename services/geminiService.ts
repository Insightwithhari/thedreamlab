import { Message, MessageAuthor } from '../types';

export async function sendMessage(history: Message[], newMessage: string): Promise<string> {
  // Map the rich frontend message format to a simpler format for the backend.
  const historyForBackend = history.map(msg => ({
    author: msg.author,
    content: msg.rawContent || (typeof msg.content === 'string' ? msg.content : ''),
    id: msg.id,
  }));

  // Add the new user message to the history being sent.
  historyForBackend.push({
      author: MessageAuthor.USER,
      content: newMessage,
      id: 'new-message',
  });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: historyForBackend }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend Error:", errorData);
      throw new Error(errorData.error || 'The request to the backend failed.');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error sending message to backend:", error);
    return "I'm sorry, I encountered an error while processing your request. Please check the console for more details.";
  }
}
