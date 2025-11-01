
import React, { useState } from 'react';

interface AddCertificateModalProps {
  onClose: () => void;
  onAdd: (clientName: string, clientIdentifier: string, type: 'CPF' | 'CNPJ') => void;
}

export const AddCertificateModal: React.FC<AddCertificateModalProps> = ({ onClose, onAdd }) => {
  const [clientName, setClientName] = useState('');
  const [clientIdentifier, setClientIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fileName, setFileName] = useState('');
  const [type, setType] = useState<'CPF' | 'CNPJ'>('CNPJ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd process the certificate file.
    // Here, we'll just use the provided name and identifier.
    if (clientName && clientIdentifier && password && fileName) {
      onAdd(clientName, clientIdentifier, type);
      onClose();
    } else {
      alert('Please fill all fields and select a certificate file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setFileName(e.target.files[0].name);
      }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold">Add New Certificate</h2>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                    <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} required className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Acme Corp"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                     <select value={type} onChange={e => setType(e.target.value as 'CPF' | 'CNPJ')} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="CNPJ">CNPJ</option>
                        <option value="CPF">CPF</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="clientIdentifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{type}</label>
                    <input type="text" id="clientIdentifier" value={clientIdentifier} onChange={e => setClientIdentifier(e.target.value)} required className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={type === 'CNPJ' ? 'XX.XXX.XXX/0001-XX' : 'XXX.XXX.XXX-XX'}/>
                </div>
                 <div>
                    <label htmlFor="certificateFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Certificate File (.pfx, .p12)</label>
                     <label className="w-full flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        <span className="truncate">{fileName || 'Select file'}</span>
                        <input type="file" id="certificateFile" onChange={handleFileChange} required accept=".pfx,.p12" className="hidden"/>
                     </label>
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">Add Client</button>
            </div>
        </form>
      </div>
    </div>
  );
};
