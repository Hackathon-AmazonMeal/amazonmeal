import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Chip, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RecipeBrowser = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRecipes();
  }, []);

  const generateRecipes = async () => {
    setLoading(true);
    // Mock LLM-generated recipes based on user preferences
    setTimeout(() => {
      const mockRecipes = [
        {
          id: '1',
          title: 'Mediterranean Quinoa Bowl',
          image: 'https://via.placeholder.com/300x200',
          prepTime: 20,
          cookTime: 15,
          cuisine: 'MEDITERRANEAN',
          tags: ['VEGETARIAN', 'GLUTEN_FREE'],
          description: 'A nutritious bowl packed with quinoa, fresh vegetables, and Mediterranean flavors.',
          ingredients: [
            { name: 'Quinoa', quantity: 1, unit: 'cup', price: 3.99 },
            { name: 'Cherry Tomatoes', quantity: 200, unit: 'g', price: 2.50 },
            { name: 'Cucumber', quantity: 1, unit: 'piece', price: 1.20 },
            { name: 'Feta Cheese', quantity: 100, unit: 'g', price: 4.50 },
            { name: 'Olive Oil', quantity: 2, unit: 'tbsp', price: 0.50 }
          ],
          instructions: [
            'Cook quinoa according to package instructions',
            'Dice cucumber and halve cherry tomatoes',
            'Combine all ingredients in a bowl',
            'Drizzle with olive oil and season'
          ]
        },
        {
          id: '2',
          title: 'Protein-Packed Chicken Stir Fry',
          image: 'https://via.placeholder.com/300x200',
          prepTime: 15,
          cookTime: 12,
          cuisine: 'ASIAN',
          tags: ['HIGH_PROTEIN'],
          description: 'Perfect for muscle gain with lean protein and fresh vegetables.',
          ingredients: [
            { name: 'Chicken Breast', quantity: 300, unit: 'g', price: 8.99 },
            { name: 'Broccoli', quantity: 200, unit: 'g', price: 2.00 },
            { name: 'Bell Peppers', quantity: 2, unit: 'pieces', price: 3.00 },
            { name: 'Soy Sauce', quantity: 3, unit: 'tbsp', price: 0.30 },
            { name: 'Garlic', quantity: 3, unit: 'cloves', price: 0.20 }
          ],
          instructions: [
            'Cut chicken into bite-sized pieces',
            'Heat oil in wok or large pan',
            'Stir-fry chicken until cooked through',
            'Add vegetables and sauce, cook until tender'
          ]
        }
      ];
      setRecipes(mockRecipes);
      setLoading(false);
    }, 2000);
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Generating personalized recipes based on your preferences...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Personalized Recipes
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Based on your preferences: {currentUser?.preferences?.goal?.replace('_', ' ')}
      </Typography>

      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.02)' } }}
              onClick={() => handleRecipeClick(recipe)}
            >
              <CardMedia
                component="img"
                height="200"
                image={recipe.image}
                alt={recipe.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {recipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {recipe.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prep: {recipe.prepTime}min | Cook: {recipe.cookTime}min
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label={recipe.cuisine} size="small" sx={{ mr: 1 }} />
                  {recipe.tags.map(tag => (
                    <Chip key={tag} label={tag.replace('_', ' ')} size="small" color="primary" sx={{ mr: 0.5 }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecipeBrowser;