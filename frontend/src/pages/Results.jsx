import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getStudentResults } from '../api/results';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/auth';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await getStudentResults();
      setResults(data);
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
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary-800 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">Online Examination System</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/exams')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
              >
                Available Exams
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/results')}
                className="w-full text-left px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 transition font-medium"
              >
                My Results
              </button>
            </li>
            {(user?.role === 'admin' || user?.role === 'teacher') && (
              <>
                <li>
                  <button
                    onClick={() => navigate('/exam-management')}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
                  >
                    Exam Management
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/questions')}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
                  >
                    Question Management
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/reports')}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
                  >
                    Reports
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/users')}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
                  >
                    User Management
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mb-4">
            <p className="text-sm text-white/70">Welcome,</p>
            <p className="font-semibold">{user?.fullName}</p>
            <p className="text-xs text-white/50 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">My Results</h2>

          {location.state?.result && (
            <div className={`mb-8 p-6 rounded-lg ${
              location.state.result.status === 'pass' 
                ? 'bg-accent-100 border border-accent-400' 
                : 'bg-red-100 border border-red-400'
            }`}>
              <h3 className="text-2xl font-bold mb-4">
                Exam {location.state.result.status === 'pass' ? 'Passed!' : 'Failed'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-neutral-600">Score</p>
                  <p className="text-2xl font-bold">{location.state.result.score} / {location.state.result.totalMarks}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Percentage</p>
                  <p className="text-2xl font-bold">{location.state.result.percentage}%</p>
                </div>
                <div>
                  <p className="text-neutral-600">Status</p>
                  <p className="text-2xl font-bold uppercase">{location.state.result.status}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">All Results</h3>
            
            {loading ? (
              <p className="text-neutral-600">Loading results...</p>
            ) : results.length === 0 ? (
              <p className="text-neutral-600">No results yet. Take an exam to see your results here.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                        Exam
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {results.map((result) => (
                      <tr key={result.result_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-900">
                          {result.exam_title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-900">
                          {result.score} / {result.total_marks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-900">
                          {result.percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            result.status === 'pass' ? 'bg-accent-100 text-accent-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-900">
                          {new Date(result.created_at).toLocaleDateString()}
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

export default Results;
