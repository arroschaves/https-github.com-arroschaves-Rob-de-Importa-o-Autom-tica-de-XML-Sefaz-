
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 shadow-md w-full z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto">
        <h1 className="text-xl md:text-2xl font-bold">Robô de Importação Automática de XML (Sefaz)</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Gemini</p>
      </div>
    </header>
  );
};
