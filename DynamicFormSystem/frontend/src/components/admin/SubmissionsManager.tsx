import React, { useState } from 'react';
import { Search, Filter, Eye, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

export const SubmissionsManager: React.FC = () => {
  const { submissions, forms, refreshSubmissions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterForm, setFilterForm] = useState('');
  const [statusSearchTerm, setStatusSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.formName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesForm = !filterForm || submission.formId === filterForm;
    const matchesStatus = submission.status.toLowerCase().includes(statusSearchTerm.toLowerCase());
    return matchesSearch && matchesForm && matchesStatus;
  });

  const getFormById = (formId: string) => forms.find(form => form._id === formId);

  const handleApprove = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/submissions/${id}/approve`);
      alert('Submission approved successfully');
      refreshSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error approving submission', error);
      alert('Error approving submission');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/submissions/${id}/reject`);
      alert('Submission rejected successfully');
      refreshSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error rejecting submission', error);
      alert('Error rejecting submission');
    }
  };

  const SubmissionModal: React.FC<{ submissionId: string }> = ({ submissionId }) => {
    const submission = submissions.find(s => s._id === submissionId);
    const form = submission ? getFormById(submission.formId) : null;

    if (!submission || !form) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Submission Details</h3>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Form Information</h4>
              <p className="text-gray-600">Name: {submission.formName}</p>
              <p className="text-gray-600">Category: {form.category}</p>
              <p className="text-gray-600">
                Submitted: {new Date(submission.submittedAt).toLocaleDateString()} at{' '}
                {new Date(submission.submittedAt).toLocaleTimeString()}
              </p>
              <p className="text-gray-600">
                Status:{' '}
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    submission.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : submission.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {submission.status}
                </span>
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Submitted Data</h4>
              <div className="space-y-3">
                {Object.entries(submission.data).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="font-medium text-gray-700">{key}</span>
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
                      <span className="text-gray-600 mt-1">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {submission.status === 'pending' && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleReject(submission._id!)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(submission._id!)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          )}

          {submission.status !== 'pending' && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Form Submissions</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterForm}
            onChange={(e) => setFilterForm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Forms</option>
            {forms.map(form => (
              <option key={form._id} value={form._id}>{form.name}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by status (pending, approved, rejected)"
            value={statusSearchTerm}
            onChange={(e) => setStatusSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map(submission => {
                const form = getFormById(submission.formId);
                return (
                  <tr key={submission._id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">{submission.formName}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {form?.category || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          submission.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : submission.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedSubmission(submission._id ?? null)}
                        className="text-blue-600 hover:underline text-sm"
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
            {searchTerm || filterForm || statusSearchTerm
              ? 'Try adjusting your search or filters'
              : 'No form submissions yet'}
          </p>
        </div>
      )}

      {selectedSubmission && <SubmissionModal submissionId={selectedSubmission} />}
    </div>
  );
};
