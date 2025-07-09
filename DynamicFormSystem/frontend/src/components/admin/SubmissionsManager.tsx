import React, { useState } from 'react';
import { Search, Filter,
  //  Download,
   Eye, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SubmissionsManager: React.FC = () => {
  const { submissions, forms } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterForm, setFilterForm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.formName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesForm = !filterForm || submission.formId === filterForm;
    return matchesSearch && matchesForm;
  });

  const getFormById = (formId: string) => {
    return forms.find(form => form._id === formId);
  };

  const exportSubmissions= () => {
    if (filteredSubmissions.length === 0) {
      alert('No submissions to export');
      return;
    }

    const allLabels = new Set<string>();
    filteredSubmissions.forEach(sub => {
      Object.keys(sub.data).forEach(label => allLabels.add(label));
    });

    const headers = ['Form Name', 'Submitted At', ...Array.from(allLabels)];

    const rows = filteredSubmissions.map(sub => {
      const row: string[] = [];

      row.push(sub.formName);
      row.push(new Date(sub.submittedAt).toLocaleString());

      Array.from(allLabels).forEach(label => {
        const value = sub.data[label];

        if (!value) {
          row.push('');
        } else if (typeof value === 'object' && value.url) {
          row.push(`"${value.originalname} (http://localhost:5000${value.url})"`);
        } else if (Array.isArray(value)) {
          row.push(`"${value.join('; ')}"`);
        } else {
          row.push(`"${String(value)}"`);
        }
      });

      return row;
    });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-submissions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const SubmissionModal: React.FC<{ submissionId: string }> = ({ submissionId }) => {
    const submission = submissions.find(s => s._id === submissionId);
    const form = submission ? getFormById(submission.formId) : null;

    if (!submission || !form) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Submission Details</h3>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Form Information</h4>
              <p className="text-sm text-gray-600">Name: {submission.formName}</p>
              <p className="text-sm text-gray-600">Category: {form.category}</p>
              <p className="text-sm text-gray-600">
                Submitted: {new Date(submission.submittedAt).toLocaleDateString()} at{' '}
                {new Date(submission.submittedAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Submitted Data</h4>
              <div className="space-y-3">
                {Object.entries(submission.data).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{key}</span>
                    {value && typeof value === 'object' && value.url ? (
                      <a
                        href={`http://localhost:5000${value.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="text-blue-600 underline mt-1"
                      >
                        📄 Download {value.originalname}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-600 mt-1">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Form Submissions</h2>
        {/* <button
          onClick={exportSubmissions}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button> */}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterForm}
            onChange={(e) => setFilterForm(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Forms</option>
            {forms.map(form => (
              <option key={form._id} value={form._id}>{form.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map(submission => {
                const form = getFormById(submission.formId);
                return (
                  <tr key={submission._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{submission.formName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {form?.category || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedSubmission(submission._id ?? null)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
          <p className="text-gray-500">
            {searchTerm || filterForm ? 'Try adjusting your search or filter' : 'No form submissions yet'}
          </p>
        </div>
      )}

      {selectedSubmission && (
        <SubmissionModal submissionId={selectedSubmission} />
      )}
    </div>
  );
};
