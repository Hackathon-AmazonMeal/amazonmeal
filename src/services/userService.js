import { apiClient, API_ENDPOINTS, USE_MOCK_DATA, createApiResponse } from './api';

class UserService {
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

  // Get user preferences
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
}

// Create and export service instance
export const userService = new UserService();
export default userService;
