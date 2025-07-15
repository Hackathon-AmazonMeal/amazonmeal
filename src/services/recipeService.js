import { apiClient, API_ENDPOINTS, USE_MOCK_DATA, createApiResponse } from './api';

// Mock data imports
import breakfastRecipes from '../data/recipes/breakfast.json';
import lunchRecipes from '../data/recipes/lunch.json';
import dinnerRecipes from '../data/recipes/dinner.json';

class RecipeService {
  constructor() {
    this.mockRecipes = [
      ...breakfastRecipes,
      ...lunchRecipes,
      ...dinnerRecipes,
    ];
  }

  // Get all recipes
  async getAllRecipes() {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return createApiResponse(this.mockRecipes);
    }

    try {
      const response = await apiClient.get(API_ENDPOINTS.RECIPES);
      return response;
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      throw new Error('Failed to load recipes. Please try again.');
    }
  }

  // Get recipe by ID
  async getRecipeById(id) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const recipe = this.mockRecipes.find(r => r.id === id);
      
      if (!recipe) {
        throw new Error(`Recipe with ID ${id} not found`);
      }
      
      return createApiResponse(recipe);
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.RECIPES}/${id}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch recipe ${id}:`, error);
      throw new Error('Failed to load recipe. Please try again.');
    }
  }

  // Search recipes
  async searchRecipes(query, filters = {}) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredRecipes = this.mockRecipes;

      // Apply text search
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.name.toLowerCase().includes(searchTerm) ||
          recipe.description.toLowerCase().includes(searchTerm) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          recipe.cuisine.toLowerCase().includes(searchTerm)
        );
      }

      // Apply filters
      if (filters.mealType) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.mealType === filters.mealType
        );
      }

      if (filters.cuisine) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.cuisine.toLowerCase() === filters.cuisine.toLowerCase()
        );
      }

      if (filters.maxPrepTime) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.prepTime + recipe.cookTime <= filters.maxPrepTime
        );
      }

      if (filters.difficulty) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
        );
      }

      // Apply dietary filters
      if (filters.vegetarian) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.dietaryInfo.vegetarian);
      }

      if (filters.vegan) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.dietaryInfo.vegan);
      }

      if (filters.glutenFree) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.dietaryInfo.glutenFree);
      }

      if (filters.dairyFree) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.dietaryInfo.dairyFree);
      }

      return createApiResponse(filteredRecipes);
    }

    try {
      const response = await apiClient.get(API_ENDPOINTS.RECIPE_SEARCH, { 
        q: query, 
        ...filters 
      });
      return response;
    } catch (error) {
      console.error('Failed to search recipes:', error);
      throw new Error('Failed to search recipes. Please try again.');
    }
  }

  // Get recipes by meal type
  async getRecipesByMealType(mealType) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filteredRecipes = this.mockRecipes.filter(recipe => 
        recipe.mealType === mealType
      );
      
      return createApiResponse(filteredRecipes);
    }

    return this.searchRecipes('', { mealType });
  }

  // Get recipes by dietary preferences
  async getRecipesByDietaryPreferences(preferences) {
    const filters = {};

    // Convert preferences to filters
    if (preferences.dietaryRestrictions) {
      preferences.dietaryRestrictions.forEach(restriction => {
        switch (restriction) {
          case 'vegetarian':
            filters.vegetarian = true;
            break;
          case 'vegan':
            filters.vegan = true;
            break;
          case 'gluten-free':
            filters.glutenFree = true;
            break;
          case 'dairy-free':
            filters.dairyFree = true;
            break;
          default:
            break;
        }
      });
    }

    return this.searchRecipes('', filters);
  }

  // Get random recipes
  async getRandomRecipes(count = 5) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const shuffled = [...this.mockRecipes].sort(() => 0.5 - Math.random());
      const randomRecipes = shuffled.slice(0, count);
      
      return createApiResponse(randomRecipes);
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.RECIPES}/random`, { count });
      return response;
    } catch (error) {
      console.error('Failed to fetch random recipes:', error);
      throw new Error('Failed to load random recipes. Please try again.');
    }
  }

  // Get featured recipes
  async getFeaturedRecipes() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return a mix of different meal types
      const featured = [
        ...this.mockRecipes.filter(r => r.mealType === 'breakfast').slice(0, 2),
        ...this.mockRecipes.filter(r => r.mealType === 'lunch').slice(0, 2),
        ...this.mockRecipes.filter(r => r.mealType === 'dinner').slice(0, 2),
      ];
      
      return createApiResponse(featured);
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.RECIPES}/featured`);
      return response;
    } catch (error) {
      console.error('Failed to fetch featured recipes:', error);
      throw new Error('Failed to load featured recipes. Please try again.');
    }
  }

  // Get recipe nutrition info
  async getRecipeNutrition(recipeId) {
    const recipe = await this.getRecipeById(recipeId);
    return createApiResponse(recipe.data.nutrition);
  }

  // Calculate recipe for different serving sizes
  calculateServings(recipe, newServings) {
    const originalServings = recipe.servings;
    const multiplier = newServings / originalServings;

    const adjustedRecipe = {
      ...recipe,
      servings: newServings,
      ingredients: recipe.ingredients.map(ingredient => ({
        ...ingredient,
        amount: ingredient.amount * multiplier,
      })),
      nutrition: {
        ...recipe.nutrition,
        calories: Math.round(recipe.nutrition.calories * multiplier),
        protein: Math.round(recipe.nutrition.protein * multiplier),
        carbs: Math.round(recipe.nutrition.carbs * multiplier),
        fat: Math.round(recipe.nutrition.fat * multiplier),
        fiber: Math.round(recipe.nutrition.fiber * multiplier),
        sodium: Math.round(recipe.nutrition.sodium * multiplier),
      },
    };

    return adjustedRecipe;
  }
}

// Create and export service instance
export const recipeService = new RecipeService();
export default recipeService;
