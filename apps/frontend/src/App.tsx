import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { AdminPanel } from './components/admin/AdminPanel';
import { ClientView } from './components/client/ClientView';
import { FormsManager } from './components/admin/FormsManager';
import FormBuilder from './components/admin/FormBuilder';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        {currentView === 'admin' ? (
          <>
            <Route path="/" element={<AdminPanel />} />
            <Route path="/admin/forms" element={<FormsManager />} />
            <Route path="/admin/create-form" element={<FormBuilder />} />
            <Route path="*" element={<Navigate to="/admin/forms" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<ClientView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
