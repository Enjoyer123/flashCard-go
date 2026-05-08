import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// สร้าง instance ของ axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // จัดการกรณี 401 Unauthorized (Token หมดอายุ หรือไม่มีสิทธิ์)
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Session expired or invalid token.");
      if (error.response?.status === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
