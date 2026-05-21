import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExams, createExam, updateExam, deleteExam } from '../api/exams';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/auth';

const ExamManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    examTitle: '',
    duration: 60,
    totalMarks: 100,
    passingMarks: 50
  });

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

  const handleCreateOrUpdateExam = async (e) => {
    e.preventDefault();
    try {
      if (editingExamId) {
        await updateExam(editingExamId, formData);
      } else {
        await createExam(formData);
      }
      
      setShowForm(false);
      setEditingExamId(null);
      setFormData({
        examTitle: '',
        duration: 60,
        totalMarks: 100,
        passingMarks: 50
      });
      fetchExams();
    } catch (error) {
      console.error('Failed to save exam:', error);
    }
  };

  const handleEditClick = (exam) => {
    setFormData({
      examTitle: exam.exam_title,
      duration: exam.duration,
      totalMarks: exam.total_marks,
      passingMarks: exam.passing_marks
    });
    setEditingExamId(exam.exam_id);
    setShowForm(true);
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam? All related questions and attempts will be deleted.')) {
      try {
        await deleteExam(examId);
        fetchExams();
      } catch (error) {
        console.error('Failed to delete exam:', error);
      }
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
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium"
              >
                My Results
              </button>
            </li>
            {(user?.role === 'admin' || user?.role === 'teacher') && (
              <>
                <li>
                  <button
                    onClick={() => navigate('/exam-management')}
                    className="w-full text-left px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 transition font-medium"
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900">Exam Management</h2>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) setEditingExamId(null);
              }}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              {showForm ? 'Cancel' : 'Create New Exam'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-primary-500">
              <h3 className="text-xl font-bold text-neutral-800 mb-4">{editingExamId ? 'Edit Exam' : 'Create New Exam'}</h3>
              <form onSubmit={handleCreateOrUpdateExam} className="space-y-4">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Exam Title</label>
                  <input
                    type="text"
                    required
                    value={formData.examTitle}
                    onChange={(e) => setFormData({...formData, examTitle: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Total Marks</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.totalMarks}
                      onChange={(e) => setFormData({...formData, totalMarks: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Passing Marks</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.passingMarks}
                      onChange={(e) => setFormData({...formData, passingMarks: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-accent-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent-700 transition"
                >
                  {editingExamId ? 'Update Exam' : 'Save Exam'}
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <p className="text-neutral-600">Loading exams...</p>
          ) : exams.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-neutral-600">No exams found. Create one to get started.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Exam Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Passing</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {exams.map((exam) => (
                    <tr key={exam.exam_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">{exam.exam_title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-500">{exam.duration} mins</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-500">{exam.total_marks}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                           exam.passing_marks <= (exam.total_marks / 2) ? 'bg-success-100 text-success-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {exam.passing_marks}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditClick(exam)} className="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
                        <button onClick={() => navigate('/questions', { state: { examId: exam.exam_id } })} className="text-primary-600 hover:text-primary-900 mr-4">Manage Questions</button>
                        <button onClick={() => handleDeleteExam(exam.exam_id)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default ExamManagement;
