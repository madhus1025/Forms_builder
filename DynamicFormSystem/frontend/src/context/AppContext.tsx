import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Form, FormSubmission } from '../types';

interface AppContextType {
  forms: Form[];
  submissions: FormSubmission[];
  currentView: 'admin' | 'client';
  setCurrentView: (view: 'admin' | 'client') => void;
  addForm: (form: Form) => void;
  updateForm: (form: Form) => void;
  deleteForm: (formId: string) => void;
  addSubmission: (submission: FormSubmission) => void;
  getFormSubmissions: (formId: string) => FormSubmission[];
  refreshSubmissions: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [currentView, setCurrentView] = useState<'admin' | 'client'>('admin');

  useEffect(() => {
    axios.get('http://localhost:5000/api/forms')
      .then(res => setForms(res.data))
      .catch(err => console.error('Error loading forms', err));
  }, []);

  const refreshSubmissions = () => {
    axios.get('http://localhost:5000/api/submissions')
      .then(res => setSubmissions(res.data))
      .catch(err => console.error('Error loading submissions', err));
  };

  useEffect(() => {
    refreshSubmissions();
  }, []);

  const addForm = (form: Form) => setForms(prev => [...prev, form]);
  const updateForm = (form: Form) => setForms(prev => prev.map(f => f._id === form._id ? form : f));
  const deleteForm = (formId: string) => {
    setForms(prev => prev.filter(f => f._id !== formId));
    setSubmissions(prev => prev.filter(s => s.formId !== formId));
  };
  const addSubmission = (submission: FormSubmission) => setSubmissions(prev => [...prev, submission]);
  const getFormSubmissions = (formId: string) => submissions.filter(s => s.formId === formId);

  return (
    <AppContext.Provider
      value={{
        forms,
        submissions,
        currentView,
        setCurrentView,
        addForm,
        updateForm,
        deleteForm,
        addSubmission,
        getFormSubmissions,
        refreshSubmissions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
