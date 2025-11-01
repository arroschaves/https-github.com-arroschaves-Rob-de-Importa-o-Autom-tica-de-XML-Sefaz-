
import React from 'react';
import type { Client } from '../types';

interface SidebarProps {
    clients: Client[];
    selectedClients: Set<string>;
    onClientSelectionChange: (clientId: string, isSelected: boolean) => void;
    onSelectAll: (isSelected: boolean) => void;
    onAddCertificate: () => void;
    onCheckXMLs: () => void;
    onDownloadXMLs: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    clients, 
    selectedClients, 
    onClientSelectionChange,
    onSelectAll,
    onAddCertificate,
    onCheckXMLs,
    onDownloadXMLs 
}) => {
    const areAnyClientsSelected = selectedClients.size > 0;
    const areAllClientsSelected = clients.length > 0 && selectedClients.size === clients.length;
    
    return (
        <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <button onClick={onAddCertificate} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Certificate
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {clients.length > 0 ? (
                    <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                             <h3 className="font-bold text-lg">Clients</h3>
                             <div className="flex items-center">
                                 <input 
                                    type="checkbox" 
                                    id="selectAll" 
                                    checked={areAllClientsSelected} 
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                 <label htmlFor="selectAll" className="ml-2 text-sm">Select All</label>
                             </div>
                        </div>
                        <ul className="space-y-1">
                            {clients.map(client => (
                                <li key={client.id} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedClients.has(client.id)}
                                            onChange={(e) => onClientSelectionChange(client.id, e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm truncate">{client.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{client.type}: {client.identifier}</p>
                                        </div>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        <p>No certificates added yet.</p>
                        <p className="text-sm">Click "Add Certificate" to begin.</p>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button
                    onClick={onCheckXMLs}
                    disabled={!areAnyClientsSelected}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    Check for new XMLs
                </button>
                 <button
                    onClick={onDownloadXMLs}
                    disabled={!areAnyClientsSelected}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-400 dark:disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    Download selected
                </button>
            </div>
        </aside>
    );
};
