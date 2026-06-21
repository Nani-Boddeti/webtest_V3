import axios from 'axios';

/**
 * Axios client configured for cookie-based JWT authentication.
 * - withCredentials: true ensures httpOnly cookies are sent with every request.
 * - No localStorage tokens are used — the server sets/clears the session cookie.
 * - On 401 responses, redirects to /login (unless already there).
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — handle 401 unauthorised globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !window.location.pathname.startsWith('/login') &&
      !window.location.pathname.startsWith('/register')
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
