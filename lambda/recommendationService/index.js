// recommendationService/index.js - AWS Lambda function for meal recommendations
const AWS = require('aws-sdk');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const bedrock = new AWS.Bedrock({ region: 'us-east-1' });

// Mock data for development
const MOCK_RECIPES = require('../../data/recipes.json');

/**
 * Main Lambda handler for recommendation service
 */
exports.handler = async (event) => {
  console.log('Recommendation Service - Event:', JSON.stringify(event, null, 2));
  
  try {
    const { httpMethod, path, pathParameters, queryStringParameters, body } = event;
    
    // Route based on HTTP method and path
    switch (httpMethod) {
      case 'GET':
        if (path.includes('/recommendations/recipes')) {
          return await getRecipeRecommendations(queryStringParameters);
        }
        break;
        
      case 'POST':
        if (path.includes('/meal-plans')) {
          return await generateMealPlan(JSON.parse(body || '{}'));
        }
        break;
        
      default:
        return createResponse(405, { 
          success: false, 
          error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }
        });
    }
    
    return createResponse(404, { 
      success: false, 
      error: { code: 'NOT_FOUND', message: 'Endpoint not found' }
    });
    
  } catch (error) {
    console.error('Error in recommendation service:', error);
    return createResponse(500, {
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
};

/**
 * Get personalized recipe recommendations
 */
async function getRecipeRecommendations(queryParams) {
  const { userId, count = 10 } = queryParams || {};
  
  if (!userId) {
    return createResponse(400, {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'userId is required' }
    });
  }
  
  try {
    // Get user preferences
    const userPreferences = await getUserPreferences(userId);
    
    // Filter recipes based on preferences
    const filteredRecipes = filterRecipesByPreferences(MOCK_RECIPES, userPreferences);
    
    // Score and rank recipes
    const rankedRecipes = rankRecipes(filteredRecipes, userPreferences);
    
    // Return top recommendations
    const recommendations = rankedRecipes.slice(0, parseInt(count));
    
    return createResponse(200, {
      success: true,
      data: {
        recommendations: recommendations.map(recipe => ({
          recipeId: recipe.recipeId,
          title: recipe.title,
          description: recipe.description,
          imageUrl: recipe.imageUrl,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          difficulty: recipe.difficulty,
          cuisine: recipe.cuisine,
          mealType: recipe.mealType,
          matchScore: recipe.matchScore,
          matchReasons: recipe.matchReasons || []
        }))
      }
    });
    
  } catch (error) {
    console.error('Error getting recipe recommendations:', error);
    return createResponse(500, {
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get recommendations' }
    });
  }
}

/**
 * Generate a personalized meal plan
 */
async function generateMealPlan(requestBody) {
  const { userId, days = 7, mealsPerDay = 3, startDate, preferences = {} } = requestBody;
  
  if (!userId) {
    return createResponse(400, {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'userId is required' }
    });
  }
  
  try {
    // Get user preferences
    const userPreferences = await getUserPreferences(userId);
    const combinedPreferences = { ...userPreferences, ...preferences };
    
    // Generate meal plan using AI
    const mealPlan = await generateAIMealPlan(userId, days, mealsPerDay, startDate, combinedPreferences);
    
    // Save meal plan to database
    const savedMealPlan = await saveMealPlan(mealPlan);
    
    return createResponse(200, {
      success: true,
      data: { mealPlan: savedMealPlan }
    });
    
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return createResponse(500, {
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate meal plan' }
    });
  }
}

/**
 * Get user preferences from database
 */
async function getUserPreferences(userId) {
  try {
    const params = {
      TableName: process.env.USERS_TABLE || 'AmazonMeal-Users',
      Key: { userId }
    };
    
    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      // Return default preferences if user not found
      return {
        dietaryRestrictions: [],
        allergies: [],
        dislikedIngredients: [],
        cookingTime: 'MEDIUM',
        cuisinePreferences: [],
        skillLevel: 'BEGINNER'
      };
    }
    
    return result.Item.preferences || {};
    
  } catch (error) {
    console.error('Error getting user preferences:', error);
    // Return default preferences on error
    return {
      dietaryRestrictions: [],
      allergies: [],
      dislikedIngredients: [],
      cookingTime: 'MEDIUM',
      cuisinePreferences: [],
      skillLevel: 'BEGINNER'
    };
  }
}

/**
 * Filter recipes based on user preferences
 */
function filterRecipesByPreferences(recipes, preferences) {
  return recipes.filter(recipe => {
    // Filter by dietary restrictions
    if (preferences.dietaryRestrictions && preferences.dietaryRestrictions.length > 0) {
      const hasAllRestrictions = preferences.dietaryRestrictions.every(restriction =>
        recipe.dietaryTags && recipe.dietaryTags.includes(restriction)
      );
      if (!hasAllRestrictions) return false;
    }
    
    // Filter by disliked ingredients
    if (preferences.dislikedIngredients && preferences.dislikedIngredients.length > 0) {
      const hasDislikedIngredient = recipe.ingredients.some(ingredient =>
        preferences.dislikedIngredients.some(disliked =>
          ingredient.name.toLowerCase().includes(disliked.toLowerCase())
        )
      );
      if (hasDislikedIngredient) return false;
    }
    
    // Filter by cooking time preference
    if (preferences.cookingTime === 'QUICK') {
      const totalTime = recipe.prepTime + recipe.cookTime;
      if (totalTime > 30) return false;
    }
    
    return true;
  });
}

/**
 * Rank recipes based on user preferences
 */
function rankRecipes(recipes, preferences) {
  return recipes.map(recipe => {
    let score = 0;
    const matchReasons = [];
    
    // Score based on cuisine preference
    if (preferences.cuisinePreferences && preferences.cuisinePreferences.includes(recipe.cuisine)) {
      score += 3;
      matchReasons.push('CUISINE_MATCH');
    }
    
    // Score based on skill level
    if (preferences.skillLevel === 'BEGINNER' && recipe.difficulty === 'EASY') {
      score += 2;
      matchReasons.push('SKILL_MATCH');
    } else if (preferences.skillLevel === 'ADVANCED' && recipe.difficulty === 'HARD') {
      score += 2;
      matchReasons.push('SKILL_MATCH');
    }
    
    // Score based on ratings
    if (recipe.ratings && recipe.ratings.average >= 4.5) {
      score += 2;
      matchReasons.push('HIGHLY_RATED');
    }
    
    // Score based on cooking time
    if (preferences.cookingTime === 'QUICK' && (recipe.prepTime + recipe.cookTime) <= 30) {
      score += 1;
      matchReasons.push('QUICK_COOK');
    }
    
    return {
      ...recipe,
      matchScore: score,
      matchReasons
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Generate AI-powered meal plan using Amazon Bedrock
 */
async function generateAIMealPlan(userId, days, mealsPerDay, startDate, preferences) {
  // For hackathon demo, use rule-based approach
  // In production, this would call Amazon Bedrock
  
  const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];
  const filteredRecipes = filterRecipesByPreferences(MOCK_RECIPES, preferences);
  const rankedRecipes = rankRecipes(filteredRecipes, preferences);
  
  const meals = [];
  const startDateObj = new Date(startDate || Date.now());
  
  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDateObj);
    currentDate.setDate(startDateObj.getDate() + day);
    
    for (let mealIndex = 0; mealIndex < Math.min(mealsPerDay, mealTypes.length); mealIndex++) {
      const mealType = mealTypes[mealIndex];
      
      // Find appropriate recipe for this meal type
      const suitableRecipes = rankedRecipes.filter(recipe => 
        recipe.mealType === mealType || 
        (mealType === 'LUNCH' && recipe.mealType === 'DINNER') // Allow dinner recipes for lunch
      );
      
      if (suitableRecipes.length > 0) {
        // Select recipe with some randomness to avoid repetition
        const recipeIndex = Math.floor(Math.random() * Math.min(3, suitableRecipes.length));
        const selectedRecipe = suitableRecipes[recipeIndex];
        
        meals.push({
          day: currentDate.toISOString().split('T')[0],
          mealType,
          recipeId: selectedRecipe.recipeId,
          servings: 2 // Default serving size
        });
      }
    }
  }
  
  return {
    mealPlanId: `mp-${userId}-${Date.now()}`,
    userId,
    name: `${days}-Day Meal Plan`,
    startDate: startDateObj.toISOString().split('T')[0],
    endDate: new Date(startDateObj.getTime() + (days - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    meals,
    createdAt: Date.now(),
    lastUpdated: Date.now()
  };
}

/**
 * Save meal plan to database
 */
async function saveMealPlan(mealPlan) {
  try {
    const params = {
      TableName: process.env.MEAL_PLANS_TABLE || 'AmazonMeal-MealPlans',
      Item: mealPlan
    };
    
    await dynamodb.put(params).promise();
    return mealPlan;
    
  } catch (error) {
    console.error('Error saving meal plan:', error);
    throw error;
  }
}

/**
 * Create standardized HTTP response
 */
function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(body)
  };
}
