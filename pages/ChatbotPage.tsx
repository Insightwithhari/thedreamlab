

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { Message, MessageAuthor } from '../types';
import { createChatSession, sendMessage } from '../services/geminiService';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import { RhesusIcon, DownloadIcon } from '../components/icons';
import PDBViewer from '../components/PDBViewer';

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      author: MessageAuthor.RHESUS,
      content: "Greetings. I am Dr. Rhesus, your bioinformatics research assistant. How may I help you today? You can ask me to find, visualize, or mutate protein structures, or to search for relevant literature."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);

  const handleDownload = (filename: string, pdbId: string) => {
    fetch(`https://files.rcsb.org/view/${pdbId}.pdb`)
      .then(response => response.text())
      .then(data => {
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error downloading PDB file:', error));
  };

  const parseResponse = (responseText: string): React.ReactNode => {
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    const regex = /\[(PDB_VIEW|MUTATION_DOWNLOAD|BLAST_RESULT|PUBMED_SUMMARY|INTERACTION_VIEW|SURFACE_VIEW):([^\]]+)\]/g;
    
    let match;
    while ((match = regex.exec(responseText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(responseText.substring(lastIndex, match.index));
      }
      
      const [fullMatch, command, payload] = match;
      
      switch (command) {
        case 'PDB_VIEW':
          parts.push(<PDBViewer key={`${command}-${payload}`} pdbId={payload.trim()} style="cartoon" />);
          break;
        case 'INTERACTION_VIEW': {
            const [pdbId, chain1, chain2] = payload.trim().split(':');
            if (pdbId && chain1 && chain2) {
              parts.push(<PDBViewer key={`${command}-${payload}`} pdbId={pdbId} style="interaction" interaction={{ chain1, chain2 }} />);
            }
            break;
          }
        case 'SURFACE_VIEW':
            parts.push(<PDBViewer key={`${command}-${payload}`} pdbId={payload.trim()} style="surface" />);
            break;
        case 'MUTATION_DOWNLOAD': {
            const filename = payload.trim();
            const pdbId = filename.split('_')[0];
            parts.push(
              <div key={`${command}-${payload}`} className="mt-4">
                <button
                  onClick={() => handleDownload(filename, pdbId)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cyan-600 border border-transparent rounded-md shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  <DownloadIcon />
                  Download {filename}
                </button>
              </div>
            );
          break;
        }
        case 'BLAST_RESULT':
          parts.push(
            <div key={`${command}-${payload}`} className="mt-4 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <h4 className="text-sm font-bold text-gray-300 p-3 bg-gray-700/50">BLAST Search Results</h4>
                <pre className="whitespace-pre p-3 font-mono text-xs max-h-96 overflow-auto">{payload.trim()}</pre>
            </div>
          );
          break;
        case 'PUBMED_SUMMARY':
          parts.push(<div key={`${command}-${payload}`} className="mt-4 p-3 border-l-4 border-cyan-500 bg-gray-800 rounded-r-md">{payload.trim()}</div>);
          break;
      }
      lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < responseText.length) {
      parts.push(responseText.substring(lastIndex));
    }
    
    return <>{parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</>;
  };

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (isLoading) return;

    setIsLoading(true);

    if (!chatRef.current) {
      chatRef.current = createChatSession();
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      author: MessageAuthor.USER,
      content: messageText
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const responseText = await sendMessage(chatRef.current, messageText);
      const parsedContent = parseResponse(responseText);

      const rhesusMessage: Message = {
        id: (Date.now() + 1).toString(),
        author: MessageAuthor.RHESUS,
        content: parsedContent,
      };

      setMessages(prev => [...prev, rhesusMessage]);
    } catch (error) {
        console.error("Failed to get response:", error);
        const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            author: MessageAuthor.RHESUS,
            content: "I'm sorry, an error occurred. Please try again."
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-full">
        <header className="flex items-center p-4 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 shadow-md">
            <RhesusIcon className="w-8 h-8 text-cyan-400"/>
            <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-100">Dr. Rhesus</h1>
                <p className="text-sm text-gray-400">Bioinformatics Research Assistant</p>
            </div>
        </header>
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatbotPage;
