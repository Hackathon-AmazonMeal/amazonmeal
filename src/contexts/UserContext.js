import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { userService } from '../services/userService';

const UserContext = createContext();

// Action types
const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  ADD_ORDER_HISTORY: 'ADD_ORDER_HISTORY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOGIN_EMAIL: 'SET_LOGIN_EMAIL',
};

// Initial state
const initialState = {
  user: null,
  isLoading: false,
  error: null,
  loginEmail: null,
};

// Reducer function
function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    
    case USER_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preferences: action.payload,
        },
      };
    
    case USER_ACTIONS.ADD_ORDER_HISTORY:
      return {
        ...state,
        user: {
          ...state.user,
          orderHistory: [
            action.payload,
            ...(state.user?.orderHistory || []),
          ].slice(0, 5), // Keep only last 5 orders
        },
      };
    
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case USER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case USER_ACTIONS.SET_LOGIN_EMAIL:
      return {
        ...state,
        loginEmail: action.payload,
      };
    
    default:
      return state;
  }
}

// Provider component
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [storedUser, setStoredUser] = useLocalStorage('recipeUser', null);

  // Load user from localStorage on mount
  useEffect(() => {
    if (storedUser) {
      dispatch({ type: USER_ACTIONS.SET_USER, payload: storedUser });
    }
  }, [storedUser]);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (state.user) {
      setStoredUser(state.user);
    }
  }, [state.user, setStoredUser]);

  // Action creators
  const actions = {
    setUser: (user) => {
      dispatch({ type: USER_ACTIONS.SET_USER, payload: user });
    },

    updatePreferences: (preferences) => {
      dispatch({ type: USER_ACTIONS.UPDATE_PREFERENCES, payload: preferences });
    },

    addOrderToHistory: (order) => {
      const orderWithTimestamp = {
        ...order,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      };
      dispatch({ type: USER_ACTIONS.ADD_ORDER_HISTORY, payload: orderWithTimestamp });
    },

    setLoading: (loading) => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
    },

    setLoginEmail: (email) => {
      dispatch({ type: USER_ACTIONS.SET_LOGIN_EMAIL, payload: email });
    },

    // Enhanced login with external preference API
    loginWithEmail: async (email) => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: USER_ACTIONS.CLEAR_ERROR });

      try {
        const response = await userService.loginWithEmail(email);
        
        if (response.success) {
          const userData = {
            ...response.data,
            email,
          };
          
          dispatch({ type: USER_ACTIONS.SET_USER, payload: userData });
          dispatch({ type: USER_ACTIONS.SET_LOGIN_EMAIL, payload: email });
          
          return { success: true, user: userData, hasExistingPreferences: !!response.data.preferences };
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login failed:', error);
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      } finally {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Load preferences from external API
    loadExternalPreferences: async (email) => {
      if (!email) return { success: false, error: 'Email is required' };

      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: USER_ACTIONS.CLEAR_ERROR });

      try {
        const response = await userService.getUserPreferencesByEmail(email);
        
        if (response.success && response.data) {
          dispatch({ type: USER_ACTIONS.UPDATE_PREFERENCES, payload: response.data });
          return { success: true, preferences: response.data };
        } else {
          return { success: false, error: 'No preferences found for this email' };
        }
      } catch (error) {
        console.error('Failed to load external preferences:', error);
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      } finally {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Create new user with preferences
    createUser: (preferences, email = null) => {
      const newUser = {
        id: Date.now().toString(),
        email: email || state.loginEmail,
        preferences,
        orderHistory: [],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: USER_ACTIONS.SET_USER, payload: newUser });
      return newUser;
    },

    // Check if user is new (no preferences set)
    isNewUser: () => {
      return !state.user || !state.user.preferences;
    },

    // Get user's dietary restrictions
    getDietaryRestrictions: () => {
      return state.user?.preferences?.dietaryRestrictions || [];
    },

    // Get user's allergies
    getAllergies: () => {
      return state.user?.preferences?.allergies || [];
    },

    // Get user's health goals
    getHealthGoals: () => {
      return state.user?.preferences?.healthGoals || [];
    },

    // Get user's preferred diet type
    getDietType: () => {
      return state.user?.preferences?.dietType || 'balanced';
    },

    // Get user's email
    getUserEmail: () => {
      return state.user?.email || state.loginEmail;
    },

    // Check if user has existing preferences from external API
    hasExternalPreferences: () => {
      return state.user?.preferences && Object.keys(state.user.preferences).length > 0;
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export { USER_ACTIONS };
