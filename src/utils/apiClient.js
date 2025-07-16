import { API, ERROR_MESSAGES } from './constants';

// Import mock data
import breakfastRecipes from '../data/recipes/breakfast.json';
import lunchRecipes from '../data/recipes/lunch.json';
import dinnerRecipes from '../data/recipes/dinner.json';

/**
 * API client for making HTTP requests
 * This utility can be used in services without requiring React hooks
 */
class ApiClient {
  constructor() {
    // Flag to use mock data (for development)
    this.useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true' || true;
    
    // Mock data
    this.mockData = {
      recipes: [...breakfastRecipes, ...lunchRecipes, ...dinnerRecipes],
    };
    
    // Mock endpoints
    this.mockEndpoints = {
      // Recipe endpoints
      [API.RECIPES]: () => this._createApiResponse(this.mockData.recipes),
      [`${API.RECIPES}/random`]: (params) => {
        const count = params?.count || 5;
        const shuffled = [...this.mockData.recipes].sort(() => 0.5 - Math.random());
        return this._createApiResponse(shuffled.slice(0, count));
      },
      [`${API.RECIPES}/featured`]: () => {
        // Return a mix of different meal types
        const featured = [
          ...this.mockData.recipes.filter(r => r.mealType === 'breakfast').slice(0, 2),
          ...this.mockData.recipes.filter(r => r.mealType === 'lunch').slice(0, 2),
          ...this.mockData.recipes.filter(r => r.mealType === 'dinner').slice(0, 2),
        ];
        return this._createApiResponse(featured);
      },
      
      // Recommendation endpoints
      [API.RECOMMENDATIONS]: (data) => {
        // Filter recipes based on preferences
        let filteredRecipes = this.mockData.recipes;
        
        // Apply diet type filter
        if (data?.preferences?.dietType) {
          filteredRecipes = this._filterByDietType(filteredRecipes, data.preferences.dietType);
        }
        
        // Apply allergies filter
        if (data?.preferences?.allergies?.length > 0) {
          filteredRecipes = this._filterByAllergies(filteredRecipes, data.preferences.allergies);
        }
        
        // Apply meal type filter
        if (data?.preferences?.mealType) {
          filteredRecipes = filteredRecipes.filter(recipe => recipe.mealType === data.preferences.mealType);
        }
        
        // Take random subset
        const count = data?.count || 15;
        const shuffled = [...filteredRecipes].sort(() => 0.5 - Math.random());
        return this._createApiResponse(shuffled.slice(0, count));
      },
    };
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async get(endpoint, options = {}) {
    // Check if we should use mock data
    if (this.useMockData) {
      return this._handleMockRequest('GET', endpoint, null, options);
    }
    
    try {
      const url = this._buildUrl(endpoint);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this._getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });

      return this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async post(endpoint, data, options = {}) {
    // Check if we should use mock data
    if (this.useMockData) {
      return this._handleMockRequest('POST', endpoint, data, options);
    }
    
    try {
      const url = this._buildUrl(endpoint);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this._getAuthHeaders(),
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      return this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async put(endpoint, data, options = {}) {
    // Check if we should use mock data
    if (this.useMockData) {
      return this._handleMockRequest('PUT', endpoint, data, options);
    }
    
    try {
      const url = this._buildUrl(endpoint);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this._getAuthHeaders(),
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      return this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async delete(endpoint, options = {}) {
    // Check if we should use mock data
    if (this.useMockData) {
      return this._handleMockRequest('DELETE', endpoint, null, options);
    }
    
    try {
      const url = this._buildUrl(endpoint);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this._getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });

      return this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Handle mock request
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise<any>} Mock response
   * @private
   */
  async _handleMockRequest(method, endpoint, data, options) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if we have a mock endpoint handler
    if (this.mockEndpoints[endpoint]) {
      return this.mockEndpoints[endpoint](data || options);
    }
    
    // Handle dynamic endpoints (with IDs)
    if (endpoint.includes('/')) {
      const parts = endpoint.split('/');
      const id = parts[parts.length - 1];
      const basePath = parts.slice(0, -1).join('/');
      
      // Handle recipe by ID
      if (basePath === API.RECIPES) {
        const recipe = this.mockData.recipes.find(r => r.id === id);
        if (recipe) {
          return this._createApiResponse(recipe);
        }
        throw new Error(`Recipe with ID ${id} not found`);
      }
    }
    
    // Default mock response
    return this._createApiResponse({}, true, 'Mock data not available for this endpoint');
  }

  /**
   * Build full URL from endpoint
   * @param {string} endpoint - API endpoint
   * @returns {string} Full URL
   * @private
   */
  _buildUrl(endpoint) {
    // If endpoint already starts with http, use it as is
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    
    // Otherwise, prepend the API base URL
    return `${API.BASE_URL}${endpoint}`;
  }

  /**
   * Get authentication headers
   * @returns {Object} Auth headers
   * @private
   */
  _getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch response
   * @returns {Promise<any>} Parsed response data
   * @private
   */
  async _handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  }

  /**
   * Handle API error
   * @param {Error} error - Error object
   * @throws {Error} Enhanced error
   * @private
   */
  _handleError(error) {
    console.error('API request failed:', error);
    throw new Error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
  }

  /**
   * Create standardized API response
   * @param {any} data - Response data
   * @param {boolean} success - Success flag
   * @param {string} message - Response message
   * @returns {Object} Standardized response
   * @private
   */
  _createApiResponse(data, success = true, message = '') {
    return {
      data,
      success,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Filter recipes by diet type
   * @param {Array} recipes - Recipes to filter
   * @param {string} dietType - Diet type
   * @returns {Array} Filtered recipes
   * @private
   */
  _filterByDietType(recipes, dietType) {
    return recipes.filter(recipe => {
      switch (dietType) {
        case 'vegetarian':
          return recipe.dietaryInfo.vegetarian;
        case 'non-vegetarian':
          return true; // All recipes are allowed
        case 'eggetarian':
          return recipe.dietaryInfo.vegetarian || 
                 recipe.ingredients.some(i => i.name.toLowerCase().includes('egg'));
        default:
          return true;
      }
    });
  }

  /**
   * Filter recipes by allergies
   * @param {Array} recipes - Recipes to filter
   * @param {Array} allergies - Allergies to avoid
   * @returns {Array} Filtered recipes
   * @private
   */
  _filterByAllergies(recipes, allergies = []) {
    if (!allergies || allergies.length === 0) {
      return recipes;
    }

    return recipes.filter(recipe => {
      return !allergies.some(allergy => {
        return recipe.ingredients.some(ingredient => {
          const ingredientName = ingredient.name.toLowerCase();
          
          switch (allergy) {
            case 'nuts':
              return ingredientName.includes('nut') || 
                     ingredientName.includes('almond') || 
                     ingredientName.includes('walnut') || 
                     ingredientName.includes('cashew') ||
                     ingredientName.includes('pecan') ||
                     ingredientName.includes('hazelnut');
            case 'peanuts':
              return ingredientName.includes('peanut');
            case 'dairy':
              return ingredientName.includes('milk') || 
                     ingredientName.includes('cheese') || 
                     ingredientName.includes('yogurt') || 
                     ingredientName.includes('butter') ||
                     ingredientName.includes('cream');
            case 'eggs':
              return ingredientName.includes('egg');
            case 'soy':
              return ingredientName.includes('soy') || 
                     ingredientName.includes('tofu') ||
                     ingredientName.includes('tempeh');
            case 'shellfish':
              return ingredientName.includes('shrimp') || 
                     ingredientName.includes('crab') || 
                     ingredientName.includes('lobster') ||
                     ingredientName.includes('shellfish');
            case 'fish':
              return ingredientName.includes('salmon') || 
                     ingredientName.includes('tuna') || 
                     ingredientName.includes('cod') ||
                     ingredientName.includes('fish');
            case 'wheat':
              return ingredientName.includes('wheat') || 
                     ingredientName.includes('flour') ||
                     ingredientName.includes('bread');
            case 'sesame':
              return ingredientName.includes('sesame') || 
                     ingredientName.includes('tahini');
            default:
              return ingredientName.includes(allergy.toLowerCase());
          }
        });
      });
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
