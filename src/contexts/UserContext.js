import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UserContext = createContext();

// Mock users for demo - based on design specifications
const MOCK_USERS = [
  {
    userId: 'user-1',
    username: 'healthyeater',
    email: 'homeayush79@gmail.com',
    preferences: {
      dietType: 'vegetarian',
      healthGoals: [],
      mealType: 'dinner',
      cookingTime: 'medium',
      cookingMethod: 'stovetop',
      numberOfPeople: 1,
      allergies: [],
    },
    orderHistory: []
  }
];

// Action types
const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  ADD_ORDER_HISTORY: 'ADD_ORDER_HISTORY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SIGN_OUT: 'SIGN_OUT',
};

// Initial state
const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

// Reducer function
function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
        error: null,
      };
    
    case USER_ACTIONS.UPDATE_PREFERENCES:
      console.log('Before update:', state.currentUser?.preferences);
      console.log('Updating with:', action.payload);
      const updatedState = {
        ...state,
        currentUser: state.currentUser ? {
          ...state.currentUser,
          preferences: {
            ...state.currentUser.preferences,
            ...action.payload
          },
        } : null,
      };
      console.log('After update:', updatedState.currentUser?.preferences);
      return updatedState;
    
    case USER_ACTIONS.ADD_ORDER_HISTORY:
      return {
        ...state,
        currentUser: state.currentUser ? {
          ...state.currentUser,
          orderHistory: [
            action.payload,
            ...(state.currentUser.orderHistory || []),
          ].slice(0, 5), // Keep only last 5 orders
        } : null,
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
      
    case USER_ACTIONS.SIGN_OUT:
      return {
        ...initialState,
      };
    
    default:
      return state;
  }
}

// Helper function to compare objects deeply
function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Provider component
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [storedUser, setStoredUser] = useLocalStorage('currentUser', null);

  // Flag to prevent initial sync from triggering updates
  const isInitialSync = React.useRef(true);
  
  // Flag to track if we're updating from localStorage
  const isUpdatingFromStorage = React.useRef(false);

  // Load user from localStorage on mount - only run once
  useEffect(() => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
    
    if (storedUser) {
      try {
        const parsedUser = typeof storedUser === 'string' ? JSON.parse(storedUser) : storedUser;
        dispatch({ type: USER_ACTIONS.SET_USER, payload: parsedUser });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    // Mark initial sync as complete
    isInitialSync.current = false;
  }, []); // Empty dependency array means this only runs once on mount

  // Persist user changes to localStorage, but only when state.currentUser changes
  // and is different from what's already in localStorage
  useEffect(() => {
    // Skip during initial sync or when updating from storage
    if (isInitialSync.current || isUpdatingFromStorage.current) {
      return;
    }
    
    // Only update localStorage if the user has changed and is different from stored value
    if (!isEqual(state.currentUser, storedUser)) {
      setStoredUser(state.currentUser);
    }
  }, [state.currentUser, setStoredUser, storedUser]);

  // Authentication actions
  const signIn = async (email, password) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
    try {
      // Find mock user by email (for demo)
      const user = MOCK_USERS.find(u => u.email === email);
      if (user) {
        // Fetch user preferences from the API
        try {
          const response = await fetch(`https://user-ms-iimt.vercel.app/preference/${email}`);
          if (response.ok) {
            const apiResponse = await response.json();
            console.log('API Response in signIn:', apiResponse);
            
            // Extract preferences from the correct structure
            if (apiResponse && apiResponse.success && apiResponse.data && apiResponse.data.preferences) {
              // Use the API response preferences
              const updatedUser = {
                ...user,
                preferences: apiResponse.data.preferences
              };
              dispatch({ type: USER_ACTIONS.SET_USER, payload: updatedUser });
              return updatedUser;
            } else {
              console.warn('API response does not have the expected structure:', apiResponse);
              dispatch({ type: USER_ACTIONS.SET_USER, payload: user });
              return user;
            }
          } else {
            console.warn('Failed to fetch user preferences from API');
            dispatch({ type: USER_ACTIONS.SET_USER, payload: user });
            return user;
          }
        } catch (apiError) {
          console.error('Error fetching user preferences:', apiError);
          dispatch({ type: USER_ACTIONS.SET_USER, payload: user });
          return user;
        }
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const signUp = async (userData) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
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
        },
        orderHistory: []
      };

      dispatch({ type: USER_ACTIONS.SET_USER, payload: newUser });
      return newUser;
    } catch (error) {
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const signOut = async () => {
    dispatch({ type: USER_ACTIONS.SIGN_OUT });
    localStorage.removeItem('currentUser');
  };

  // User preference actions - wrapped in useCallback to prevent unnecessary re-renders
  const updatePreferences = useCallback((preferences) => {
    console.log('Updating preferences:', preferences);
    dispatch({ type: USER_ACTIONS.UPDATE_PREFERENCES, payload: preferences });
  } ,[]);

  // Update a specific preference field
  const updatePreferenceField = (field, value) => {
    dispatch({ 
      type: USER_ACTIONS.UPDATE_PREFERENCES, 
      payload: { [field]: value } 
    });
  };

  // Reset preferences to defaults
  const resetPreferences = () => {
    const defaultPreferences = {
      dietType: 'vegetarian',
      healthGoals: [],
      mealType: 'dinner',
      cookingTime: 'medium',
      cookingMethod: 'stovetop',
      numberOfPeople: 1,
      allergies: [],
    };
    dispatch({ type: USER_ACTIONS.UPDATE_PREFERENCES, payload: defaultPreferences });
  };

  const addOrderToHistory = useCallback((order) => {
    const orderWithTimestamp = {
      ...order,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    };
    dispatch({ type: USER_ACTIONS.ADD_ORDER_HISTORY, payload: orderWithTimestamp });
  },[]);

  // Error handling actions
  const setError = useCallback((error) => {
    dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: loading });
  }, []);

  // Helper functions
  const isNewUser = useCallback(() => {
    return !state.currentUser || !state.currentUser.preferences;
  }, [state.currentUser]);

  const getDietaryRestrictions = useCallback(() => {
    return state.currentUser?.preferences?.dietaryRestrictions || [];
  }, [state.currentUser]);

  const getAllergies = useCallback(() => {
    return state.currentUser?.preferences?.allergies || [];
  }, [state.currentUser]);

  const getHealthGoals = useCallback(() => {
    return state.currentUser?.preferences?.healthGoals || [];
  }, [state.currentUser]);

  const getDietType = useCallback(() => {
    return state.currentUser?.preferences?.dietType || 'vegetarian';
  }, [state.currentUser]);

  const value = {
    // State
    currentUser: state.currentUser,
    isLoading: state.isLoading,
    error: state.error,
    
    // Authentication
    signIn,
    signUp,
    signOut,
    logout: signOut, // Alias for compatibility
    
    // User preferences
    updatePreferences,
    updatePreferenceField,
    resetPreferences,
    addOrderToHistory,
    
    // Helper functions
    isNewUser,
    getAllergies,
    getHealthGoals,
    getDietType,
    
    // Preference getters
    getPreferences: () => state.currentUser?.preferences || {},
    getPreference: (key) => state.currentUser?.preferences?.[key],
    
    // Error handling
    setError,
    clearError,
    setLoading,
    
    // Demo users for login page
    getDemoUsers: () => MOCK_USERS.map(u => ({ email: u.email, username: u.username }))
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