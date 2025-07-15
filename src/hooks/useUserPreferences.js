import { useUser } from '../contexts/UserContext';

export function useUserPreferences() {
  const userContext = useUser();

  return {
    user: userContext.user,
    isLoading: userContext.isLoading,
    error: userContext.error,
    
    // User management
    createUser: userContext.createUser,
    updatePreferences: userContext.updatePreferences,
    addOrderToHistory: userContext.addOrderToHistory,
    
    // User state checks
    isNewUser: userContext.isNewUser,
    
    // Preference getters
    getDietaryRestrictions: userContext.getDietaryRestrictions,
    getAllergies: userContext.getAllergies,
    getHealthGoals: userContext.getHealthGoals,
    getDietType: userContext.getDietType,
    
    // Error handling
    setError: userContext.setError,
    clearError: userContext.clearError,
    setLoading: userContext.setLoading,
  };
}
