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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">Online Examination System</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full text-left px-4 py-3 rounded-lg bg-blue-800 hover:bg-blue-700 transition font-medium"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/exams')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Available Exams
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/results')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                My Results
              </button>
            </li>
            {(user?.role === 'admin' || user?.role === 'teacher') && (
              <>
                <li>
                  <button
                    onClick={() => navigate('/exam-management')}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Exam Management
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/questions')}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Question Management
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/reports')}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Reports
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="mb-4">
            <p className="text-sm text-blue-200">Welcome,</p>
            <p className="font-semibold">{user?.fullName}</p>
            <p className="text-xs text-blue-300 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div
              onClick={() => navigate('/exams')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Available Exams</h3>
              <p className="text-gray-600">View and take exams</p>
            </div>

            <div
              onClick={() => navigate('/results')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-purple-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">My Results</h3>
              <p className="text-gray-600">View your exam results</p>
            </div>

            <div
              onClick={() => navigate('/questions')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Question Management</h3>
              <p className="text-gray-600">Manage exam questions</p>
            </div>

            <div
              onClick={() => navigate('/reports')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-purple-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reports</h3>
              <p className="text-gray-600">View performance reports</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Results</h3>
            
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : recentResults.length === 0 ? (
              <p className="text-gray-600">No results yet. Take an exam to see your results here.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Exam
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
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
                            result.status === 'pass' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
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
    </div>
  );
};

export default Dashboard;
