import { useState, useCallback } from 'react';
import recipeService from '../services/recipeService';
import recommendationService from '../services/recommendationService';
import userService from '../services/userService';
import cartService from '../services/cartService';
import orderService from '../services/orderService';

/**
 * Custom hook to provide service access with loading and error states
 * @param {Object} service - Service instance to use
 * @returns {Object} Service with loading and error states
 */
export function useService(service) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Clear any existing error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Wrap a service method with loading and error handling
   * @param {Function} method - Service method to wrap
   * @returns {Function} Wrapped method
   */
  const withLoadingAndError = useCallback((method) => {
    return async (...args) => {
      setIsLoading(true);
      clearError();
      
      try {
        const result = await method(...args);
        return result;
      } catch (error) {
        setError(error.message || 'An unexpected error occurred');
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
  }, [clearError]);

  /**
   * Create a wrapped service with all methods wrapped
   * @param {Object} serviceInstance - Service instance
   * @returns {Object} Wrapped service
   */
  const wrapService = useCallback((serviceInstance) => {
    const wrappedService = {};
    
    // Get all method names from the service
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(serviceInstance))
      .filter(name => 
        typeof serviceInstance[name] === 'function' && 
        name !== 'constructor' &&
        !name.startsWith('_')
      );
    
    // Wrap each method
    methodNames.forEach(methodName => {
      wrappedService[methodName] = withLoadingAndError(
        serviceInstance[methodName].bind(serviceInstance)
      );
    });
    
    return wrappedService;
  }, [withLoadingAndError]);

  // Return the wrapped service along with loading and error states
  return {
    isLoading,
    error,
    clearError,
    service: wrapService(service),
  };
}

/**
 * Hook for recipe service
 * @returns {Object} Recipe service with loading and error states
 */
export function useRecipeService() {
  return useService(recipeService);
}

/**
 * Hook for recommendation service
 * @returns {Object} Recommendation service with loading and error states
 */
export function useRecommendationService() {
  return useService(recommendationService);
}

/**
 * Hook for user service
 * @returns {Object} User service with loading and error states
 */
export function useUserService() {
  return useService(userService);
}

/**
 * Hook for cart service
 * @returns {Object} Cart service with loading and error states
 */
export function useCartService() {
  return useService(cartService);
}

/**
 * Hook for order service
 * @returns {Object} Order service with loading and error states
 */
export function useOrderService() {
  return useService(orderService);
}

export default useService;
