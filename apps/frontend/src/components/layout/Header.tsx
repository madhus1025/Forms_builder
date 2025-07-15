import React from 'react';
import {  LayoutGrid } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {  currentView, setCurrentView } = useApp();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <LayoutGrid className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">FormBuilder Pro</h1>
        </div>
        <div className="flex items-center space-x-2 ml-8">
          <button
            onClick={() => setCurrentView('admin')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentView === 'admin'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin Panel
          </button>
          <button
            onClick={() => setCurrentView('client')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentView === 'client'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Client View
          </button>
        </div>
      </div>
   
    </header>
  );
};