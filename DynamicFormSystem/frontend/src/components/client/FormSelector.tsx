import React, { useState } from 'react';
import { Search, Filter, FileText, Clock, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FormSelectorProps {
  onSelectForm: (form: string) => void;  //  passing correct form ID
}

export const FormSelector: React.FC<FormSelectorProps> = ({ onSelectForm }) => {
  const { forms, getFormSubmissions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || form.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(forms.map(form => form.category))];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Forms</h1>
        <p className="text-gray-600">Select a form to fill out and submit</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredForms.map((form) => {
          const submissionCount = getFormSubmissions(form._id || form.id).length;
          return (
            <div
              key={form._id || form.id}  //  Consistent key
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => onSelectForm(form._id || form.id)}  // Send correct form ID to parent
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">{form.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {form.category}
                  </span>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{form.fields.length} fields</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{submissionCount} submissions</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700">
                  Fill Form
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
          <p className="text-gray-500">
            {searchTerm || filterCategory ? 'Try adjusting your search or filter' : 'No forms available yet'}
          </p>
        </div>
      )}
    </div>
  );
};
