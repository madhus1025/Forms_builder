import React, { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Menu } from 'lucide-react';
import { Dashboard } from './Dashboard';
import FormBuilder from "./FormBuilder";
import { FormsManager } from './FormsManager';
import { SubmissionsManager } from './SubmissionsManager';
import { useApp } from '../../context/AppContext';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentView, setCurrentView } = useApp();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'forms':
        return <FormsManager /> ; 
      case 'create':
        return <FormBuilder />; 
      case 'submissions':
        return <SubmissionsManager />;
      default:
        return <div>Welcome to the Dashboard</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 bg-gray-50 w-full">
        {/* Topbar for mobile toggle */}
        <div className="sm:hidden flex justify-between items-center mb-4">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <button
            className="text-sm px-3 py-1 border rounded text-blue-600 border-blue-600"
            onClick={() => setCurrentView('client')}
          >
            Switch to Client View
          </button>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};
