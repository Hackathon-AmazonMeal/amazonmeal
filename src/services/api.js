// api.js - API client for interacting with backend services
import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    // Extract data from standard response format
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data;
  },
  error => {
    // Handle error responses
    if (error.response && error.response.data && error.response.data.error) {
      // Extract structured error from API response
      return Promise.reject(error.response.data.error);
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ code: 'TIMEOUT', message: 'Request timeout' });
    }
    
    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: error.message || 'Network error occurred'
    });
  }
);

// User API functions
export const fetchUserProfile = (userId) => {
  return apiClient.get(`/users/${userId}`);
};

export const createUserProfile = (userData) => {
  return apiClient.post('/users', userData);
};

export const updateUserPreferences = (userId, preferences) => {
  return apiClient.patch(`/users/${userId}/preferences`, preferences);
};

// Recipe API functions
export const fetchRecipes = (filters = {}) => {
  return apiClient.get('/recipes', { params: filters });
};

export const fetchRecipeDetails = (recipeId) => {
  return apiClient.get(`/recipes/${recipeId}`);
};

export const rateRecipe = (recipeId, userId, rating, comment) => {
  return apiClient.post(`/recipes/${recipeId}/ratings`, { 
    userId, 
    rating, 
    comment 
  });
};

export const searchRecipes = (query, filters = {}) => {
  return apiClient.get('/recipes/search', { 
    params: { query, ...filters } 
  });
};

// Recommendation API functions
export const fetchRecommendedRecipes = (userId, count = 10) => {
  return apiClient.get(`/recommendations/recipes`, { 
    params: { userId, count } 
  });
};

export const generateMealPlan = (userId, options = {}) => {
  const {
    days = 7,
    mealsPerDay = 3,
    startDate = new Date().toISOString().split('T')[0],
    preferences = {}
  } = options;

  return apiClient.post('/meal-plans', {
    userId,
    days,
    mealsPerDay,
    startDate,
    preferences
  });
};

// Meal Plan API functions
export const fetchUserMealPlans = (userId) => {
  return apiClient.get('/meal-plans', { params: { userId } });
};

export const fetchMealPlanDetails = (mealPlanId) => {
  return apiClient.get(`/meal-plans/${mealPlanId}`);
};

export const updateMealPlan = (mealPlanId, updates) => {
  return apiClient.patch(`/meal-plans/${mealPlanId}`, { updates });
};

export const deleteMealPlan = (mealPlanId) => {
  return apiClient.delete(`/meal-plans/${mealPlanId}`);
};

// Shopping List API functions
export const fetchUserShoppingLists = (userId) => {
  return apiClient.get('/shopping-lists', { params: { userId } });
};

export const generateShoppingList = (userId, mealPlanId, options = {}) => {
  return apiClient.post('/shopping-lists', {
    userId,
    mealPlanId,
    ...options
  });
};

export const fetchShoppingListDetails = (shoppingListId) => {
  return apiClient.get(`/shopping-lists/${shoppingListId}`);
};

export const updateShoppingListItem = (shoppingListId, productId, updates) => {
  return apiClient.patch(`/shopping-lists/${shoppingListId}/items/${productId}`, updates);
};

export const addToCart = (shoppingListId) => {
  return apiClient.post(`/shopping-lists/${shoppingListId}/checkout`);
};

export const removeShoppingListItem = (shoppingListId, productId) => {
  return apiClient.delete(`/shopping-lists/${shoppingListId}/items/${productId}`);
};

// Product API functions
export const fetchProducts = (filters = {}) => {
  return apiClient.get('/products', { params: filters });
};

export const fetchProductDetails = (productId) => {
  return apiClient.get(`/products/${productId}`);
};

export const getProductSubstitutions = (productId) => {
  return apiClient.get(`/products/${productId}/substitutions`);
};

// Voice API functions
export const processVoiceCommand = (userId, command, audioData = null) => {
  const payload = { userId };
  
  if (audioData) {
    payload.audioData = audioData;
  } else {
    payload.transcription = command;
  }
  
  return apiClient.post('/voice/commands', payload);
};

export const getVoiceInstructions = (recipeId, stepNumber) => {
  return apiClient.get(`/voice/recipes/${recipeId}/instructions/${stepNumber}`);
};

// Nutrition API functions
export const analyzeNutrition = (mealPlanId) => {
  return apiClient.get(`/nutrition/meal-plans/${mealPlanId}`);
};

export const getNutritionGoals = (userId) => {
  return apiClient.get(`/nutrition/goals/${userId}`);
};

export const updateNutritionGoals = (userId, goals) => {
  return apiClient.put(`/nutrition/goals/${userId}`, goals);
};

// Utility functions for error handling
export const isApiError = (error) => {
  return error && typeof error === 'object' && error.code;
};

export const getErrorMessage = (error) => {
  if (isApiError(error)) {
    return error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

// Mock data functions for development
export const enableMockMode = () => {
  // Override API calls with mock data for development
  console.log('Mock mode enabled - API calls will return mock data');
};

export default apiClient;
