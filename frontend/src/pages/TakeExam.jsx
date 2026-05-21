import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById } from '../api/exams';
import { getQuestionsByExam } from '../api/questions';
import { startAttempt, submitAnswer, submitExam } from '../api/attempts';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/auth';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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
  const submittingRef = useRef(false);
  const fullscreenRef = useRef(false);

  const handleSubmitExam = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      const result = await submitExam(attemptId);
      navigate('/results', { state: { result } });
    } catch (error) {
      console.error('Failed to submit exam:', error);
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [attemptId, navigate]);

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
  }, [timeRemaining, submitting, handleSubmitExam]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && attemptId && !submittingRef.current) {
        handleSubmitExam();
      }
    };

    const handleBlur = () => {
      if (attemptId && !submittingRef.current) {
        handleSubmitExam();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && attemptId && fullscreenRef.current && !submittingRef.current) {
        handleSubmitExam();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [attemptId, handleSubmitExam]);

  const initializeExam = async () => {
    try {
      const examData = await getExamById(examId);
      setExam(examData);
      
      const questionsData = await getQuestionsByExam(examId);
      setQuestions(shuffleArray(questionsData));
      
      const attempt = await startAttempt(examId);
      setAttemptId(attempt.attemptId);
      
      setTimeRemaining(examData.duration * 60);

      try {
        await document.documentElement.requestFullscreen();
        fullscreenRef.current = true;
      } catch {
        fullscreenRef.current = false;
      }
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-600">Loading exam...</p>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-600">Exam not found or no questions available.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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
                className="w-full text-left px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 transition font-medium"
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">
                {exam.exam_title}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-neutral-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <div className={`px-4 py-2 rounded-lg font-bold ${
                  timeRemaining < 300 ? 'bg-red-500 text-white' : 'bg-primary-600 text-white'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-lg text-neutral-700 mb-6">
                {currentQuestionIndex + 1}. {currentQuestion.question_text}
              </p>

              <div className="space-y-4">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(currentQuestion.question_id, option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers[currentQuestion.question_id] === option
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-300'
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
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
              >
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  disabled={submitting}
                  className="px-6 py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Exam'}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Next
                </button>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Question Navigation</h3>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg font-semibold transition ${
                      currentQuestionIndex === index
                        ? 'bg-primary-600 text-white'
                        : answers[questions[index].question_id]
                        ? 'bg-accent-500 text-white'
                        : 'bg-primary-200 text-neutral-700 hover:bg-primary-300'
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
