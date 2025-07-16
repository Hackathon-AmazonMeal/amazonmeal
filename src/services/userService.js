import { apiClient, API_ENDPOINTS, USE_MOCK_DATA, createApiResponse } from './api';

class UserService {
  // External preference API configuration
  static EXTERNAL_PREFERENCE_API = 'https://user-ms-iimt.vercel.app/preference';

  // Get user preferences from external API by email
  async getUserPreferencesByEmail(email) {
    try {
      const response = await fetch(`${UserService.EXTERNAL_PREFERENCE_API}/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // User not found in external system
          return createApiResponse(null, true, 'No preferences found for this email');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform external API response to match internal preference structure
      const transformedPreferences = this.transformExternalPreferences(data);
      
      return createApiResponse(transformedPreferences, true, 'Preferences loaded successfully');
    } catch (error) {
      console.error('Failed to get user preferences from external API:', error);
      // Return null instead of throwing to allow fallback to local preferences
      return createApiResponse(null, false, `Failed to load external preferences: ${error.message}`);
    }
  }

  // Transform external API response to internal preference format
  transformExternalPreferences(externalData) {
    if (!externalData) return null;

    // Handle the actual API response structure: { success: true, data: { _id, email, preferences: {...} } }
    const preferences = externalData.data?.preferences || externalData.preferences || externalData;
    
    if (!preferences) return null;

    // Map external preference structure to internal structure based on actual API response
    return {
      // Map external fields to internal fields
      dietType: preferences.dietType || 'balanced',
      healthGoals: preferences.healthGoals || [],
      allergies: preferences.allergies || [],
      
      // Map external fields to internal equivalents
      dietaryRestrictions: this.mapDietTypeToRestrictions(preferences.dietType) || [],
      cuisinePreferences: preferences.cuisinePreferences || [],
      
      // Map cooking preferences
      cookingSkillLevel: this.mapCookingTimeToSkillLevel(preferences.cookingTime) || 'beginner',
      
      // Map time preferences
      timePreferences: {
        maxPrepTime: this.mapCookingTimeToMinutes(preferences.cookingTime, 'prep') || 30,
        maxCookTime: this.mapCookingTimeToMinutes(preferences.cookingTime, 'cook') || 45,
        cookingMethod: preferences.cookingMethod || 'any',
      },
      
      // Additional preferences
      mealType: preferences.mealType || 'any',
      prepFor: preferences.prepFor || 1,
      
      // Keep original data for reference
      _originalData: preferences,
      _source: 'external_api',
      _loadedAt: new Date().toISOString(),
    };
  }

  // Helper function to map diet type to dietary restrictions
  mapDietTypeToRestrictions(dietType) {
    const dietTypeMap = {
      'vegetarian': ['vegetarian'],
      'eggetarian': ['vegetarian'], // Handles the "eggetarian" from API
      'vegan': ['vegan', 'vegetarian'],
      'keto': ['low-carb', 'high-fat'],
      'paleo': ['paleo', 'gluten-free'],
      'mediterranean': ['mediterranean'],
      'low-carb': ['low-carb'],
      'gluten-free': ['gluten-free'],
    };
    
    return dietTypeMap[dietType?.toLowerCase()] || [];
  }

  // Helper function to map cooking time to skill level
  mapCookingTimeToSkillLevel(cookingTime) {
    const timeToSkillMap = {
      'quick': 'beginner',
      'medium': 'intermediate', 
      'long': 'advanced',
      'any': 'intermediate',
    };
    
    return timeToSkillMap[cookingTime?.toLowerCase()] || 'beginner';
  }

  // Helper function to map cooking time to actual minutes
  mapCookingTimeToMinutes(cookingTime, type = 'prep') {
    const timeMap = {
      'quick': { prep: 15, cook: 20 },
      'medium': { prep: 30, cook: 45 },
      'long': { prep: 45, cook: 90 },
      'any': { prep: 30, cook: 45 },
    };
    
    const timePrefs = timeMap[cookingTime?.toLowerCase()] || timeMap['medium'];
    return timePrefs[type];
  }

  // Enhanced method to get preferences with external API fallback
  async getUserPreferencesWithFallback(email, userId = null) {
    // First, try to get preferences from external API using email
    if (email) {
      try {
        const externalResponse = await this.getUserPreferencesByEmail(email);
        if (externalResponse.success && externalResponse.data) {
          console.log('Loaded preferences from external API for email:', email);
          return externalResponse;
        }
      } catch (error) {
        console.warn('External API failed, falling back to local preferences:', error);
      }
    }

    // Fallback to existing local preference logic
    if (userId) {
      return await this.getUserPreferences(userId);
    }

    // No preferences found
    return createApiResponse(null, true, 'No preferences found');
  }

  // Create or update user preferences
  async saveUserPreferences(preferences) {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return createApiResponse(preferences, true, 'Preferences saved successfully');
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.USER_PREFERENCES, preferences);
      return response;
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      throw new Error('Failed to save preferences. Please try again.');
    }
  }

  // Get user preferences (original method for backward compatibility)
  async getUserPreferences(userId) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      // Return null if no preferences found
      return createApiResponse(null, true, 'No preferences found');
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.USER_PREFERENCES}/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      throw new Error('Failed to load preferences. Please try again.');
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return createApiResponse(profileData, true, 'Profile updated successfully');
    }

    try {
      const response = await apiClient.put(`${API_ENDPOINTS.USERS}/${userId}`, profileData);
      return response;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw new Error('Failed to update profile. Please try again.');
    }
  }

  // Get user by ID
  async getUserById(userId) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      // Mock user data
      const mockUser = {
        id: userId,
        preferences: null,
        orderHistory: [],
        createdAt: new Date().toISOString(),
      };
      return createApiResponse(mockUser, true, 'User found');
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.USERS}/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw new Error('Failed to load user data. Please try again.');
    }
  }

  // Create new user
  async createUser(userData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      };
      return createApiResponse(newUser, true, 'User created successfully');
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS, userData);
      return response;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('Failed to create user. Please try again.');
    }
  }

  // Enhanced user creation with external preference lookup
  async createUserWithEmail(email, additionalData = {}) {
    try {
      // First, try to get existing preferences from external API
      const preferencesResponse = await this.getUserPreferencesByEmail(email);
      
      const userData = {
        email,
        ...additionalData,
        preferences: preferencesResponse.data || null,
        createdAt: new Date().toISOString(),
      };

      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newUser = {
          id: Date.now().toString(),
          ...userData,
        };
        return createApiResponse(newUser, true, 'User created successfully with external preferences');
      }

      const response = await apiClient.post(API_ENDPOINTS.USERS, userData);
      return response;
    } catch (error) {
      console.error('Failed to create user with email:', error);
      throw new Error('Failed to create user. Please try again.');
    }
  }

  // Login method that fetches preferences from external API
  async loginWithEmail(email) {
    try {
      // Get preferences from external API
      const preferencesResponse = await this.getUserPreferencesByEmail(email);
      
      // Create or get user data
      const userData = {
        id: Date.now().toString(), // In real app, this would come from authentication
        email,
        preferences: preferencesResponse.data,
        orderHistory: [],
        createdAt: new Date().toISOString(),
      };

      return createApiResponse(userData, true, 'Login successful');
    } catch (error) {
      console.error('Failed to login with email:', error);
      throw new Error('Failed to login. Please try again.');
    }
  }
}

// Create and export service instance
export const userService = new UserService();
export default userService;
