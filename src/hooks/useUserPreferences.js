import { useUser } from '../contexts/UserContext';

export function useUserPreferences() {
  const userContext = useUser();

  return {
    // User data
    user: userContext.currentUser,
    preferences: userContext.currentUser?.preferences || {},
    isLoading: userContext.isLoading,
    error: userContext.error,
    
    // User management
    updatePreferences: userContext.updatePreferences,
    updatePreferenceField: userContext.updatePreferenceField,
    resetPreferences: userContext.resetPreferences,
    addOrderToHistory: userContext.addOrderToHistory,
    
    // User state checks
    isNewUser: userContext.isNewUser,
    
    // Preference getters
    getPreferences: userContext.getPreferences,
    getPreference: userContext.getPreference,
    getAllergies: userContext.getAllergies,
    getHealthGoals: userContext.getHealthGoals,
    getDietType: userContext.getDietType,
    
    // Convenience getters for common preferences
    getDietType: () => userContext.currentUser?.preferences?.dietType || 'vegetarian',
    getMealType: () => userContext.currentUser?.preferences?.mealType || 'dinner',
    getCookingTime: () => userContext.currentUser?.preferences?.cookingTime || 'medium',
    getCookingMethod: () => userContext.currentUser?.preferences?.cookingMethod || 'stovetop',
    getNumberOfPeople: () => userContext.currentUser?.preferences?.numberOfPeople || 1,
    getAllergies: () => userContext.currentUser?.preferences?.allergies || [],
    getHealthGoals: () => userContext.currentUser?.preferences?.healthGoals || [],
    
    // Error handling
    setError: userContext.setError,
    clearError: userContext.clearError,
    setLoading: userContext.setLoading,
  };
}
