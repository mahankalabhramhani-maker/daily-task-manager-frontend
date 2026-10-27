import axios from 'axios';

/**
 * Configure API Base URL:
 * - Read from Vite environment variable VITE_API_BASE_URL (for Vercel / Cloud deployment)
 * - If not provided (local development), default to '/api/tasks' (forwarded via Vite dev proxy)
 * - Automatically normalizes trailing slashes and ensures /api/tasks endpoint path
 */
const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

const getTasksEndpoint = () => {
  if (!rawBaseUrl) {
    // Relative path for local dev proxy
    return '/api/tasks';
  }
  const clean = rawBaseUrl.replace(/\/+$/, '');
  return clean.endsWith('/api/tasks') ? clean : `${clean}/api/tasks`;
};

const getHealthEndpoint = () => {
  if (!rawBaseUrl) {
    return '/api/health';
  }
  const clean = rawBaseUrl.replace(/\/+$/, '');
  const rootUrl = clean.endsWith('/api/tasks') ? clean.replace(/\/api\/tasks$/, '') : clean;
  return `${rootUrl}/api/health`;
};

const apiClient = axios.create({
  baseURL: getTasksEndpoint(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor to extract standard backend ApiResponse data or format friendly errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'An unexpected server error occurred';
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
        // Include field-level validation errors if present
        if (error.response.data.data && typeof error.response.data.data === 'object') {
          const fieldErrors = Object.values(error.response.data.data).join(', ');
          errorMessage += `: ${fieldErrors}`;
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export const taskService = {
  /**
   * Fetch all tasks with optional status and search filters
   * @param {string} status - ALL, PENDING, or COMPLETED
   * @param {string} search - Keyword search in title/description
   */
  getAll: async (status = 'ALL', search = '') => {
    const params = {};
    if (status && status !== 'ALL') params.status = status;
    if (search && search.trim()) params.search = search.trim();
    return apiClient.get('', { params });
  },

  /**
   * Get single task by ID
   * @param {number|string} id
   */
  getById: async (id) => {
    return apiClient.get(`/${id}`);
  },

  /**
   * Create a new task
   * @param {Object} taskData - { title, description, dueDate, status }
   */
  create: async (taskData) => {
    return apiClient.post('', taskData);
  },

  /**
   * Update an existing task
   * @param {number|string} id
   * @param {Object} taskData - { title, description, dueDate, status }
   */
  update: async (id, taskData) => {
    return apiClient.put(`/${id}`, taskData);
  },

  /**
   * Toggle task status between PENDING and COMPLETED
   * @param {number|string} id
   */
  toggleStatus: async (id) => {
    return apiClient.patch(`/${id}/toggle`);
  },

  /**
   * Update task status explicitly
   * @param {number|string} id
   * @param {string} status - PENDING or COMPLETED
   */
  updateStatus: async (id, status) => {
    return apiClient.patch(`/${id}/status`, null, { params: { status } });
  },

  /**
   * Delete a task by ID
   * @param {number|string} id
   */
  delete: async (id) => {
    return apiClient.delete(`/${id}`);
  },

  /**
   * Get task summary statistics
   */
  getStats: async () => {
    return apiClient.get('/stats');
  },

  /**
   * Lightweight health check verification
   */
  getHealth: async () => {
    return axios.get(getHealthEndpoint(), { timeout: 8000 });
  },
};

export default taskService;
