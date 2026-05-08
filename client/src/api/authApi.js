import apiClient from './client';

export const loginFn = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const registerFn = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const logoutFn = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};
