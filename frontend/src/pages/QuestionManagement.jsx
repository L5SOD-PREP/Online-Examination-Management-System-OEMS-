import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExams } from '../api/exams';
import { getQuestionsByExam, createQuestion, deleteQuestion } from '../api/questions';

const QuestionManagement = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-deepBlue-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-deepBlue-600 hover:underline"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-deepBlue-800">Question Management</h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">Select Exam</h3>
          <select
            value={selectedExam || ''}
            onChange={(e) => setSelectedExam(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
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
                <h3 className="text-xl font-semibold text-deepBlue-800">
                  Questions ({questions.length})
                </h3>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-deepBlue-600 text-white px-4 py-2 rounded-lg hover:bg-deepBlue-700 transition"
                >
                  {showForm ? 'Cancel' : 'Add Question'}
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleCreateQuestion} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-deepBlue-700 text-sm font-bold mb-2">
                      Question Text
                    </label>
                    <textarea
                      value={formData.questionText}
                      onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                      className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-deepBlue-700 text-sm font-bold mb-2">Option A</label>
                      <input
                        type="text"
                        value={formData.optionA}
                        onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                        className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-deepBlue-700 text-sm font-bold mb-2">Option B</label>
                      <input
                        type="text"
                        value={formData.optionB}
                        onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                        className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-deepBlue-700 text-sm font-bold mb-2">Option C</label>
                      <input
                        type="text"
                        value={formData.optionC}
                        onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                        className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-deepBlue-700 text-sm font-bold mb-2">Option D</label>
                      <input
                        type="text"
                        value={formData.optionD}
                        onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                        className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-deepBlue-700 text-sm font-bold mb-2">Correct Answer</label>
                      <select
                        value={formData.correctAnswer}
                        onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                        className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-deepBlue-700 text-sm font-bold mb-2">Marks</label>
                      <input
                        type="number"
                        value={formData.marks}
                        onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-deepBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
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
                <p className="text-deepBlue-600 text-center py-8">No questions added yet.</p>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.question_id} className="border border-deepBlue-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-deepBlue-800">
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
                        <div className={`p-2 rounded ${question.correct_answer === 'A' ? 'bg-purple-100' : 'bg-deepBlue-50'}`}>
                          A. {question.option_a}
                        </div>
                        <div className={`p-2 rounded ${question.correct_answer === 'B' ? 'bg-purple-100' : 'bg-deepBlue-50'}`}>
                          B. {question.option_b}
                        </div>
                        <div className={`p-2 rounded ${question.correct_answer === 'C' ? 'bg-purple-100' : 'bg-deepBlue-50'}`}>
                          C. {question.option_c}
                        </div>
                        <div className={`p-2 rounded ${question.correct_answer === 'D' ? 'bg-purple-100' : 'bg-deepBlue-50'}`}>
                          D. {question.option_d}
                        </div>
                      </div>
                      <p className="text-sm text-deepBlue-600 mt-2">Marks: {question.marks}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionManagement;
