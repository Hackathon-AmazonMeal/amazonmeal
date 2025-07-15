// Application constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'recipeUser',
  PREFERENCES: 'userPreferences',
  CART: 'shoppingCart',
  RECENT_RECIPES: 'recentRecipes',
};

// Recipe Configuration
export const RECIPE_CONFIG = {
  RECOMMENDATIONS_COUNT: 15,
  VISIBLE_RECIPES_COUNT: 3,
  MAX_RECENT_RECIPES: 5,
  DEFAULT_SERVING_SIZE: 4,
};

// Nutrition Targets (daily values)
export const NUTRITION_TARGETS = {
  CALORIES: {
    'weight-loss': 1500,
    'muscle-gain': 2200,
    'maintain-weight': 1800,
    'energy-boost': 2000,
    default: 1800,
  },
  PROTEIN: {
    'muscle-gain': 150,
    'high-protein': 120,
    default: 80,
  },
  CARBS: {
    'diabetes-management': 150,
    'low-carb': 100,
    default: 225,
  },
  FIBER: {
    'digestive-health': 35,
    default: 25,
  },
  SODIUM: {
    'heart-health': 1500,
    'low-sodium': 1500,
    default: 2300,
  },
};

// Diet Type Macros (percentages)
export const DIET_MACROS = {
  balanced: { carbs: 45, protein: 25, fat: 30 },
  'high-protein': { carbs: 30, protein: 40, fat: 30 },
  'low-carb': { carbs: 20, protein: 35, fat: 45 },
  mediterranean: { carbs: 40, protein: 20, fat: 40 },
  'plant-based': { carbs: 55, protein: 15, fat: 30 },
};

// Meal Types
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

// Cuisine Types
export const CUISINE_TYPES = [
  'American',
  'Asian',
  'Italian',
  'Mediterranean',
  'Mexican',
  'Indian',
  'French',
  'Thai',
  'Chinese',
  'Japanese',
  'Greek',
  'Middle Eastern',
];

// Dietary Restrictions
export const DIETARY_RESTRICTIONS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'keto',
  'paleo',
  'low-sodium',
  'low-carb',
];

// Common Allergies
export const ALLERGIES = [
  'nuts',
  'peanuts',
  'dairy',
  'eggs',
  'soy',
  'shellfish',
  'fish',
  'wheat',
  'sesame',
];

// Health Goals
export const HEALTH_GOALS = [
  'weight-loss',
  'muscle-gain',
  'maintain-weight',
  'heart-health',
  'diabetes-management',
  'energy-boost',
  'digestive-health',
];

// Time Ranges (in minutes)
export const TIME_RANGES = {
  QUICK: { min: 0, max: 30, label: 'Quick (Under 30 min)' },
  MODERATE: { min: 30, max: 60, label: 'Moderate (30-60 min)' },
  LONG: { min: 60, max: 120, label: 'Long (1-2 hours)' },
  EXTENDED: { min: 120, max: 999, label: 'Extended (2+ hours)' },
};

// Ingredient Categories
export const INGREDIENT_CATEGORIES = {
  PRODUCE: 'produce',
  MEAT: 'meat',
  FISH: 'fish',
  DAIRY: 'dairy',
  GRAINS: 'grains',
  LEGUMES: 'legumes',
  NUTS: 'nuts',
  OILS: 'oils',
  SPICES: 'spices',
  HERBS: 'herbs',
  CONDIMENTS: 'condiments',
  CANNED: 'canned',
  FROZEN: 'frozen',
  OTHER: 'other',
};

// Recipe Tags
export const RECIPE_TAGS = [
  'high-protein',
  'high-fiber',
  'heart-healthy',
  'low-carb',
  'quick-dinner',
  'make-ahead',
  'one-pot',
  'family-friendly',
  'comfort-food',
  'seasonal',
  'holiday',
  'budget-friendly',
  'meal-prep',
  'post-workout',
  'anti-inflammatory',
  'probiotic',
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PREFERENCES_SAVED: 'Your preferences have been saved successfully!',
  RECIPE_ADDED_TO_CART: 'Recipe ingredients added to cart!',
  ORDER_PLACED: 'Your order has been placed successfully!',
  PROFILE_UPDATED: 'Your profile has been updated!',
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints (matching Material-UI)
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536,
};

// Color Palette Extensions
export const COLORS = {
  SUCCESS_LIGHT: '#E8F5E8',
  WARNING_LIGHT: '#FFF3E0',
  ERROR_LIGHT: '#FFEBEE',
  INFO_LIGHT: '#E3F2FD',
};

// Export all constants as named exports and create a default export object
const constants = {
  API_CONFIG,
  STORAGE_KEYS,
  RECIPE_CONFIG,
  NUTRITION_TARGETS,
  DIET_MACROS,
  MEAL_TYPES,
  DIFFICULTY_LEVELS,
  CUISINE_TYPES,
  DIETARY_RESTRICTIONS,
  ALLERGIES,
  HEALTH_GOALS,
  TIME_RANGES,
  INGREDIENT_CATEGORIES,
  RECIPE_TAGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATION_DURATIONS,
  BREAKPOINTS,
  COLORS,
};

export default constants;
