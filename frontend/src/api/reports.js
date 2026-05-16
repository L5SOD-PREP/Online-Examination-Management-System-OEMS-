import api from './axios';

export const getStudentPerformanceReport = async (studentId) => {
  const response = await api.get(`/reports/student/${studentId}`);
  return response.data;
};

export const getPassFailReport = async (examId) => {
  const response = await api.get(`/reports/passfail/${examId}`);
  return response.data;
};

export const getExamResultReport = async (examId) => {
  const response = await api.get(`/reports/exam/${examId}`);
  return response.data;
};
