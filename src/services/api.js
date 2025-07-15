// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// API client class
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export API utilities
export const API_ENDPOINTS = {
  // User endpoints
  USERS: '/users',
  USER_PREFERENCES: '/users/preferences',
  
  // Recipe endpoints
  RECIPES: '/recipes',
  RECIPE_SEARCH: '/recipes/search',
  
  // Recommendation endpoints
  RECOMMENDATIONS: '/recommendations',
  PERSONALIZED_RECOMMENDATIONS: '/recommendations/personalized',
  
  // Cart endpoints
  CART: '/cart',
  CHECKOUT: '/cart/checkout',
  
  // Order endpoints
  ORDERS: '/orders',
  ORDER_HISTORY: '/orders/history',
};

// Mock data flag for development
export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true' || true;

// Error handling utility
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Response wrapper utility
export function createApiResponse(data, success = true, message = '') {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export default apiClient;
