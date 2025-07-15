import { apiClient, API_ENDPOINTS, USE_MOCK_DATA, createApiResponse } from './api';
import { recipeService } from './recipeService';
import axios from 'axios';

class RecommendationService {
  constructor() {
    this.recipeService = recipeService;
    this.PREFERENCE_API_URL = 'https://user-ms-iimt.vercel.app/api/preference';
  }

  // Check if user is authenticated before making requests
  checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User not authenticated');
    }
    return token;
  }

  // Get personalized recipes from external API based on user preferences
  async getPersonalizedRecipesFromAPI(userEmail, preferences) {
    try {
      const response = await axios.post(this.PREFERENCE_API_URL, {
        email: userEmail,
        preferences: {
          dietType: preferences.dietType,
          healthGoals: preferences.healthGoals || [],
          mealType: preferences.mealType,
          cookingTime: preferences.cookingTime,
          cookingMethod: preferences.cookingMethod,
          prepFor: preferences.prepFor || 1,
          allergies: preferences.allergies || []
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      return createApiResponse(response.data, true, 'Personalized recipes fetched successfully');
    } catch (error) {
      console.error('Error fetching personalized recipes from external API:', error);
      
      // If external API fails, fallback to mock recommendations
      console.log('Falling back to mock recommendations...');
      return this.getMockPersonalizedRecommendations(preferences);
    }
  }

  // Get personalized recipe recommendations based on user preferences
  async getPersonalizedRecommendations(preferences) {
    if (USE_MOCK_DATA) {
      return this.getMockPersonalizedRecommendations(preferences);
    }

    try {
      // Check authentication before making request
      this.checkAuth();
      
      const response = await apiClient.post(API_ENDPOINTS.PERSONALIZED_RECOMMENDATIONS, {
        preferences,
        count: 15,
      });
      return response;
    } catch (error) {
      console.error('Failed to get personalized recommendations:', error);
      
      // If authentication error, throw it to be handled by the component
      if (error.message === 'User not authenticated') {
        throw error;
      }
      
      // Fallback to mock recommendations for other errors
      return this.getMockPersonalizedRecommendations(preferences);
    }
  }

  // Mock implementation of personalized recommendations
  async getMockPersonalizedRecommendations(preferences) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Get all recipes
      const allRecipesResponse = await this.recipeService.getAllRecipes();
      let allRecipes = allRecipesResponse.data;

      console.log('All recipes loaded:', allRecipes.length);

      // Filter recipes based on dietary restrictions
      let filteredRecipes = this.filterByDietaryRestrictions(allRecipes, preferences.dietaryRestrictions);
      console.log('After dietary restrictions filter:', filteredRecipes.length);

      // Filter out recipes with allergens
      filteredRecipes = this.filterByAllergies(filteredRecipes, preferences.allergies);
      console.log('After allergies filter:', filteredRecipes.length);

      // Score recipes based on health goals and diet type
      const scoredRecipes = this.scoreRecipesByPreferences(filteredRecipes, preferences);
      console.log('Scored recipes:', scoredRecipes.length);

      // Sort by score and take top 15
      const topRecipes = scoredRecipes
        .sort((a, b) => b.score - a.score)
        .slice(0, 15)
        .map(item => item.recipe);

      console.log('Top recipes before balancing:', topRecipes.length);

      // Ensure we have a good mix of meal types
      const balancedRecommendations = this.balanceMealTypes(topRecipes);
      console.log('Balanced recommendations:', balancedRecommendations.length);

      // Validate that all recipes have required fields
      const validRecommendations = balancedRecommendations.filter(recipe => 
        recipe && recipe.id && recipe.name && recipe.ingredients
      );
      console.log('Valid recommendations:', validRecommendations.length);

      return createApiResponse(validRecommendations, true, 'Personalized recommendations generated successfully');
    } catch (error) {
      console.error('Error generating mock recommendations:', error);
      throw new Error('Failed to generate personalized recommendations');
    }
  }

  // Filter recipes by dietary restrictions
  filterByDietaryRestrictions(recipes, restrictions = []) {
    if (!restrictions || restrictions.length === 0) {
      return recipes;
    }

    return recipes.filter(recipe => {
      return restrictions.every(restriction => {
        switch (restriction) {
          case 'vegetarian':
            return recipe.dietaryInfo.vegetarian;
          case 'vegan':
            return recipe.dietaryInfo.vegan;
          case 'gluten-free':
            return recipe.dietaryInfo.glutenFree;
          case 'dairy-free':
            return recipe.dietaryInfo.dairyFree;
          case 'keto':
            return recipe.dietaryInfo.keto;
          case 'paleo':
            return recipe.dietaryInfo.paleo;
          case 'low-sodium':
            return recipe.nutrition.sodium < 600;
          case 'low-carb':
            return recipe.nutrition.carbs < 30;
          default:
            return true;
        }
      });
    });
  }

  // Filter recipes by allergies
  filterByAllergies(recipes, allergies = []) {
    if (!allergies || allergies.length === 0) {
      return recipes;
    }

    return recipes.filter(recipe => {
      return !allergies.some(allergy => {
        return recipe.ingredients.some(ingredient => {
          const ingredientName = ingredient.name.toLowerCase();
          
          switch (allergy) {
            case 'nuts':
              return ingredientName.includes('nut') || 
                     ingredientName.includes('almond') || 
                     ingredientName.includes('walnut') || 
                     ingredientName.includes('cashew') ||
                     ingredientName.includes('pecan') ||
                     ingredientName.includes('hazelnut');
            case 'peanuts':
              return ingredientName.includes('peanut');
            case 'dairy':
              return ingredientName.includes('milk') || 
                     ingredientName.includes('cheese') || 
                     ingredientName.includes('yogurt') || 
                     ingredientName.includes('butter') ||
                     ingredientName.includes('cream');
            case 'eggs':
              return ingredientName.includes('egg');
            case 'soy':
              return ingredientName.includes('soy') || 
                     ingredientName.includes('tofu') ||
                     ingredientName.includes('tempeh');
            case 'shellfish':
              return ingredientName.includes('shrimp') || 
                     ingredientName.includes('crab') || 
                     ingredientName.includes('lobster') ||
                     ingredientName.includes('shellfish');
            case 'fish':
              return ingredientName.includes('salmon') || 
                     ingredientName.includes('tuna') || 
                     ingredientName.includes('cod') ||
                     ingredientName.includes('fish');
            case 'wheat':
              return ingredientName.includes('wheat') || 
                     ingredientName.includes('flour') ||
                     ingredientName.includes('bread');
            case 'sesame':
              return ingredientName.includes('sesame') || 
                     ingredientName.includes('tahini');
            default:
              return ingredientName.includes(allergy.toLowerCase());
          }
        });
      });
    });
  }

  // Score recipes based on user preferences
  scoreRecipesByPreferences(recipes, preferences) {
    return recipes.map(recipe => {
      let score = 0;

      // Base score
      score += 50;

      // Health goals scoring
      if (preferences.healthGoals) {
        preferences.healthGoals.forEach(goal => {
          switch (goal) {
            case 'weight-loss':
              if (recipe.nutrition.calories < 400) score += 20;
              if (recipe.nutrition.fiber > 5) score += 10;
              break;
            case 'muscle-gain':
              if (recipe.nutrition.protein > 20) score += 20;
              if (recipe.nutrition.calories > 300) score += 10;
              break;
            case 'heart-health':
              if (recipe.nutrition.sodium < 500) score += 15;
              if (recipe.tags.includes('heart-healthy')) score += 15;
              break;
            case 'diabetes-management':
              if (recipe.nutrition.carbs < 40) score += 15;
              if (recipe.nutrition.fiber > 5) score += 10;
              break;
            case 'energy-boost':
              if (recipe.nutrition.carbs > 30 && recipe.nutrition.carbs < 60) score += 15;
              break;
            case 'digestive-health':
              if (recipe.nutrition.fiber > 8) score += 20;
              break;
            default:
              break;
          }
        });
      }

      // Diet type scoring
      if (preferences.dietType) {
        switch (preferences.dietType) {
          case 'high-protein':
            if (recipe.nutrition.protein > 25) score += 15;
            break;
          case 'low-carb':
            if (recipe.nutrition.carbs < 25) score += 15;
            break;
          case 'mediterranean':
            if (recipe.cuisine === 'Mediterranean') score += 20;
            if (recipe.tags.includes('mediterranean')) score += 10;
            break;
          case 'plant-based':
            if (recipe.dietaryInfo.vegetarian) score += 15;
            if (recipe.dietaryInfo.vegan) score += 20;
            break;
          default:
            break;
        }
      }

      // Bonus for popular tags
      const popularTags = ['high-protein', 'high-fiber', 'heart-healthy', 'quick-dinner'];
      recipe.tags.forEach(tag => {
        if (popularTags.includes(tag)) {
          score += 5;
        }
      });

      // Bonus for reasonable prep time
      const totalTime = recipe.prepTime + recipe.cookTime;
      if (totalTime <= 30) score += 10;
      else if (totalTime <= 45) score += 5;

      return { recipe, score };
    });
  }

  // Balance meal types in recommendations
  balanceMealTypes(recipes) {
    console.log('Balancing meal types for recipes:', recipes.length);
    
    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    const balanced = [];
    const recipesByMealType = {};

    // Group recipes by meal type
    mealTypes.forEach(mealType => {
      recipesByMealType[mealType] = recipes.filter(recipe => recipe && recipe.mealType === mealType);
      console.log(`${mealType} recipes:`, recipesByMealType[mealType].length);
    });

    // Try to get 5 of each meal type
    const targetPerMealType = 5;
    
    mealTypes.forEach(mealType => {
      const available = recipesByMealType[mealType];
      const toAdd = Math.min(available.length, targetPerMealType);
      console.log(`Adding ${toAdd} ${mealType} recipes`);
      balanced.push(...available.slice(0, toAdd));
    });

    console.log('Balanced so far:', balanced.length);

    // If we don't have enough, fill with remaining recipes
    if (balanced.length < 15) {
      const remaining = recipes.filter(recipe => recipe && !balanced.includes(recipe));
      const needed = 15 - balanced.length;
      console.log(`Adding ${needed} more recipes from remaining ${remaining.length}`);
      balanced.push(...remaining.slice(0, needed));
    }

    const final = balanced.slice(0, 15);
    console.log('Final balanced recipes:', final.length);
    return final;
  }

  // Get recommendations for returning users based on order history
  async getRecommendationsForReturningUser(user) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
        // Get base recommendations
        const baseRecommendations = await this.getPersonalizedRecommendations(user.preferences);
        
        // Get order history recipe IDs
        const orderedRecipeIds = user.orderHistory?.map(order => order.recipeId) || [];
        
        // Filter out recently ordered recipes
        const filteredRecommendations = baseRecommendations.data.filter(recipe => 
          !orderedRecipeIds.includes(recipe.id)
        );

        // If we filtered out too many, add some back
        if (filteredRecommendations.length < 10) {
          const allRecipesResponse = await this.recipeService.getAllRecipes();
          const additionalRecipes = allRecipesResponse.data
            .filter(recipe => !filteredRecommendations.some(fr => fr.id === recipe.id))
            .slice(0, 15 - filteredRecommendations.length);
          
          filteredRecommendations.push(...additionalRecipes);
        }

        return createApiResponse(filteredRecommendations.slice(0, 15));
      } catch (error) {
        console.error('Error getting recommendations for returning user:', error);
        throw error;
      }
    }

    try {
      const response = await apiClient.post(`${API_ENDPOINTS.RECOMMENDATIONS}/returning-user`, {
        userId: user.id,
        preferences: user.preferences,
        orderHistory: user.orderHistory,
      });
      return response;
    } catch (error) {
      console.error('Failed to get recommendations for returning user:', error);
      throw new Error('Failed to get personalized recommendations');
    }
  }

  // Get similar recipes
  async getSimilarRecipes(recipeId, count = 5) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));

      try {
        const targetRecipeResponse = await this.recipeService.getRecipeById(recipeId);
        const targetRecipe = targetRecipeResponse.data;
        
        const allRecipesResponse = await this.recipeService.getAllRecipes();
        const allRecipes = allRecipesResponse.data.filter(recipe => recipe.id !== recipeId);

        // Find similar recipes based on cuisine, meal type, and tags
        const similarRecipes = allRecipes
          .map(recipe => ({
            recipe,
            similarity: this.calculateSimilarity(targetRecipe, recipe),
          }))
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, count)
          .map(item => item.recipe);

        return createApiResponse(similarRecipes);
      } catch (error) {
        console.error('Error getting similar recipes:', error);
        throw error;
      }
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.RECIPES}/${recipeId}/similar`, { count });
      return response;
    } catch (error) {
      console.error('Failed to get similar recipes:', error);
      throw new Error('Failed to get similar recipes');
    }
  }

  // Calculate similarity between two recipes
  calculateSimilarity(recipe1, recipe2) {
    let similarity = 0;

    // Same meal type
    if (recipe1.mealType === recipe2.mealType) similarity += 30;

    // Same cuisine
    if (recipe1.cuisine === recipe2.cuisine) similarity += 25;

    // Common tags
    const commonTags = recipe1.tags.filter(tag => recipe2.tags.includes(tag));
    similarity += commonTags.length * 10;

    // Similar difficulty
    if (recipe1.difficulty === recipe2.difficulty) similarity += 15;

    // Similar prep time
    const timeDiff = Math.abs((recipe1.prepTime + recipe1.cookTime) - (recipe2.prepTime + recipe2.cookTime));
    if (timeDiff <= 10) similarity += 10;
    else if (timeDiff <= 20) similarity += 5;

    return similarity;
  }
}

// Create and export service instance
export const recommendationService = new RecommendationService();
export default recommendationService;
