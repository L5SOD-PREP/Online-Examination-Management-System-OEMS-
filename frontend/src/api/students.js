import api from './axios';

export const getAllStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

export const getAllTeachers = async () => {
  const response = await api.get('/students/teachers');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/students', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/students/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};
