import apiClient from './client';
import type { User } from '../types/user';

export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
}

export interface RegisterCredentials {
  username?: string;
  email?: string;
  password?: string;
}

export const loginFn = async (credentials: LoginCredentials): Promise<User> => {
  const response = await apiClient.post<User>('/auth/login', credentials);
  return response.data;
};

export const registerFn = async (userData: RegisterCredentials): Promise<any> => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const logoutFn = async (): Promise<any> => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};
