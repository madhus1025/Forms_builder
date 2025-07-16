import React, { useState } from 'react';
import { Search, Filter, Eye, Calendar, X } from 'lucide-react';
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
      await axios.patch(`/api/submissions/${id}/approve`);
      alert('Submission approved');
      refreshSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error approving submission', error);
      alert('Error approving submission');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.patch(`/api/submissions/${id}/reject`);
      alert('Submission rejected');
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
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 relative">
          <button
            onClick={() => setSelectedSubmission(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold mb-2">Submission Details</h3>

          {/* Form Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm space-y-1">
            <h4 className="font-medium text-gray-800 mb-1">Form Information</h4>
            <p>Name: {submission.formName}</p>
            <p>Category: {form.category}</p>
            <p>Submitted At: {new Date(submission.submittedAt).toLocaleString()}</p>
            <p>
              Status:{' '}
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  submission.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : submission.status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {submission.status}
              </span>
            </p>
          </div>

          {/* Submitted Data */}
          <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-3">
            <h4 className="font-medium text-gray-800 mb-2">Submitted Data</h4>
            {Object.entries(submission.data).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="font-medium text-gray-700">{key}</span>
                {value && typeof value === 'object' && value.url ? (
                  <a
                    href={value.url}
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

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            {submission.status === 'pending' ? (
              <>
                <button
                  onClick={() => submission._id && handleReject(submission._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => submission._id && handleApprove(submission._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Approve
                </button>
              </>
            ) : null}
            <button
              onClick={() => setSelectedSubmission(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Form Submissions</h2>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search form name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterForm}
            onChange={(e) => setFilterForm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Forms</option>
            {forms.map(form => (
              <option key={form._id} value={form._id}>
                {form.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by status"
            value={statusSearchTerm}
            onChange={(e) => setStatusSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wide">Form Name</th>
              <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wide">Category</th>
              <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wide">Submitted</th>
              <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubmissions.map(submission => {
              const form = getFormById(submission.formId);
              return (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{submission.formName}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {form?.category || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                        submission.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : submission.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => submission._id && setSelectedSubmission(submission._id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* No Submissions Message */}
      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No submissions found</h3>
          <p className="text-gray-500">
            {searchTerm || filterForm || statusSearchTerm
              ? 'Try changing your search or filters'
              : 'No submissions have been made yet.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedSubmission && <SubmissionModal submissionId={selectedSubmission} />}
    </div>
  );
};
