import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Database,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'create', label: 'Create Form', icon: Plus },
    { id: 'submissions', label: 'Submissions', icon: Database }
  ];

  return (
    <aside
      className={`fixed sm:relative z-50 transition-transform transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0 w-64 bg-gray-50 border-r border-gray-200 min-h-screen`}
    >
      {/* Close button on mobile */}
      <div className="sm:hidden flex justify-end p-2">
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="p-4 pt-0 sm:pt-4">
        <ul className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose(); // Close after click on mobile
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
