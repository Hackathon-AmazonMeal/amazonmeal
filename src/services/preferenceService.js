import axios from 'axios';

// Direct external API endpoint - no proxy
const EXTERNAL_PREFERENCE_API_URL = 'https://user-ms-iimt.vercel.app/preference';

class PreferenceService {
  /**
   * Submit user preferences directly to external API
   * @param {string} email - User's email address
   * @param {Object} preferences - User preferences object
   * @returns {Promise<Object>} API response
   */
  async submitPreferences(email, preferences) {
    try {
      console.log('🚀 Submitting preferences directly to external API:', {
        email,
        preferences
      });

      const payload = {
        email: email,
        preferences: {
          dietType: preferences.dietType || 'vegetarian',
          healthGoals: preferences.healthGoals || [],
          mealType: preferences.mealType || 'dinner',
          cookingTime: preferences.cookingTime || 'medium',
          cookingMethod: preferences.cookingMethod || 'stovetop',
          prepFor: preferences.prepFor || 1,
          allergies: preferences.allergies || []
        }
      };

      console.log('📤 Sending payload to external API:', JSON.stringify(payload, null, 2));

      const response = await axios.post(EXTERNAL_PREFERENCE_API_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'AmazonMeal-Frontend/1.0.0'
        },
        timeout: 15000, // 15 second timeout for direct call
      });

      console.log('✅ Direct external API response:', response.data);
      
      return {
        success: true,
        data: response.data,
        status: response.status,
        externalApiSuccess: true
      };

    } catch (error) {
      console.error('❌ Failed to submit preferences to external API:', error);
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Unknown server error';
        
        console.error(`❌ Server error (${status}):`, message);
        throw new Error(`External API error (${status}): ${message}`);
      }
      
      if (error.request) {
        // Network error
        console.error('❌ Network error:', error.request);
        throw new Error('Unable to connect to external preference service. Please check your connection.');
      }
      
      // Other errors
      console.error('❌ Other error:', error.message);
      throw new Error(error.message || 'Failed to submit preferences to external service');
    }
  }

  /**
   * Validate preferences before submission
   * @param {Object} preferences - Preferences to validate
   * @returns {Object} Validation result
   */
  validatePreferences(preferences) {
    const errors = [];

    // Required fields validation
    if (!preferences.dietType) {
      errors.push('Diet type is required');
    }

    if (!preferences.mealType) {
      errors.push('Meal type is required');
    }

    if (!preferences.cookingTime) {
      errors.push('Cooking time is required');
    }

    if (!preferences.cookingMethod) {
      errors.push('Cooking method is required');
    }

    if (!preferences.prepFor || preferences.prepFor < 1) {
      errors.push('Prep for must be at least 1 person');
    }

    // Health goals should be an array
    if (!Array.isArray(preferences.healthGoals)) {
      errors.push('Health goals must be an array');
    }

    // Allergies should be an array
    if (!Array.isArray(preferences.allergies)) {
      errors.push('Allergies must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get user's email from authentication context
   * @param {Object} currentUser - Current authenticated user
   * @returns {string} User's email
   */
  getUserEmail(currentUser) {
    // Try different possible email fields
    return currentUser?.email || 
           currentUser?.user?.email || 
           currentUser?.profile?.email ||
           'user@example.com'; // Fallback for demo
  }
}

// Export singleton instance
export const preferenceService = new PreferenceService();
export default preferenceService;
