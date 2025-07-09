import React from 'react';
import { BarChart3, Users, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const { forms, submissions } = useApp();

  const stats = [
    {
      title: 'Total Forms',
      value: forms.length,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Submissions',
      value: submissions.length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Active Users',
      value: 1,
      icon: Users,
      color: 'bg-purple-500',
      change: '+3%'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+2%'
    }
  ];

  const recentSubmissions = submissions.slice(-5).reverse();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
          <div className="space-y-3">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{submission.formName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No submissions yet</p>
            )}
          </div>
        </div>

        {/* Popular Forms */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Forms</h3>
          <div className="space-y-3">
            {forms.slice(0, 5).map((form) => {
              const formSubmissions = submissions.filter(s => s.formId === form.id);
              return (
                <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{form.name}</p>
                      <p className="text-sm text-gray-500">{form.category}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{formSubmissions.length} submissions</span>
                </div>
              );
            })}
            {forms.length === 0 && (
              <p className="text-gray-500 text-center py-8">No forms created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};