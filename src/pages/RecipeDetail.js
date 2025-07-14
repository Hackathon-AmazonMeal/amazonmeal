import React from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, List, ListItem, ListItemText, Button, Box, Chip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ArrowBack, ShoppingCart } from '@mui/icons-material';

const RecipeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const recipe = location.state?.recipe;

  if (!recipe) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6">Recipe not found</Typography>
        <Button onClick={() => navigate('/recipes')}>Back to Recipes</Button>
      </Container>
    );
  }

  const handleAddToCart = (ingredient) => {
    addToCart(ingredient);
  };

  const handleAddAllToCart = () => {
    recipe.ingredients.forEach(ingredient => addToCart(ingredient));
    navigate('/cart');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/recipes')}
        sx={{ mb: 2 }}
      >
        Back to Recipes
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={recipe.image}
              alt={recipe.title}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {recipe.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {recipe.description}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={`Prep: ${recipe.prepTime}min`} sx={{ mr: 1 }} />
                <Chip label={`Cook: ${recipe.cookTime}min`} sx={{ mr: 1 }} />
                <Chip label={recipe.cuisine} color="primary" />
              </Box>
              <Box sx={{ mb: 2 }}>
                {recipe.tags.map(tag => (
                  <Chip key={tag} label={tag.replace('_', ' ')} size="small" color="secondary" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Instructions
              </Typography>
              <List>
                {recipe.instructions.map((step, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemText 
                      primary={`${index + 1}. ${step}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Ingredients
              </Typography>
              <List>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1, 
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {ingredient.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ingredient.quantity} {ingredient.unit} - ${ingredient.price?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(ingredient)}
                    >
                      Add
                    </Button>
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Total: ${recipe.ingredients.reduce((sum, ing) => sum + (ing.price || 0), 0).toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={handleAddAllToCart}
                >
                  Add All to Cart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeDetail;