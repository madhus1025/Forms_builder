import React, { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Dashboard } from './Dashboard';
import FormBuilder from './FormBuilder';
import { FormsManager } from './FormsManager';
import { SubmissionsManager } from './SubmissionsManager';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'forms':
        return <FormsManager />;
      case 'create':
        return <FormBuilder />;
      case 'submissions':
        return <SubmissionsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {renderContent()}
      </div>
    </div>
  );
};
