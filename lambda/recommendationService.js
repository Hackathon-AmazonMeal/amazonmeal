const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const userId = event.pathParameters.userId;
    const mealCount = event.queryStringParameters?.mealCount || 7;
    
    // Get user preferences
    const userParams = {
      TableName: 'AmazonMeal-Users',
      Key: { userId: userId }
    };
    
    const userResponse = await dynamodb.get(userParams).promise();
    const user = userResponse.Item;
    
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          success: false,
          error: { code: 'USER_NOT_FOUND', message: 'User profile not found' }
        })
      };
    }
    
    // Query recipes
    const recipesParams = {
      TableName: 'AmazonMeal-Recipes'
    };
    
    const recipesResponse = await dynamodb.scan(recipesParams).promise();
    let recipes = recipesResponse.Items || [];
    
    // Score recipes based on preferences
    recipes = recipes.map(recipe => {
      let score = 0;
      
      if (user.preferences.cuisinePreferences?.includes(recipe.cuisine)) {
        score += 3;
      }
      
      if (user.preferences.cookingTime === 'QUICK' && recipe.prepTime + recipe.cookTime < 30) {
        score += 2;
      }
      
      return { ...recipe, score };
    });
    
    // Sort by score and select top meals
    recipes.sort((a, b) => b.score - a.score);
    const selectedRecipes = recipes.slice(0, mealCount);
    
    // Create meal plan
    const mealPlan = {
      userId,
      name: 'Weekly Meal Plan',
      startDate: new Date().toISOString().split('T')[0],
      meals: selectedRecipes.map((recipe, index) => ({
        day: Math.floor(index / 3) + 1,
        mealType: ['BREAKFAST', 'LUNCH', 'DINNER'][index % 3],
        recipeId: recipe.recipeId,
        servings: 2
      })),
      createdAt: Date.now()
    };
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: { mealPlan, recipes: selectedRecipes }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to generate meal plan' }
      })
    };
  }
};