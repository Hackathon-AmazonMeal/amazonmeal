import { useState, useCallback } from 'react';
import { API, ERROR_MESSAGES } from '../utils/constants';

/**
 * Custom hook for making API calls
 * @returns {Object} API methods and state
 */
export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Clear any existing error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Make a GET request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} - Response data
   */
  const get = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await fetch(`${API.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message || ERROR_MESSAGES.NETWORK_ERROR);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  /**
   * Make a POST request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} - Response data
   */
  const post = useCallback(async (endpoint, data, options = {}) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await fetch(`${API.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      setError(error.message || ERROR_MESSAGES.NETWORK_ERROR);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  /**
   * Make a PUT request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} - Response data
   */
  const put = useCallback(async (endpoint, data, options = {}) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await fetch(`${API.BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      setError(error.message || ERROR_MESSAGES.NETWORK_ERROR);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  /**
   * Make a DELETE request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} - Response data
   */
  const del = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await fetch(`${API.BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      setError(error.message || ERROR_MESSAGES.NETWORK_ERROR);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  return {
    isLoading,
    error,
    clearError,
    setError,
    get,
    post,
    put,
    delete: del,
  };
}
