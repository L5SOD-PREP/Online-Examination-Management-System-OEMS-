import api from './axios';

export const startAttempt = async (examId) => {
  const response = await api.post('/attempts/start', { examId });
  return response.data;
};

export const submitAnswer = async (attemptId, questionId, selectedAnswer) => {
  const response = await api.post('/attempts/answer', { attemptId, questionId, selectedAnswer });
  return response.data;
};

export const submitExam = async (attemptId) => {
  const response = await api.post('/attempts/submit', { attemptId });
  return response.data;
};

export const getStudentAttempts = async () => {
  const response = await api.get('/attempts');
  return response.data;
};

export const getAttemptById = async (attemptId) => {
  const response = await api.get(`/attempts/${attemptId}`);
  return response.data;
};
