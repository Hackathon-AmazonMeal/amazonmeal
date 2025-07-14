const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AmazonMeal API is running' });
});

app.get('/api/recipes', (req, res) => {
  res.json({
    recipes: [
      { id: 1, name: 'Grilled Chicken Salad', cuisine: 'American', cookTime: 20 },
      { id: 2, name: 'Pasta Carbonara', cuisine: 'Italian', cookTime: 25 },
      { id: 3, name: 'Salmon Teriyaki', cuisine: 'Japanese', cookTime: 30 }
    ]
  });
});

app.get('/api/meal-plans', (req, res) => {
  res.json({
    mealPlan: [
      { day: 'Monday', breakfast: 'Oatmeal', lunch: 'Salad', dinner: 'Pasta' },
      { day: 'Tuesday', breakfast: 'Toast', lunch: 'Soup', dinner: 'Chicken' }
    ]
  });
});

app.get('/api/shopping-list', (req, res) => {
  res.json({
    items: [
      { id: 1, name: 'Chicken Breast', quantity: '2 lbs', checked: false },
      { id: 2, name: 'Mixed Greens', quantity: '1 bag', checked: false },
      { id: 3, name: 'Olive Oil', quantity: '1 bottle', checked: true }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AmazonMeal API server running on http://localhost:${PORT}`);
});
