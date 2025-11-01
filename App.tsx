
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message } from './types';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const GEMINI_SYSTEM_INSTRUCTION = `You are a helpful assistant and expert on a software called "Robô de Importação Automática de XML (Sefaz)". 
    Your function is to answer questions about this robot.
    Key features of the robot:
    - Function: Uses an A1 certificate to download issued and received NF-e (electronic invoices).
    - Execution process:
      1. Authenticates with the webservice.
      2. Stores the XML and PDF files of the invoices.
      3. Notifies the user about new invoices.
    Keep your answers concise and focused on these features unless asked otherwise.
    `;
    
  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const initializeChat = useCallback(() => {
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        },
      });
      setMessages([
        {
          role: 'model',
          content: 'Olá! Sou o assistente do Robô de Importação de XML. Como posso ajudar você hoje?',
        },
      ]);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unexpected error occurred during initialization.');
    }
  }, [GEMINI_SYSTEM_INSTRUCTION]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);


  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const result = await chatRef.current.sendMessage({ message: userInput });
      const modelResponse = result.text;
      const modelMessage: Message = { role: 'model', content: modelResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to get response from Gemini. ${errorMessage}`);
      setMessages(prev => [...prev, { role: 'model', content: "Desculpe, não consegui processar sua solicitação. Por favor, tente novamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
            <div className="flex justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        )}
      </main>
      <div className="p-4 md:p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
