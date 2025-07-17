// External Recipe API Service (using proxy)
const EXTERNAL_API_URL = 'https://recipe-generator-model-58mk-git-main-sanjays-projects-5366cb8a.vercel.app';

class ExternalRecipeService {
  // Map internal preferences to API format
  mapPreferencesToApiFormat(preferences) {
    const {
      dietType,
      healthGoals,
      mealType,
      cookingTime,
      cookingMethod,
      prepFor,
      allergies
    } = preferences;

    // Convert arrays to string format expected by API
    const healthGoalsString = Array.isArray(healthGoals) ? 
      `[${healthGoals.join(',')}]` : (healthGoals ? `[${healthGoals}]` : '[maintain-weight]');
    
    const allergiesString = Array.isArray(allergies) ? 
      `[${allergies.join(',')}]` : (allergies ? `[${allergies}]` : '[none]');

    // Map cooking time to API format
    const cookingTimeMap = {
      'quick': '15min',
      'medium': '30min',
      'long': '60min'
    };

    return {
      dietType: dietType || 'eggetarian',
      healthGoals: healthGoalsString,
      meal_type: mealType || 'lunch',
      cookingTime: cookingTimeMap[cookingTime] || '30min',
      cookingMethod: cookingMethod || 'slow-cook',
      numberOfPerson: String(prepFor || 2),
      allergies: allergiesString
    };
  }

  // Transform API response to internal recipe format for carousel
  transformApiRecipeToInternalFormat(apiRecipe, index) {
    const recipe = apiRecipe;
    return {
      id: `api-recipe-${index}`,
      name: recipe.title || 'Generated Recipe',
      description: this.formatSummary(recipe.summary || 'No description available'),
      image: '/api/placeholder/400/300', // Placeholder image
      prepTime: 15, // Default values since API doesn't provide these
      cookTime: 30,
      servings: parseInt(recipe.numberOfPerson) || 2,
      difficulty: 'Medium',
      tags: ['AI Generated', 'Personalized'],
      nutrition: {
        calories: 350, // Default nutrition values
        protein: 12,
        carbs: 45,
        fat: 8,
        fiber: 6,
        sodium: 380
      },
      instructions: [recipe.summary || 'No instructions available'],
      ingredients: this.transformIngredients(recipe.ingredients),
      dietaryInfo: {
        vegetarian: true,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        keto: false,
        paleo: false
      },
      // Store original API data for RecipeInstructions component
      apiData: {
        title: recipe.title,
        summary: recipe.summary,
        procedure: recipe.procedure,
        ingredients: recipe.ingredients
      }
    };
  }

  // Transform API ingredients to internal format
  transformIngredients(apiIngredients) {
    if (!apiIngredients) return [];
    
    const ingredients = [];
    
    // Add necessary items
    if (apiIngredients.necessary_items) {
      apiIngredients.necessary_items.forEach(item => {
        ingredients.push({
          name: item.item_name || 'Unknown ingredient',
          amount: item.quantity || 1,
          unit: 'piece'
        });
      });
    }
    
    // Add optional items
    if (apiIngredients.optional_items) {
      apiIngredients.optional_items.forEach(item => {
        ingredients.push({
          name: `${item.item_name} (optional)` || 'Unknown ingredient',
          amount: item.quantity || 1,
          unit: 'piece'
        });
      });
    }
    
    return ingredients;
  }

  // Call external recipe API and transform response
  async generateRecipes(preferences) {
    try {
      const apiPayload = this.mapPreferencesToApiFormat(preferences);
      
      console.log('Calling external recipe API with payload:', apiPayload);

      const response = await fetch(`${EXTERNAL_API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No recipe data received from API');
      }

      console.log('API Response:', data);

      // Transform API recipes to internal format
      const transformedRecipes = data.map((recipe, index) => 
        this.transformApiRecipeToInternalFormat(recipe, index)
      );

      return transformedRecipes;

    } catch (error) {
      console.error('Error calling external recipe API:', error);
      throw new Error(`Failed to generate recipes: ${error.message}`);
    }
  }

  // Format summary to be approximately 100 words
  formatSummary(summary) {
    if (!summary) return 'No summary available';
    
    const words = summary.split(' ');
    if (words.length <= 100) {
      return summary;
    }
    
    // Truncate to 100 words and add ellipsis
    return words.slice(0, 100).join(' ') + '...';
  }
}

export const externalRecipeService = new ExternalRecipeService();
export default externalRecipeService;
