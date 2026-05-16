import api from './axios';

export const getQuestionsByExam = async (examId) => {
  const response = await api.get(`/questions/exam/${examId}`);
  return response.data;
};

export const getQuestionById = async (questionId) => {
  const response = await api.get(`/questions/${questionId}`);
  return response.data;
};

export const createQuestion = async (questionData) => {
  const response = await api.post('/questions', questionData);
  return response.data;
};

export const updateQuestion = async (questionId, questionData) => {
  const response = await api.put(`/questions/${questionId}`, questionData);
  return response.data;
};

export const deleteQuestion = async (questionId) => {
  const response = await api.delete(`/questions/${questionId}`);
  return response.data;
};
