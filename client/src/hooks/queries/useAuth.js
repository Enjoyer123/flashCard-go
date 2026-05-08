import { useMutation } from '@tanstack/react-query';
import { loginFn, registerFn } from '../../api/authApi';
import { useAuthStore } from '../../store/useAuthStore';

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      login(data);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerFn,
  });
};
