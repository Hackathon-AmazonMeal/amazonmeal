const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { userId, mealPlanId } = JSON.parse(event.body);
    
    // Get meal plan
    const mealPlanParams = {
      TableName: 'AmazonMeal-MealPlans',
      Key: { mealPlanId, userId }
    };
    
    const mealPlanResponse = await dynamodb.get(mealPlanParams).promise();
    const mealPlan = mealPlanResponse.Item;
    
    if (!mealPlan) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          error: { code: 'MEAL_PLAN_NOT_FOUND', message: 'Meal plan not found' }
        })
      };
    }
    
    // Get recipes for all meals
    const recipeIds = mealPlan.meals.map(meal => meal.recipeId);
    const recipes = [];
    
    for (const recipeId of recipeIds) {
      const recipeParams = {
        TableName: 'AmazonMeal-Recipes',
        Key: { recipeId }
      };
      const recipeResponse = await dynamodb.get(recipeParams).promise();
      if (recipeResponse.Item) {
        recipes.push(recipeResponse.Item);
      }
    }
    
    // Consolidate ingredients
    const ingredientMap = {};
    
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        if (ingredientMap[key]) {
          ingredientMap[key].quantity += ingredient.quantity;
        } else {
          ingredientMap[key] = {
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            category: ingredient.category
          };
        }
      });
    });
    
    // Create shopping list
    const shoppingList = {
      shoppingListId: `sl-${userId}-${Date.now()}`,
      userId,
      name: `Shopping List for ${mealPlan.name}`,
      mealPlanId,
      items: Object.values(ingredientMap).map(ingredient => ({
        ...ingredient,
        checked: false
      })),
      createdAt: Date.now()
    };
    
    // Save shopping list
    const saveParams = {
      TableName: 'AmazonMeal-ShoppingLists',
      Item: shoppingList
    };
    
    await dynamodb.put(saveParams).promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: shoppingList
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to create shopping list' }
      })
    };
  }
};