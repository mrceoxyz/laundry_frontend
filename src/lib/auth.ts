import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  role: 'customer' | 'admin';
  profile?: any;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

// Set auth token in axios headers
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('access_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

// Initialize auth from localStorage
export const initializeAuth = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    setAuthToken(token);
  }
};

export const authAPI = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    role: 'customer' | 'admin';
    phone: string;
    address?: string;
  }) => {
    const response = await api.post<AuthResponse>('/auth/register/', data);
    if (response.data.tokens) {
      setAuthToken(response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login/', { username, password });
    if (response.data.tokens) {
      setAuthToken(response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      await api.post('/auth/logout/', { refresh_token: refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthToken(null);
    }
  },

  getProfile: async () => {
    const response = await api.get<User>('/auth/profile/');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<User>('/auth/profile/', data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  checkUsername: async (username: string) => {
    const response = await api.post<{ exists: boolean }>('/auth/check-username/', { username });
    return response.data.exists;
  },

  checkEmail: async (email: string) => {
    const response = await api.post<{ exists: boolean }>('/auth/check-email/', { email });
    return response.data.exists;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await api.post<{ access: string }>('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    setAuthToken(response.data.access);
    return response.data.access;
  },
};

// Axios interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await authAPI.refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAuthToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
