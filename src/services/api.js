// API Base Configuration
const API_BASE_URL = 'http://localhost:8080';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

// Helper function to make authenticated API calls
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API Services
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    return makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// User API Services
export const userAPI = {
  // Get all users
  getAllUsers: async () => {
    return makeRequest('/api/users');
  },

  // Get user by ID
  getUserById: async (id) => {
    return makeRequest(`/api/users/${id}`);
  },

  // Create new user (deprecated in favor of register)
  createUser: async (userData) => {
    return makeRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Group API Services
export const groupAPI = {
  // Get settle up details for a group
  settleUpForGroup: async (groupId, userId) => {
    return makeRequest(`/settleUp/${groupId}/${userId}`);
  },

  // Mark group as settled
  markGroupSettled: async (settledData) => {
    return makeRequest(`/${settledData.groupId}/settled`, {
      method: 'POST',
      body: JSON.stringify(settledData),
    });
  },

  // Create a new group
  createGroup: async (groupData) => {
    return makeRequest('/createGroup', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  },

  // Add expense to group
  addExpense: async (expenseData) => {
    return makeRequest('/addExpense', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  },

  // Get expenses by filter
  getExpenses: async (groupId, category = null, startDate = null, endDate = null) => {
    const params = new URLSearchParams({ groupId });
    if (category) params.append('category', category);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return makeRequest(`/expenses?${params.toString()}`);
  },
};

// Budget API Services
export const budgetAPI = {
  // Create or update budget
  createOrUpdateBudget: async (budgetData) => {
    return makeRequest('/api/budget', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  },

  // Get budget by ID
  getBudgetById: async (budgetId) => {
    return makeRequest(`/api/budget/${budgetId}`);
  },

  // Get user budgets for specific month/year
  getUserBudgets: async (userId, month = null, year = null) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const queryString = params.toString();
    return makeRequest(`/api/budget/user/${userId}${queryString ? `?${queryString}` : ''}`);
  },

  // Get budget summary for user
  getBudgetSummary: async (userId, month = null, year = null) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const queryString = params.toString();
    return makeRequest(`/api/budget/summary/${userId}${queryString ? `?${queryString}` : ''}`);
  },

  // Get exceeded budgets
  getExceededBudgets: async (userId, month = null, year = null) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const queryString = params.toString();
    return makeRequest(`/api/budget/exceeded/${userId}${queryString ? `?${queryString}` : ''}`);
  },

  // Get budgets nearing limit
  getNearingLimitBudgets: async (userId, month = null, year = null) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const queryString = params.toString();
    return makeRequest(`/api/budget/nearing-limit/${userId}${queryString ? `?${queryString}` : ''}`);
  },

  // Delete budget
  deleteBudget: async (budgetId) => {
    return makeRequest(`/api/budget/${budgetId}`, {
      method: 'DELETE',
    });
  },
};

// Export default API object with all services
const api = {
  auth: authAPI,
  user: userAPI,
  group: groupAPI,
  budget: budgetAPI,
};

export default api;