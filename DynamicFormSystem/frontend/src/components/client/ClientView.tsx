import React, { useState } from 'react';
import { FormSelector } from './FormSelector';
import { FormRenderer } from './FormRenderer';
import { useApp } from '../../context/AppContext';
// import { Form } from '../../types';

export const ClientView: React.FC = () => {
  const { forms } = useApp();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  // FIX: Use _id for matching
  const selectedForm = forms.find(form => form._id === selectedFormId);

  const handleBack = () => {
    setSelectedFormId(null);
  };

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      {selectedForm ? (
        <FormRenderer form={selectedForm} onBack={handleBack} />
      ) : (
        <FormSelector onSelectForm={setSelectedFormId} />
      )}
    </div>
  );
};
