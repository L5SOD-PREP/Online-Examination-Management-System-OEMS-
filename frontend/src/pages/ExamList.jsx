import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExams } from '../api/exams';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/auth';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const data = await getAllExams();
      setExams(data);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeExam = (examId) => {
    navigate(`/exam/${examId}`);
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
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/exams')}
                className="w-full text-left px-4 py-3 rounded-lg bg-blue-800 hover:bg-blue-700 transition font-medium"
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
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="mb-4">
            <p className="text-sm text-blue-200">Welcome,</p>
            <p className="font-semibold">{user?.fullName}</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Exams</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading exams...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No exams available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <div key={exam.exam_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition border-2 border-transparent hover:border-purple-300">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {exam.exam_title}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p><strong>Duration:</strong> {exam.duration} minutes</p>
                      <p><strong>Total Marks:</strong> {exam.total_marks}</p>
                      <p><strong>Passing Marks:</strong> {exam.passing_marks}</p>
                      <p><strong>Questions:</strong> {exam.questionCount || 'N/A'}</p>
                    </div>
                    <button
                      onClick={() => handleTakeExam(exam.exam_id)}
                      className="mt-6 w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                    >
                      Take Exam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamList;
