import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  AccessTime,
  Restaurant,
  LocalFireDepartment,
} from '@mui/icons-material';

// Hooks and Context
import { useRecipes } from '../../contexts/RecipeContext';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
// import { useUserPreferences } from '../../hooks/useUserPreferences'; // Available if needed

// Components
import RecipeInstructions from '../../components/recipes/RecipeInstructions';
import CartSidebar from '../../components/ingredients/CartSidebar';

function RecipesPage() {
  const { 
    recipes, 
    currentRecipeIndex, 
    isLoading, 
    error, 
    getVisibleRecipes, 
    getCurrentRecipe,
    nextRecipe, 
    previousRecipe,
    hasMoreRecipes,
    getRecipeCount,
    getRecommendations,
  } = useRecipes();
  
  const { addRecipeToCart } = useCart();
  const { currentUser } = useUser();
  
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const hasCalledAPI = useRef(false);
  
  // Ensure user is authenticated
  useAuthRedirect();

  // Load recipes once when page loads
  useEffect(() => {
    const loadRecipes = async () => {
      if (!hasCalledAPI.current && currentUser?.preferences) {
        try {
          hasCalledAPI.current = true;
          console.log('Loading recipes on page load...');
          await getRecommendations(currentUser.preferences).finally(() => hasCalledAPI.current = true);
        } catch (error) {
          console.error('Failed to load recipes:', error);
          hasCalledAPI.current = true; // Reset on error to allow retry if needed
        }
      }
    };

    loadRecipes();
  }, [currentUser, getRecommendations]);

  useEffect(() => {
    // Set the first recipe as selected when recipes load
    if (recipes.length > 0 && !selectedRecipe) {
      const currentRecipe = getCurrentRecipe();
      if (currentRecipe && currentRecipe.id) {
        setSelectedRecipe(currentRecipe);
      }
    }
  }, [recipes, selectedRecipe, getCurrentRecipe]);

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleAddToCart = (recipe) => {
    addRecipeToCart(recipe);
  };

  const visibleRecipes = getVisibleRecipes();
  const currentRecipe = selectedRecipe || getCurrentRecipe();

  console.log('Visible recipes:', visibleRecipes);
  console.log('Current recipe:', currentRecipe);
  console.log('All recipes:', recipes);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading your personalized recipes...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    // Check if error is due to authentication
    if (error.includes('not authenticated') || error.includes('Session expired')) {
      return null; // Let the useAuthRedirect hook handle the redirect
    }
    
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (recipes.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          No recipes found. Please check your preferences or try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Your Personalized Recipes
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {getRecipeCount()} recipes tailored to your preferences
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Recipe Carousel - Top Section */}
          <Grid item xs={12} lg={8}>
            <Box mb={3}>
              <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center"
                mb={2}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Browse Recipes ({currentRecipeIndex + 1}-{Math.min(currentRecipeIndex + 3, getRecipeCount())} of {getRecipeCount()})
                </Typography>
                
                {hasMoreRecipes() && (
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      onClick={previousRecipe}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton 
                      onClick={nextRecipe}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      <ArrowForward />
                    </IconButton>
                  </Stack>
                )}
              </Stack>

              {/* Recipe Cards */}
              <Grid container spacing={2}>
                {visibleRecipes.filter(recipe => recipe && recipe.id).map((recipe, index) => (
                  <Grid item xs={12} md={4} key={recipe.id}>
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: selectedRecipe?.id === recipe.id ? 2 : 1,
                        borderColor: selectedRecipe?.id === recipe.id ? 'primary.main' : 'divider',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleRecipeSelect(recipe)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={recipe.image}
                        alt={recipe.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{ 
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {recipe.name}
                        </Typography>
                        
                        <Stack direction="row" spacing={2} mb={2}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="caption">
                              {recipe.prepTime + recipe.cookTime} min
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Restaurant fontSize="small" color="action" />
                            <Typography variant="caption">
                              {recipe.servings} servings
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <LocalFireDepartment fontSize="small" color="action" />
                            <Typography variant="caption">
                              {recipe.nutrition.calories} cal
                            </Typography>
                          </Box>
                        </Stack>

                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                          {recipe.tags.slice(0, 2).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ))}
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(recipe);
                          }}
                          sx={{ mt: 1 }}
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Recipe Instructions - Bottom Section */}
            {currentRecipe && (
              <RecipeInstructions recipe={currentRecipe} />
            )}
          </Grid>

          {/* Cart Sidebar - Right Section */}
          <Grid item xs={12} lg={4}>
            <CartSidebar />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default RecipesPage;
