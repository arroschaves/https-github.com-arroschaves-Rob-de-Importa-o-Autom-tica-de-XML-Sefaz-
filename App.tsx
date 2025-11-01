
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message, Client } from './types';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { Sidebar } from './components/Sidebar';
import { AddCertificateModal } from './components/AddCertificateModal';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const GEMINI_SYSTEM_INSTRUCTION = `You are a helpful assistant for the "Robô de Importação Automática de XML (Sefaz)" application.
    The user interacts with a UI that has a sidebar for managing client certificates and a main panel for chat and activity logs.
    
    Application features:
    - Users can add client certificates (A1 type) via the "Add Certificate" button. This requires a client name, CNPJ/CPF, the certificate file, and its password.
    - Added clients appear in a list in the sidebar.
    - Users can select one or more clients from this list.
    - With clients selected, users can click "Check for new XMLs" or "Download selected".
    - The results of these actions appear as messages in the main activity log/chat panel.
    - Your function is to answer questions about the robot and guide the user on how to use this application.
    
    Robot's core function:
    - Uses an A1 certificate to download issued and received NF-e (electronic invoices) from Sefaz.
    - Execution process:
      1. Authenticates with the webservice using the provided certificate.
      2. Stores the XML and PDF files of the invoices.
      3. Notifies the user about new invoices (simulated by messages in the log).
    
    Keep your answers concise and focused on guiding the user through the app's functionality or explaining the robot's purpose.
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
          content: 'Olá! Sou o assistente do Robô de Importação de XML. Para começar, adicione um certificado de cliente na barra lateral. Como posso ajudar?',
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

  const handleAddClient = (clientName: string, clientIdentifier: string, type: 'CPF' | 'CNPJ') => {
    const newClient: Client = {
      id: self.crypto.randomUUID(),
      name: clientName,
      identifier: clientIdentifier,
      type: type,
    };
    setClients(prev => [...prev, newClient]);
    setMessages(prev => [...prev, {role: 'model', content: `Certificado para **${clientName}** adicionado com sucesso.`}]);
  };

  const handleClientSelectionChange = (clientId: string, isSelected: boolean) => {
    setSelectedClients(prev => {
        const newSelection = new Set(prev);
        if (isSelected) {
            newSelection.add(clientId);
        } else {
            newSelection.delete(clientId);
        }
        return newSelection;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
      if (isSelected) {
          setSelectedClients(new Set(clients.map(c => c.id)));
      } else {
          setSelectedClients(new Set());
      }
  };

  const getSelectedClientNames = () => {
    return clients
      .filter(c => selectedClients.has(c.id))
      .map(c => c.name)
      .join(', ');
  };
  
  const handleCheckXMLs = () => {
    const clientNames = getSelectedClientNames();
    setMessages(prev => [...prev, { role: 'model', content: `Iniciando verificação de novos XMLs para: **${clientNames}**...` }]);
    setIsLoading(true);
    setTimeout(() => {
        const numFiles = Math.floor(Math.random() * 10);
        setMessages(prev => [...prev, { role: 'model', content: `Verificação concluída. Encontrados **${numFiles}** novos XMLs para os clientes selecionados.` }]);
        setIsLoading(false);
    }, 2000);
  };

  const handleDownloadXMLs = () => {
    const clientNames = getSelectedClientNames();
    setMessages(prev => [...prev, { role: 'model', content: `Iniciando download dos XMLs para: **${clientNames}**...` }]);
    setIsLoading(true);
    setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', content: `Download concluído com sucesso. Os arquivos foram salvos.` }]);
        setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
            clients={clients}
            selectedClients={selectedClients}
            onClientSelectionChange={handleClientSelectionChange}
            onSelectAll={handleSelectAll}
            onAddCertificate={() => setIsModalOpen(true)}
            onCheckXMLs={handleCheckXMLs}
            onDownloadXMLs={handleDownloadXMLs}
        />
        <main className="flex-1 flex flex-col">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
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
            </div>
            <div className="p-4 md:p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
        </main>
      </div>
      {isModalOpen && <AddCertificateModal onClose={() => setIsModalOpen(false)} onAdd={handleAddClient} />}
    </div>
  );
};

export default App;
