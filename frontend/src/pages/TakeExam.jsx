import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById } from '../api/exams';
import { getQuestionsByExam } from '../api/questions';
import { startAttempt, submitAnswer, submitExam } from '../api/attempts';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
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
      
      const questionsData = await getQuestions(examId);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deepBlue-50">
        <p className="text-deepBlue-600">Loading exam...</p>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deepBlue-50">
        <p className="text-deepBlue-600">Exam not found or no questions available.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-deepBlue-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/exams')}
              className="text-deepBlue-600 hover:underline"
            >
              ← Exit Exam
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-deepBlue-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <div className={`px-4 py-2 rounded-lg font-bold ${
                timeRemaining < 300 ? 'bg-red-500 text-white' : 'bg-deepBlue-600 text-white'
              }`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-deepBlue-800 mb-6">
            {exam.exam_title}
          </h2>

          <div className="mb-8">
            <p className="text-lg text-deepBlue-700 mb-6">
              {currentQuestionIndex + 1}. {currentQuestion.question_text}
            </p>

            <div className="space-y-4">
              {['A', 'B', 'C', 'D'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(currentQuestion.question_id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    answers[currentQuestion.question_id] === option
                      ? 'border-deepBlue-500 bg-deepBlue-50'
                      : 'border-deepBlue-200 hover:border-deepBlue-300'
                  }`}
                >
                  <span className="font-semibold mr-4">{option}.</span>
                  {currentQuestion[`option_${option.toLowerCase()}`]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-deepBlue-500 text-white rounded-lg font-semibold hover:bg-deepBlue-600 transition disabled:opacity-50"
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
                className="px-6 py-3 bg-deepBlue-600 text-white rounded-lg font-semibold hover:bg-deepBlue-700 transition"
              >
                Next
              </button>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-deepBlue-800 mb-4">Question Navigation</h3>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    currentQuestionIndex === index
                      ? 'bg-deepBlue-600 text-white'
                      : answers[questions[index].question_id]
                      ? 'bg-purple-500 text-white'
                      : 'bg-deepBlue-200 text-deepBlue-700 hover:bg-deepBlue-300'
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
  );
};

export default TakeExam;
