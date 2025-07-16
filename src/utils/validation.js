/**
 * Validation utility functions for form validation
 */

/**
 * Validates user preferences
 * @param {Object} preferences - User preferences object
 * @param {string} step - Current step being validated
 * @returns {Object} - Object containing validation errors
 */
export const validatePreferences = (preferences, step) => {
  const errors = {};

  switch (step) {
    case 'dietType':
      if (!preferences.dietType) {
        errors.dietType = 'Please select a diet type';
      }
      break;
      
    case 'healthGoals':
      if (!preferences.healthGoals || preferences.healthGoals.length === 0) {
        errors.healthGoals = 'Please select at least one health goal';
      }
      break;
      
    case 'mealType':
      if (!preferences.mealType) {
        errors.mealType = 'Please select a meal type';
      }
      break;
      
    case 'cookingTime':
      if (!preferences.cookingTime) {
        errors.cookingTime = 'Please select a cooking time';
      }
      break;
      
    case 'cookingMethod':
      if (!preferences.cookingMethod) {
        errors.cookingMethod = 'Please select a cooking method';
      }
      break;
      
    case 'numberOfPeople':
      if (!preferences.numberOfPeople || preferences.numberOfPeople < 1) {
        errors.numberOfPeople = 'Please select who you are cooking for';
      }
      break;
      
    case 'allergies':
      // Allergies are optional
      break;
      
    default:
      // Validate all fields
      if (!preferences.dietType) {
        errors.dietType = 'Please select a diet type';
      }
      
      if (!preferences.healthGoals || preferences.healthGoals.length === 0) {
        errors.healthGoals = 'Please select at least one health goal';
      }
      
      if (!preferences.mealType) {
        errors.mealType = 'Please select a meal type';
      }
      
      if (!preferences.cookingTime) {
        errors.cookingTime = 'Please select a cooking time';
      }
      
      if (!preferences.cookingMethod) {
        errors.cookingMethod = 'Please select a cooking method';
      }
      
      if (!preferences.numberOfPeople || preferences.numberOfPeople < 1) {
        errors.numberOfPeople = 'Please select who you are cooking for';
      }
      break;
  }

  return errors;
};

/**
 * Validates if an email is in correct format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a password meets minimum requirements
 * @param {string} password - Password to validate
 * @returns {Object} - Object with isValid flag and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};
