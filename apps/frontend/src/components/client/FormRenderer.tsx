import React, { useState } from 'react';
import { Form, FormField } from '../../types';
import { ArrowLeft, Send } from 'lucide-react';
import axios from 'axios';

interface FormRendererProps {
  form: Form;
  onBack: () => void;
}

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

export const FormRenderer: React.FC<FormRendererProps> = ({ form, onBack }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleCheckboxChange = (fieldId: string, option: string) => {
    const currentValues = formValues[fieldId] || [];
    if (currentValues.includes(option)) {
      handleChange(fieldId, currentValues.filter((val: string) => val !== option));
    } else {
      handleChange(fieldId, [...currentValues, option]);
    }
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert('Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed.');
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`File too large. Max allowed is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      setFormValues(prev => ({
        ...prev,
        [fieldId]: file
      }));
    }
  };

  const handleSubmit = async () => {
    const formId = form._id || form.id;
    if (!formId) {
      alert('Form ID is missing.');
      return;
    }

    const missingRequired = form.fields.filter(field => {
      const value = formValues[field.id];
      if (field.required) {
        if (field.type === 'file') {
          return !(value instanceof File);
        } else {
          return !value;
        }
      }
      return false;
    });

    if (missingRequired.length > 0) {
      alert(`Please fill required field: ${missingRequired[0].label}`);
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('formId', formId);
    formData.append('formName', form.name);

    const labeledData: Record<string, any> = {};

    form.fields.forEach(field => {
      const value = formValues[field.id];
      if (value !== undefined) {
        if (field.type === 'file' && value instanceof File) {
          formData.append(field.label, value);
        } else {
          labeledData[field.label] = value;
        }
      }
    });

    // PAN validation
    const panEntry = Object.entries(labeledData).find(([label]) =>
      label.toLowerCase().includes('pan')
    );
    const panValue = panEntry?.[1];

    if (panValue) {
      try {
        const res = await axios.post('/api/verify-pan', {
          panNumber: panValue
        });
        if (!res.data.valid) {
          alert('Invalid PAN number. Please enter a valid one.');
          setSubmitting(false);
          return;
        }
      } catch (err) {
        alert('PAN verification failed.');
        console.error(err);
        setSubmitting(false);
        return;
      }
    }

    formData.append('data', JSON.stringify(labeledData));

    try {
      await axios.post('/api/submissions/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Form submitted successfully!');
      setFormValues({});
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.id] ?? '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <input
            type="text"
            placeholder={field.placeholder || (field.label.toLowerCase().includes('pan') ? 'Enter PAN Number' : '')}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={() => handleChange(field.id, opt)}
                  required={field.required}
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value?.includes(opt) || false}
                  onChange={() => handleCheckboxChange(field.id, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <div>
            <input
              type="file"
              onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
              className="w-full border px-3 py-2 rounded"
              required={field.required}
            />
            {formValues[field.id] instanceof File &&
              formValues[field.id].type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(formValues[field.id])}
                  alt="Preview"
                  className="mt-2 h-32 object-cover rounded border"
                />
              )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded-lg border shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold">{form.name}</h2>
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">{form.description}</p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
        {form.fields.map((field) => (
          <div key={field.id}>
            <label className="block font-medium mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 w-full sm:w-auto"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};
