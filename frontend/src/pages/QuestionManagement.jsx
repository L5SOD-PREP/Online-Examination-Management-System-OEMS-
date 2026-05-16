import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExams } from '../api/exams';
import { getQuestionsByExam, createQuestion, deleteQuestion } from '../api/questions';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/auth';

const QuestionManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: 1
  });

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchQuestions(selectedExam);
    }
  }, [selectedExam]);

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

  const fetchQuestions = async (examId) => {
    try {
      const data = await getQuestionsByExam(examId);
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      await createQuestion({
        examId: selectedExam,
        ...formData
      });
      setShowForm(false);
      setFormData({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        marks: 1
      });
      fetchQuestions(selectedExam);
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(questionId);
        fetchQuestions(selectedExam);
      } catch (error) {
        console.error('Failed to delete question:', error);
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
            <li>
              <button
                onClick={() => navigate('/questions')}
                className="w-full text-left px-4 py-3 rounded-lg bg-blue-800 hover:bg-blue-700 transition font-medium"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Question Management</h2>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Exam</h3>
            <select
              value={selectedExam || ''}
              onChange={(e) => setSelectedExam(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an exam</option>
              {exams.map((exam) => (
                <option key={exam.exam_id} value={exam.exam_id}>
                  {exam.exam_title}
                </option>
              ))}
            </select>
          </div>

          {selectedExam && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Questions ({questions.length})
                  </h3>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                  >
                    {showForm ? 'Cancel' : 'Add Question'}
                  </button>
                </div>

                {showForm && (
                  <form onSubmit={handleCreateQuestion} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Question Text
                      </label>
                      <textarea
                        value={formData.questionText}
                        onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Option A</label>
                        <input
                          type="text"
                          value={formData.optionA}
                          onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Option B</label>
                        <input
                          type="text"
                          value={formData.optionB}
                          onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Option C</label>
                        <input
                          type="text"
                          value={formData.optionC}
                          onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Option D</label>
                        <input
                          type="text"
                          value={formData.optionD}
                          onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Correct Answer</label>
                        <select
                          value={formData.correctAnswer}
                          onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Marks</label>
                        <input
                          type="number"
                          value={formData.marks}
                          onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      Add Question
                    </button>
                  </form>
                )}

                {questions.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No questions added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question.question_id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {index + 1}. {question.question_text}
                          </h4>
                          <button
                            onClick={() => handleDeleteQuestion(question.question_id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className={`p-2 rounded ${question.correct_answer === 'A' ? 'bg-purple-100' : 'bg-blue-50'}`}>
                            A. {question.option_a}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'B' ? 'bg-purple-100' : 'bg-blue-50'}`}>
                            B. {question.option_b}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'C' ? 'bg-purple-100' : 'bg-blue-50'}`}>
                            C. {question.option_c}
                          </div>
                          <div className={`p-2 rounded ${question.correct_answer === 'D' ? 'bg-purple-100' : 'bg-blue-50'}`}>
                            D. {question.option_d}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Marks: {question.marks}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManagement;
