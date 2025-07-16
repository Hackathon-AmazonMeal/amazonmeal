// AuthContext.js - Authentication context for mock authentication
import React, { createContext, useState, useContext, useEffect } from 'react';
import { userService } from '../services/userService';

// Mock users for demo - based on design specifications
const MOCK_USERS = [
  {
    userId: 'user-1',
    username: 'healthyeater',
    email: 'demo@example.com',
    preferences: {
      dietaryRestrictions: ['VEGETARIAN'],
      allergies: ['PEANUTS'],
      dislikedIngredients: ['cilantro', 'olives'],
      cookingTime: 'QUICK',
      cuisinePreferences: ['ITALIAN', 'MEXICAN', 'ASIAN'],
      skillLevel: 'BEGINNER'
    }
  },
  {
    userId: 'user-2',
    username: 'familychef',
    email: 'family@example.com',
    preferences: {
      dietaryRestrictions: [],
      allergies: ['SHELLFISH'],
      dislikedIngredients: ['mushrooms'],
      cookingTime: 'MEDIUM',
      cuisinePreferences: ['AMERICAN', 'ITALIAN', 'MEXICAN'],
      skillLevel: 'INTERMEDIATE'
    }
  },
  {
    userId: 'user-3',
    username: 'fitnessfan',
    email: 'fitness@example.com',
    preferences: {
      dietaryRestrictions: ['GLUTEN_FREE', 'LOW_CARB'],
      allergies: [],
      dislikedIngredients: ['processed_foods'],
      cookingTime: 'ANY',
      cuisinePreferences: ['MEDITERRANEAN', 'ASIAN', 'AMERICAN'],
      skillLevel: 'ADVANCED'
    }
  }
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Enhanced sign in with external preference loading
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      // Find mock user by email (for demo)
      const mockUser = MOCK_USERS.find(u => u.email === email);
      if (!mockUser) {
        throw new Error('Invalid credentials');
      }

      // Load preferences from external API
      console.log('Loading preferences from external API for email:', email);
      const preferencesResponse = await userService.getUserPreferencesByEmail(email);
      
      let userWithPreferences = { ...mockUser };
      
      if (preferencesResponse.success && preferencesResponse.data) {
        // Use external preferences if available
        console.log('External preferences loaded successfully:', preferencesResponse.data);
        userWithPreferences.preferences = preferencesResponse.data;
        userWithPreferences.preferencesSource = 'external_api';
      } else {
        // Keep mock preferences as fallback
        console.log('Using fallback mock preferences for user:', email);
        userWithPreferences.preferencesSource = 'mock_data';
      }

      setCurrentUser(userWithPreferences);
      
      // Generate mock JWT token
      const mockToken = `mock-jwt-${Date.now()}`;
      setToken(mockToken);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(userWithPreferences));
      
      return userWithPreferences;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced demo login with external preference loading
  const signInWithDemo = async (email) => {
    setLoading(true);
    try {
      // Find mock user by email (for demo)
      const mockUser = MOCK_USERS.find(u => u.email === email);
      if (!mockUser) {
        throw new Error('Demo user not found');
      }

      // Load preferences from external API
      console.log('Loading preferences from external API for demo user:', email);
      const preferencesResponse = await userService.getUserPreferencesByEmail(email);
      
      let userWithPreferences = { ...mockUser };
      
      if (preferencesResponse.success && preferencesResponse.data) {
        // Use external preferences if available
        console.log('External preferences loaded successfully for demo user:', preferencesResponse.data);
        userWithPreferences.preferences = preferencesResponse.data;
        userWithPreferences.preferencesSource = 'external_api';
      } else {
        // Keep mock preferences as fallback
        console.log('Using fallback mock preferences for demo user:', email);
        userWithPreferences.preferencesSource = 'mock_data';
      }

      setCurrentUser(userWithPreferences);
      
      // Generate mock JWT token
      const mockToken = `mock-jwt-${Date.now()}`;
      setToken(mockToken);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(userWithPreferences));
      
      return userWithPreferences;
    } catch (error) {
      console.error('Demo login failed:', error);
      throw new Error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  // Mock sign up - creates a new user profile
  const signUp = async (userData) => {
    setLoading(true);
    try {
      const newUser = {
        userId: `user-${Date.now()}`,
        username: userData.username,
        email: userData.email,
        preferences: userData.preferences || {
          dietaryRestrictions: [],
          allergies: [],
          dislikedIngredients: [],
          cookingTime: 'MEDIUM',
          cuisinePreferences: [],
          skillLevel: 'BEGINNER'
        }
      };

      setCurrentUser(newUser);
      const mockToken = `mock-jwt-${Date.now()}`;
      setToken(mockToken);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  const updateUserPreferences = (preferences) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        preferences: { ...currentUser.preferences, ...preferences }
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  useEffect(() => {
    // Check for saved user on load
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    token,
    loading,
    signIn,
    signInWithDemo,
    signUp,
    signOut,
    logout: signOut, // Alias for compatibility
    updateUserPreferences,
    // Helper function to get demo users for login page
    getDemoUsers: () => MOCK_USERS.map(u => ({ email: u.email, username: u.username }))
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
