// AuthContext.js - Authentication context for mock authentication
import React, { createContext, useState, useContext, useEffect } from 'react';

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
  }
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Mock sign in - in real app would call API
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      // Find mock user by email (for demo)
      const user = MOCK_USERS.find(u => u.email === email);
      if (user) {
        setCurrentUser(user);
        // Generate mock JWT token
        const mockToken = `mock-jwt-${Date.now()}`;
        setToken(mockToken);
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      throw new Error('Login failed');
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
