interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface MeResponse {
  user: {
    id: string;
    email: string;
    last_sign_in_at: string;
  };
}

const API_BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  
  if (!response.ok) {
    return {
      error: data.error || 'An error occurred'
    };
  }

  return { data };
}

export const api = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: 'include',
      });
      return handleResponse<T>(response);
    } catch (error: unknown) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  },

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      return handleResponse<T>(response);
    } catch (error: unknown) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  },

  // Auth specific methods
  auth: {
    async me() {
      return api.get<MeResponse>('/auth/me');
    },

    async login(email: string, password: string) {
      return api.post('/auth/login', { email, password });
    },

    async register(userData: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone_number: string;
      department: string;
    }) {
      return api.post('/auth/register', userData);
    },

    async forgotPassword(email: string) {
      return api.post('/auth/forgot-password', { email });
    },

    async logout() {
      return api.post('/auth/logout', {});
    },
  },
}; 