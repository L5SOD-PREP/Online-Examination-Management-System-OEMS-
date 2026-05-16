import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/auth';
import { getStudentResults } from '../api/results';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentResults();
  }, []);

  const fetchRecentResults = async () => {
    try {
      const results = await getStudentResults();
      setRecentResults(results.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Online Examination System
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            onClick={() => navigate('/exams')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Available Exams</h3>
            <p className="text-gray-600">View and take exams</p>
          </div>

          <div
            onClick={() => navigate('/results')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">My Results</h3>
            <p className="text-gray-600">View your exam results</p>
          </div>

          <div
            onClick={() => navigate('/questions')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Question Management</h3>
            <p className="text-gray-600">Manage exam questions</p>
          </div>

          <div
            onClick={() => navigate('/reports')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Reports</h3>
            <p className="text-gray-600">View performance reports</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Results</h3>
          
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : recentResults.length === 0 ? (
            <p className="text-gray-600">No results yet. Take an exam to see your results here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentResults.map((result) => (
                    <tr key={result.result_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {result.exam_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {result.score} / {result.total_marks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {result.percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          result.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
