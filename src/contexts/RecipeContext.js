import React, { createContext, useContext, useReducer } from 'react';
import { recipeService } from '../services/recipeService';
import { externalRecipeService } from '../services/externalRecipeService';

const RecipeContext = createContext();

// Action types
const RECIPE_ACTIONS = {
  SET_RECIPES: 'SET_RECIPES',
  SET_CURRENT_RECIPE_INDEX: 'SET_CURRENT_RECIPE_INDEX',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
};

// Initial state
const initialState = {
  recipes: [],
  currentRecipeIndex: 0,
  recommendations: [],
  isLoading: false,
  error: null,
};

// Reducer function
function recipeReducer(state, action) {
  switch (action.type) {
    case RECIPE_ACTIONS.SET_RECIPES:
      console.log('Setting recipes:', action.payload);
      return {
        ...state,
        recipes: action.payload,
        currentRecipeIndex: 0,
        isLoading: false,
        error: null,
      };
    
    case RECIPE_ACTIONS.SET_CURRENT_RECIPE_INDEX:
      return {
        ...state,
        currentRecipeIndex: action.payload,
      };
    
    case RECIPE_ACTIONS.SET_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: action.payload,
        isLoading: false,
        error: null,
      };
    
    case RECIPE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case RECIPE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case RECIPE_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
}

// Provider component
export function RecipeProvider({ children }) {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  // Action creators
  const actions = {
    setRecipes: (recipes) => {
      dispatch({ type: RECIPE_ACTIONS.SET_RECIPES, payload: recipes });
    },

    setCurrentRecipeIndex: (index) => {
      dispatch({ type: RECIPE_ACTIONS.SET_CURRENT_RECIPE_INDEX, payload: index });
    },

    setLoading: (loading) => {
      dispatch({ type: RECIPE_ACTIONS.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: RECIPE_ACTIONS.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: RECIPE_ACTIONS.CLEAR_ERROR });
    },

    // Get personalized recipe recommendations from external API
    getRecommendations: async (preferences) => {
      try {
        dispatch({ type: RECIPE_ACTIONS.SET_LOADING, payload: true });
        
        console.log('Getting recipes from external API with preferences:', preferences);
        
        // Get recipes from external API service
        const recipes = await externalRecipeService.generateRecipes(preferences);
        
        console.log('External API recipes received:', recipes);
        
        dispatch({ type: RECIPE_ACTIONS.SET_RECOMMENDATIONS, payload: recipes });
        dispatch({ type: RECIPE_ACTIONS.SET_RECIPES, payload: recipes });
        
        return recipes;
      } catch (error) {
        console.error('Error getting external API recipes:', error);
        dispatch({ type: RECIPE_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    // Load all recipes
    loadAllRecipes: async () => {
      try {
        dispatch({ type: RECIPE_ACTIONS.SET_LOADING, payload: true });
        
        const recipes = await recipeService.getAllRecipes();
        dispatch({ type: RECIPE_ACTIONS.SET_RECIPES, payload: recipes });
        
        return recipes;
      } catch (error) {
        dispatch({ type: RECIPE_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    // Get recipe by ID from loaded recipes (synchronous)
    findRecipeById: (id) => {
      return state.recipes.find(recipe => recipe.id === id) || null;
    },

    // Get recipe by ID
    getRecipeById: async (id) => {
      try {
        const recipe = await recipeService.getRecipeById(id);
        return recipe;
      } catch (error) {
        dispatch({ type: RECIPE_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    // Navigation helpers
    nextRecipe: () => {
      const nextIndex = (state.currentRecipeIndex + 1) % Math.max(state.recipes.length, 1);
      dispatch({ type: RECIPE_ACTIONS.SET_CURRENT_RECIPE_INDEX, payload: nextIndex });
    },

    previousRecipe: () => {
      const prevIndex = state.currentRecipeIndex === 0 
        ? Math.max(state.recipes.length - 1, 0)
        : state.currentRecipeIndex - 1;
      dispatch({ type: RECIPE_ACTIONS.SET_CURRENT_RECIPE_INDEX, payload: prevIndex });
    },

    // Get current recipe
    getCurrentRecipe: () => {
      const recipe = state.recipes[state.currentRecipeIndex];
      return (recipe && recipe.id) ? recipe : null;
    },

    // Get visible recipes (3 at a time)
    getVisibleRecipes: () => {
      if (state.recipes.length === 0) return [];
      
      const recipes = [];
      for (let i = 0; i < 3; i++) {
        const index = (state.currentRecipeIndex + i) % state.recipes.length;
        const recipe = state.recipes[index];
        if (recipe && recipe.id) {
          recipes.push(recipe);
        }
      }
      return recipes;
    },

    // Check if there are more recipes to show
    hasMoreRecipes: () => {
      return state.recipes.length > 3;
    },

    // Get recipe count
    getRecipeCount: () => {
      return state.recipes.length;
    },

    // Filter recipes by dietary preferences
    filterRecipesByPreferences: (recipes, preferences) => {
      return recipes.filter(recipe => {
        // Check dietary restrictions
        if (preferences.dietaryRestrictions) {
          for (const restriction of preferences.dietaryRestrictions) {
            if (restriction === 'vegetarian' && !recipe.dietaryInfo.vegetarian) return false;
            if (restriction === 'vegan' && !recipe.dietaryInfo.vegan) return false;
            if (restriction === 'gluten-free' && !recipe.dietaryInfo.glutenFree) return false;
            if (restriction === 'dairy-free' && !recipe.dietaryInfo.dairyFree) return false;
            if (restriction === 'keto' && !recipe.dietaryInfo.keto) return false;
            if (restriction === 'paleo' && !recipe.dietaryInfo.paleo) return false;
          }
        }

        // Check allergies
        if (preferences.allergies) {
          for (const allergy of preferences.allergies) {
            const hasAllergen = recipe.ingredients.some(ingredient => {
              const ingredientName = ingredient.name.toLowerCase();
              switch (allergy) {
                case 'nuts':
                  return ingredientName.includes('nut') || ingredientName.includes('almond') || 
                         ingredientName.includes('walnut') || ingredientName.includes('cashew');
                case 'dairy':
                  return ingredientName.includes('milk') || ingredientName.includes('cheese') || 
                         ingredientName.includes('yogurt') || ingredientName.includes('butter');
                case 'eggs':
                  return ingredientName.includes('egg');
                case 'soy':
                  return ingredientName.includes('soy');
                case 'wheat':
                  return ingredientName.includes('wheat') || ingredientName.includes('flour');
                default:
                  return ingredientName.includes(allergy);
              }
            });
            if (hasAllergen) return false;
          }
        }

        return true;
      });
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}

// Custom hook to use the RecipeContext
export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}

export { RECIPE_ACTIONS };
