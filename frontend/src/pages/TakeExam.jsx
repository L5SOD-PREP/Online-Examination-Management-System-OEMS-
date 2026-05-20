import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById } from '../api/exams';
import { getQuestionsByExam } from '../api/questions';
import { startAttempt, submitAnswer, submitExam } from '../api/attempts';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/auth';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initializeExam();
  }, [examId]);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0 && !submitting) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining, submitting]);

  const initializeExam = async () => {
    try {
      const examData = await getExamById(examId);
      setExam(examData);
      
      const questionsData = await getQuestionsByExam(examId);
      setQuestions(questionsData);
      
      const attempt = await startAttempt(examId);
      setAttemptId(attempt.attemptId);
      
      setTimeRemaining(examData.duration * 60);
    } catch (error) {
      console.error('Failed to initialize exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (questionId, selectedAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer
    }));

    try {
      await submitAnswer(attemptId, questionId, selectedAnswer);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const result = await submitExam(attemptId);
      navigate('/results', { state: { result } });
    } catch (error) {
      console.error('Failed to submit exam:', error);
      setSubmitting(false);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading exam...</p>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Exam not found or no questions available.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {exam.exam_title}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <div className={`px-4 py-2 rounded-lg font-bold ${
                  timeRemaining < 300 ? 'bg-red-500 text-white' : 'bg-blue-700 text-white'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-lg text-gray-700 mb-6">
                {currentQuestionIndex + 1}. {currentQuestion.question_text}
              </p>

              <div className="space-y-4">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(currentQuestion.question_id, option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers[currentQuestion.question_id] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-semibold mr-4">{option}.</span>
                    {currentQuestion[`option_${option.toLowerCase()}`]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
              >
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  disabled={submitting}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Exam'}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Next
                </button>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg font-semibold transition ${
                      currentQuestionIndex === index
                        ? 'bg-blue-700 text-white'
                        : answers[questions[index].question_id]
                        ? 'bg-purple-500 text-white'
                        : 'bg-blue-200 text-gray-700 hover:bg-blue-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;
