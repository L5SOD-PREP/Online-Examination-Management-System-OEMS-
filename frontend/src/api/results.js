import api from './axios';

export const getStudentResults = async () => {
  const response = await api.get('/results');
  return response.data;
};

export const getResultByAttemptId = async (attemptId) => {
  const response = await api.get(`/results/attempt/${attemptId}`);
  return response.data;
};

export const getAllResults = async () => {
  const response = await api.get('/results/all');
  return response.data;
};
