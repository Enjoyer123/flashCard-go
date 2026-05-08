import { useMutation } from '@tanstack/react-query';
import { loginFn, registerFn } from '../../api/authApi';
import type { LoginCredentials, RegisterCredentials } from '../../api/authApi';
import { useAuthStore } from '../../store/useAuthStore';
import type { User } from '../../types/user';
import { AxiosError } from 'axios';

interface ApiError {
  error: string;
}

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation<User, AxiosError<ApiError>, LoginCredentials>({
    mutationFn: loginFn,
    onSuccess: (data) => {
      login(data);
    },
  });
};

export const useRegister = () => {
  return useMutation<any, AxiosError<ApiError>, RegisterCredentials>({
    mutationFn: registerFn,
  });
};
