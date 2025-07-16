/**
 * Application-wide constants
 */

/**
 * API endpoints
 */
export const API = {
  BASE_URL: 'https://user-ms-iimt.vercel.app',
  PREFERENCES: '/preference',
  RECIPES: '/recipes',
  RECOMMENDATIONS: '/recommendations',
  USERS: '/users',
};

/**
 * Diet types
 */
export const DIET_TYPES = {
  VEGETARIAN: 'vegetarian',
  NON_VEGETARIAN: 'non-vegetarian',
  EGGETARIAN: 'eggetarian',
};

/**
 * Meal types
 */
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
};

/**
 * Cooking times
 */
export const COOKING_TIMES = {
  QUICK: 'quick',
  MEDIUM: 'medium',
  SLOW: 'slow',
};

/**
 * Cooking methods
 */
export const COOKING_METHODS = {
  STOVETOP: 'stovetop',
  OVEN: 'oven',
  GRILL: 'grill',
  SLOW_COOKER: 'slow_cooker',
  PRESSURE_COOKER: 'pressure_cooker',
  AIR_FRYER: 'air_fryer',
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  USER: 'currentUser',
  PREFERENCES: 'userPreferences',
  CART: 'shoppingCart',
  AUTH_TOKEN: 'authToken',
};

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PREFERENCES: '/preferences',
  RECIPES: '/recipes',
  RECIPE_DETAIL: '/recipes/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation',
  PROFILE: '/profile',
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTHENTICATION_FAILED: 'Authentication failed. Please check your credentials and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  PREFERENCES_SAVE_FAILED: 'Failed to save your preferences. Please try again.',
  RECOMMENDATIONS_FAILED: 'Failed to get recommendations. Please try again.',
  CART_UPDATE_FAILED: 'Failed to update your cart. Please try again.',
  CHECKOUT_FAILED: 'Checkout failed. Please try again.',
};
