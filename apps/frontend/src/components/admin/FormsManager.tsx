import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, Search, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form } from '../../types';

export const FormsManager: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      const res = await axios.get('/api/forms');
      setForms(res.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const categories = [...new Set(forms.map(form => form.category))];

  const filteredForms = forms.filter(form => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || form.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteForm = async (formId: string, formName: string) => {
    if (window.confirm(`Are you sure you want to delete "${formName}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/forms/${formId}`);
        setForms(prev => prev.filter(f => f._id !== formId));
        alert('Form deleted successfully');
      } catch (error) {
        console.error('Failed to delete form:', error);
        alert('Error deleting form');
      }
    }
  };

  const handleViewForm = async (formId: string) => {
    try {
      const res = await axios.get(`/api/forms/${formId}`);
      setSelectedForm(res.data);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch form:', error);
      alert('Error loading form');
    }
  };

  const handleEditForm = (formId: string) => {
    navigate(`/admin/create-form?id=${formId}`);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedForm(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Forms Management</h2>
        <button
          onClick={() => navigate('/admin/create-form')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Form</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-8 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map(form => (
          <div key={form._id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{form.name}</h3>
              <p className="text-sm text-gray-500">{form.description}</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {form.category}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>{form.fields?.length} fields</span>
              <span>{new Date(form.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleViewForm(form._id!)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => handleEditForm(form._id!)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteForm(form._id!, form.name)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Forms Found */}
      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">No forms found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory ? 'Try adjusting your search or filter.' : 'Get started by creating your first form.'}
          </p>
          <button
            onClick={() => navigate('/admin/create-form')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Form
          </button>
        </div>
      )}

      {/* View Modal */}
      {showModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedForm.name}</h3>
            <p className="mb-4 text-gray-600">{selectedForm.description}</p>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {selectedForm.fields?.map((field, idx) => (
                <li key={idx} className="border rounded p-2 text-sm">
                  <strong>{field.label}</strong> — <em>{field.type}</em>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
