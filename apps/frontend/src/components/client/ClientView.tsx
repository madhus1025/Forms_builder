import React, { useState } from 'react';
import { FormSelector } from './FormSelector';
import { FormRenderer } from './FormRenderer';
import { useApp } from '../../context/AppContext';

export const ClientView: React.FC = () => {
  const { forms } = useApp();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  // Match the selected form using _id
  const selectedForm = forms.find((form) => form._id === selectedFormId);

  const handleBack = () => {
    setSelectedFormId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 transition-all duration-300">
        {selectedForm ? (
          <FormRenderer form={selectedForm} onBack={handleBack} />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Choose a Form to Fill
            </h2>
            <FormSelector onSelectForm={setSelectedFormId} />
          </>
        )}
      </div>
    </div>
  );
};
