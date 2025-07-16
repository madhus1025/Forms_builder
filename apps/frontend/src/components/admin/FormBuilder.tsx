import React, { useEffect, useState } from 'react';
import { Plus, X, Eye, Save } from 'lucide-react';
import axios from 'axios';
import { Form, FormField } from '../../types';

const FormBuilder: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Form>>({
    name: '',
    description: '',
    category: '',
    fields: []
  });

  const [showPreview, setShowPreview] = useState(false);
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
    options: []
  });

  const [optionInput, setOptionInput] = useState<string>('');
  const [fetchedForm, setFetchedForm] = useState<Partial<Form> | null>(null);

  const categories = ['Healthcare', 'Education', 'Business', 'Survey', 'Registration', 'Contact', 'Feedback', 'Other'];

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'date', label: 'Date' },
    { value: 'file', label: 'File Upload' },
    { value: 'pan', label: 'PAN Number' }
  ];

  const addOption = () => {
    if (optionInput.trim() && newField.options) {
      setNewField(prev => ({
        ...prev,
        options: [...(prev.options || []), optionInput.trim()]
      }));
      setOptionInput('');
    }
  };

  const removeOption = (index: number) => {
    if (newField.options) {
      const newOptions = [...newField.options];
      newOptions.splice(index, 1);
      setNewField(prev => ({ ...prev, options: newOptions }));
    }
  };

  const addField = () => {
    if (!newField.label) return;

    const field: FormField = {
      id: Date.now().toString(),
      type: newField.type as FormField['type'],
      label: newField.label,
      placeholder: newField.placeholder,
      required: newField.required || false,
      options: newField.options || []
    };

    setFormData(prev => ({
      ...prev,
      fields: [...(prev.fields || []), field]
    }));

    setNewField({ type: 'text', label: '', placeholder: '', required: false, options: [] });
  };

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields?.filter(f => f.id !== fieldId) || []
    }));
  };

  const saveForm = async () => {
    if (!formData.name || !formData.category || !formData.fields?.length) {
      alert('Please fill all required fields');
      return;
    }

    const formToSave = {
      name: formData.name,
      description: formData.description || '',
      category: formData.category,
      fields: formData.fields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await axios.post('/api/forms/create', formToSave);
      alert('Form saved successfully');
      setFormData({ name: '', description: '', category: '', fields: [] });
    } catch (error) {
      console.error(error);
      alert('Failed to save form');
    }
  };

  const fetchLatestForm = async () => {
    try {
      const res = await axios.get('/api/forms/latest');
      setFetchedForm(res.data.form);
    } catch (err) {
      console.error(err);
      alert('Could not load preview');
    }
  };

  useEffect(() => {
    if (showPreview) fetchLatestForm();
  }, [showPreview]);

  const FormPreview: React.FC = () => {
    if (!fetchedForm) return <p>Loading preview...</p>;

    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-bold mb-2">{fetchedForm.name}</h3>
        <p className="mb-4 text-sm text-gray-600">{fetchedForm.description}</p>
        {fetchedForm.fields?.map(field => (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium">{field.label}</label>
            {field.type === 'file' ? (
              <input type="file" className="border w-full px-3 py-2 rounded" disabled />
            ) : (
              <input
                type="text"
                className="border w-full px-3 py-2 rounded"
                placeholder={field.placeholder || (field.type === 'text' ? 'Enter PAN Number' : '')}
                disabled
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-full md:max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Create New Form</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowPreview(!showPreview)} className="border px-4 py-2 rounded flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button onClick={saveForm} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save Form
          </button>
        </div>
      </div>

      {!showPreview && (
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4 w-full">
            <input
              type="text"
              placeholder="Form Name"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border px-3 py-2 rounded"
            />

            <textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border px-3 py-2 rounded"
            />

            <select
              value={formData.category || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <div className="border p-4 rounded space-y-3">
              <select
                value={newField.type}
                onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as FormField['type'], options: [] }))}
                className="w-full border px-3 py-2 rounded"
              >
                {fieldTypes.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
              </select>

              <input
                type="text"
                placeholder="Label"
                value={newField.label || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="text"
                placeholder="Placeholder"
                value={newField.placeholder || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                className="w-full border px-3 py-2 rounded"
              />

              {['select', 'checkbox', 'radio'].includes(newField.type || '') && (
                <div>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Option"
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      className="flex-1 border px-3 py-2 rounded"
                    />
                    <button type="button" onClick={addOption} className="bg-green-500 text-white px-3 py-2 rounded w-full sm:w-auto">
                      Add
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {newField.options?.map((opt, idx) => (
                      <li key={idx} className="flex justify-between items-center border px-2 py-1 rounded">
                        <span>{opt}</span>
                        <button onClick={() => removeOption(idx)}><X className="w-4 h-4 text-red-500" /></button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button onClick={addField} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </button>
            </div>

            {formData.fields && formData.fields.length > 0 && (
              <div className="border p-4 rounded space-y-2">
                {formData.fields.map(f => (
                  <div key={f.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border p-2 rounded">
                    <span className="font-medium text-sm text-gray-800">{f.label}</span>
                    <button onClick={() => removeField(f.id)}><X className="w-4 h-4 text-red-500" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showPreview && <FormPreview />}
    </div>
  );
};

export default FormBuilder;
