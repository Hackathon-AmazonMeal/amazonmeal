const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// Mock data
const breakfastRecipes = require('./src/data/recipes/breakfast.json');
const lunchRecipes = require('./src/data/recipes/lunch.json');
const dinnerRecipes = require('./src/data/recipes/dinner.json');

const allRecipes = [...breakfastRecipes, ...lunchRecipes, ...dinnerRecipes];

// API Routes
app.get('/api/recipes', (req, res) => {
  res.json({
    success: true,
    data: allRecipes,
    message: 'Recipes fetched successfully',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = allRecipes.find(r => r.id === req.params.id);
  if (!recipe) {
    return res.status(404).json({
      success: false,
      message: 'Recipe not found',
      timestamp: new Date().toISOString(),
    });
  }
  
  res.json({
    success: true,
    data: recipe,
    message: 'Recipe fetched successfully',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/recommendations/personalized', (req, res) => {
  // Simulate AI processing delay
  setTimeout(() => {
    // Simple filtering based on preferences
    let filteredRecipes = allRecipes;
    
    const { preferences } = req.body;
    
    // Apply dietary restrictions
    if (preferences.dietaryRestrictions && preferences.dietaryRestrictions.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        return preferences.dietaryRestrictions.every(restriction => {
          switch (restriction) {
            case 'vegetarian':
              return recipe.dietaryInfo.vegetarian;
            case 'vegan':
              return recipe.dietaryInfo.vegan;
            case 'gluten-free':
              return recipe.dietaryInfo.glutenFree;
            case 'dairy-free':
              return recipe.dietaryInfo.dairyFree;
            default:
              return true;
          }
        });
      });
    }
    
    // Take first 15 recipes
    const recommendations = filteredRecipes.slice(0, 15);
    
    res.json({
      success: true,
      data: recommendations,
      message: 'Personalized recommendations generated successfully',
      timestamp: new Date().toISOString(),
    });
  }, 1500);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});
