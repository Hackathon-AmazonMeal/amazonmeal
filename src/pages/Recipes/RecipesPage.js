import React, { useEffect, useState } from 'react';
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
    setRecipes,
    setLoading,
    setError,
  } = useRecipes();
  
  const { addRecipeToCart } = useCart();
  const { user } = useUser();
  
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Ensure user is authenticated
  useAuthRedirect();

  // API function to fetch personalized recipes
  const fetchPersonalizedRecipes = async () => {
    if (!user || !user.preferences) {
      setError('User preferences not found');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build preferences payload
      const preferences = {};
      if (user.preferences.dietType) preferences.dietType = user.preferences.dietType;
      if (user.preferences.healthGoals && user.preferences.healthGoals.length > 0) {
        preferences.healthGoals = user.preferences.healthGoals;
      }
      if (user.preferences.mealType) preferences.mealType = user.preferences.mealType;
      if (user.preferences.cookingTime) preferences.cookingTime = user.preferences.cookingTime;
      if (user.preferences.cookingMethod) preferences.cookingMethod = user.preferences.cookingMethod;
      if (user.preferences.prepFor) preferences.prepFor = user.preferences.prepFor;
      if (user.preferences.allergies && user.preferences.allergies.length > 0) {
        preferences.allergies = user.preferences.allergies;
      }

      const payload = {
        email: user.email || "user@tesin.com", // Default email if not in user context
        preferences
      };

      const response = await fetch('https://user-ms-iimt.vercel.app/preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const apiData = await response.json();

      // Transform API response to recipe format (only API-provided data)
      const transformedRecipes = apiData.map((item, index) => ({
        id: `recipe-${index}`,
        name: item.title,
        description: item.summary,
        image: 'https://via.placeholder.com/300x200/f0f0f0/666666?text=Recipe', // Keep placeholder image
        ingredients: [
          ...item.ingredients.necessary_items.map(ingredient => ({
            name: ingredient.item_name,
            amount: ingredient.quantity,
            unit: 'units',
            category: 'ingredient',
            price: ingredient.price,
            id: ingredient._id,
          })),
          ...item.ingredients.optional_items.map(ingredient => ({
            name: ingredient.item_name,
            amount: ingredient.quantity,
            unit: 'units',
            category: 'optional',
            price: ingredient.price,
            id: ingredient._id,
          }))
        ],
        instructions: [item.procedure],
        summary: item.summary,
        youtube: item.youtube, // Include if provided by API
      }));

      setRecipes(transformedRecipes);
    } catch (error) {
      console.error('Error fetching personalized recipes:', error);
      setError(error.message || 'Failed to load personalized recipes');
    }
  };

  // Fetch recipes on component mount
  useEffect(() => {
    if (user && user.preferences) {
      fetchPersonalizedRecipes();
    }
  }, [user]);

  // Remove auto-selection - let user choose which recipe to select
  // useEffect(() => {
  //   // Set the first recipe as selected when recipes load
  //   if (recipes.length > 0 && !selectedRecipe) {
  //     const currentRecipe = getCurrentRecipe();
  //     if (currentRecipe && currentRecipe.id) {
  //       setSelectedRecipe(currentRecipe);
  //     }
  //   }
  // }, [recipes, selectedRecipe, getCurrentRecipe]);

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    addRecipeToCart(recipe); // Automatically add ingredients to cart when recipe is selected
  };

  const handleAddToCart = (recipe) => {
    addRecipeToCart(recipe);
  };

  const visibleRecipes = getVisibleRecipes();
  const currentRecipe = selectedRecipe || getCurrentRecipe();

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
          <Grid item xs={12} lg={selectedRecipe ? 8 : 12}>
            <Box mb={3}>
              {/* Header - Title Only */}
              <Typography 
                variant="h5" 
                sx={{ fontWeight: 600, mb: 3 }}
              >
                Browse Recipes ({currentRecipeIndex + 1}-{Math.min(currentRecipeIndex + 3, getRecipeCount())} of {getRecipeCount()})
              </Typography>

              {/* Carousel with Side Navigation */}
              <Box 
                display="flex" 
                alignItems="center" 
                gap={2}
                sx={{ minHeight: '400px' }}
              >
                {/* Left Arrow */}
                <IconButton 
                  onClick={previousRecipe}
                  disabled={!hasMoreRecipes()}
                  sx={{ 
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    width: 48,
                    height: 48,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white',
                      transform: 'scale(1.1)',
                    },
                    '&:disabled': {
                      bgcolor: 'grey.100',
                      color: 'grey.400',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ArrowBack />
                </IconButton>

                {/* Recipe Cards Container */}
                <Box flex={1}>
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

              {/* Right Arrow */}
              <IconButton 
                onClick={nextRecipe}
                disabled={!hasMoreRecipes()}
                sx={{ 
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  width: 48,
                  height: 48,
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white',
                    transform: 'scale(1.1)',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.100',
                    color: 'grey.400',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ArrowForward />
              </IconButton>
            </Box>
          </Box>

            {/* Recipe Instructions - Bottom Section */}
            {currentRecipe && (
              <RecipeInstructions recipe={currentRecipe} />
            )}
          </Grid>

          {/* Cart Sidebar - Right Section - Only show when recipe is selected */}
          {selectedRecipe && (
            <Grid item xs={12} lg={4}>
              <CartSidebar />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default RecipesPage;
