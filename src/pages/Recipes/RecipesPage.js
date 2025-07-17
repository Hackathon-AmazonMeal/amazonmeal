import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { useUserPreferences } from '../../hooks/useUserPreferences';

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

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Get user preferences
  const {
    getDietType,
    getMealType,
    getCookingTime,
    getCookingMethod,
    getNumberOfPeople,
    getAllergies,
    getHealthGoals,
  } = useUserPreferences();

  // Ensure user is authenticated
  useAuthRedirect();

  // Function to extract prep and cook times from procedure text
  const extractTimesFromProcedure = (procedure) => {
    if (!procedure) return { prepTime: 15, cookTime: 25 };
    
    // Look for prep time patterns
    const prepTimePattern = /prep.*?(\d+)[-\s]?min/i;
    const prepMatch = procedure.match(prepTimePattern);
    
    // Look for cook time patterns
    const cookTimePattern = /cook.*?(\d+)[-\s]?min/i;
    const cookMatch = procedure.match(cookTimePattern);
    
    // Look for simmer/bake/roast patterns
    const otherCookingPattern = /(simmer|bake|roast|grill).*?(\d+)[-\s]?min/i;
    const otherMatch = procedure.match(otherCookingPattern);
    
    return {
      prepTime: prepMatch ? parseInt(prepMatch[1]) : 15,
      cookTime: cookMatch ? parseInt(cookMatch[1]) : (otherMatch ? parseInt(otherMatch[2]) : 25)
    };
  };

  // Function to fetch images for recipes
  const fetchImagesForRecipes = async (recipes) => {
    try {
      // Extract recipe titles for image fetching
      const recipeTitles = recipes.map(recipe => recipe.title);
      
      // Call the images API
      const response = await axios.post('https://recipe-generator-model-58mk.vercel.app/images', recipeTitles);
      
      // console.log('Images API response:', response.data);
      
      // Map images to recipes
      const recipesWithImages = recipes.map((recipe, index) => {
        // Extract prep and cook times from procedure
        const { prepTime, cookTime } = extractTimesFromProcedure(recipe.procedure);
        
        // Get image URL from response data (which is a dictionary with recipe titles as keys)
        const imageUrl = response.data[recipe.title] || 
                        `https://source.unsplash.com/featured/?food,${encodeURIComponent(recipe.title)}`;
        
        return {
          ...recipe,
          id: `recipe-${index}`, // Add an ID for React keys
          image: imageUrl,
          // Add default values for UI compatibility
          name: recipe.title,
          prepTime: prepTime,
          cookTime: cookTime,
          servings: recipe.ingredients?.necessary_items?.length > 0 ? 
            Math.ceil(recipe.ingredients.necessary_items.reduce((sum, item) => sum + item.quantity, 0) / 3) : 2,
          nutrition: {
            calories: 350,
            protein: 15,
            carbs: 40,
            fat: 12
          },
          tags: recipe.summary ? 
            recipe.summary.split(' ').filter(word => word.length > 7).slice(0, 3) : 
            ['healthy', 'homemade']
        };
      });
      
      return recipesWithImages;
    } catch (error) {
      console.error('Error fetching images:', error);
      // Return recipes with placeholder images if image fetch fails
      return recipes.map((recipe, index) => {
        // Extract prep and cook times from procedure
        const { prepTime, cookTime } = extractTimesFromProcedure(recipe.procedure);
        
        return {
          ...recipe,
          id: `recipe-${index}`,
          image: `https://source.unsplash.com/featured/?food,${encodeURIComponent(recipe.title)}`,
          name: recipe.title,
          prepTime: prepTime,
          cookTime: cookTime,
          servings: 2,
          nutrition: {
            calories: 350,
            protein: 15,
            carbs: 40,
            fat: 12
          },
          tags: ['healthy', 'homemade']
        };
      });
    }
  };

  // Check if we have recipes in the context, if not, fetch mock data
  useEffect(() => {
    const checkRecipes = async () => {
      try {
        // If we already have recipes in the context, use those
        if (recipes.length > 0) {
          // console.log('Using recipes from context:', recipes);
          return;
        }
        
        // Otherwise, set loading state
        setLoading(true);
        
        // Get user preferences and format them for the API request
        const preferences = {
          dietType: getDietType(),
          healthGoals: getHealthGoals(),
          mealType: getMealType(),
          cookingTime: getCookingTime(),
          cookingMethod: getCookingMethod(),
          prepFor: getNumberOfPeople(),
          allergies: getAllergies(),
        };

        // console.log('No recipes in context, fetching with preferences:', preferences);
        
        try {
          // Call the recipe API directly with the preferences
          const response = await axios.post('https://recipe-generator-model-58mk.vercel.app/recipes', preferences);
          
          // console.log('Recipe API response:', response.data);
          
          // Process the recipes if we got a response
          if (response.data && response.data.length > 0) {
            // Fetch images for the recipes
            const recipesWithImages = await fetchImagesForRecipes(response.data);
            
            // Save the enhanced recipes in the context
            setRecipes(recipesWithImages);
          } else {
            // If no recipes returned, use mock data
            // console.log('No recipes returned from API, using mock data');
            setRecipes([
              {
                id: 'mock-recipe-1',
                name: 'Vegetarian Pasta Primavera',
                title: 'Vegetarian Pasta Primavera',
                image: 'https://source.unsplash.com/featured/?pasta',
                prepTime: 15,
                cookTime: 20,
                servings: 4,
                summary: 'A delicious vegetarian pasta dish with fresh vegetables',
                tags: ['vegetarian', 'pasta', 'healthy'],
                nutrition: {
                  calories: 320,
                  protein: 12,
                  carbs: 45,
                  fat: 10,
                  fiber: 6,
                  sodium: 300
                },
                procedure: '1. Cook pasta according to package instructions.\n2. Sauté vegetables in olive oil.\n3. Combine pasta and vegetables.\n4. Season with salt and pepper.',
                ingredients: {
                  necessary_items: [
                    { _id: 'ing-1', item_name: 'Pasta', quantity: 1, price: 2.99, packet_weight_grams: 500 },
                    { _id: 'ing-2', item_name: 'Bell Peppers', quantity: 2, price: 1.50, packet_weight_grams: 200 },
                    { _id: 'ing-3', item_name: 'Zucchini', quantity: 1, price: 1.20, packet_weight_grams: 300 }
                  ],
                  optional_items: [
                    { _id: 'ing-4', item_name: 'Parmesan Cheese', quantity: 1, price: 3.50, packet_weight_grams: 100 }
                  ]
                }
              },
              {
                id: 'mock-recipe-2',
                name: 'Quinoa Salad Bowl',
                title: 'Quinoa Salad Bowl',
                image: 'https://source.unsplash.com/featured/?quinoa',
                prepTime: 10,
                cookTime: 15,
                servings: 2,
                summary: 'A nutritious quinoa salad with fresh vegetables and herbs',
                tags: ['vegan', 'gluten-free', 'salad'],
                nutrition: {
                  calories: 280,
                  protein: 10,
                  carbs: 35,
                  fat: 12,
                  fiber: 8,
                  sodium: 200
                },
                procedure: '1. Cook quinoa according to package instructions.\n2. Chop vegetables.\n3. Mix quinoa and vegetables.\n4. Add dressing and toss.',
                ingredients: {
                  necessary_items: [
                    { _id: 'ing-5', item_name: 'Quinoa', quantity: 1, price: 3.99, packet_weight_grams: 400 },
                    { _id: 'ing-6', item_name: 'Cherry Tomatoes', quantity: 1, price: 2.50, packet_weight_grams: 250 },
                    { _id: 'ing-7', item_name: 'Cucumber', quantity: 1, price: 0.99, packet_weight_grams: 300 }
                  ],
                  optional_items: [
                    { _id: 'ing-8', item_name: 'Avocado', quantity: 1, price: 1.99, packet_weight_grams: 200 }
                  ]
                }
              },
              {
                id: 'mock-recipe-3',
                name: 'Vegetable Stir Fry',
                title: 'Vegetable Stir Fry',
                image: 'https://source.unsplash.com/featured/?stirfry',
                prepTime: 15,
                cookTime: 10,
                servings: 3,
                summary: 'A quick and easy vegetable stir fry with tofu',
                tags: ['vegetarian', 'quick', 'asian'],
                nutrition: {
                  calories: 250,
                  protein: 15,
                  carbs: 30,
                  fat: 8,
                  fiber: 7,
                  sodium: 400
                },
                procedure: '1. Press and cube tofu.\n2. Chop vegetables.\n3. Stir fry tofu until golden.\n4. Add vegetables and sauce.\n5. Serve hot.',
                ingredients: {
                  necessary_items: [
                    { _id: 'ing-9', item_name: 'Tofu', quantity: 1, price: 2.49, packet_weight_grams: 400 },
                    { _id: 'ing-10', item_name: 'Broccoli', quantity: 1, price: 1.99, packet_weight_grams: 300 },
                    { _id: 'ing-11', item_name: 'Carrots', quantity: 3, price: 1.29, packet_weight_grams: 200 }
                  ],
                  optional_items: [
                    { _id: 'ing-12', item_name: 'Soy Sauce', quantity: 1, price: 2.99, packet_weight_grams: 150 }
                  ]
                }
              }
            ]);
          }
        } catch (apiError) {
          console.error('Error fetching recipes:', apiError);
          // If API call fails, use mock data
          // console.log('API call failed, using mock data');
          setRecipes([
            {
              id: 'mock-recipe-1',
              name: 'Vegetarian Pasta Primavera',
              title: 'Vegetarian Pasta Primavera',
              image: 'https://source.unsplash.com/featured/?pasta',
              prepTime: 15,
              cookTime: 20,
              servings: 4,
              summary: 'A delicious vegetarian pasta dish with fresh vegetables',
              tags: ['vegetarian', 'pasta', 'healthy'],
              nutrition: {
                calories: 320,
                protein: 12,
                carbs: 45,
                fat: 10,
                fiber: 6,
                sodium: 300
              },
              procedure: '1. Cook pasta according to package instructions.\n2. Sauté vegetables in olive oil.\n3. Combine pasta and vegetables.\n4. Season with salt and pepper.',
              ingredients: {
                necessary_items: [
                  { _id: 'ing-1', item_name: 'Pasta', quantity: 1, price: 2.99, packet_weight_grams: 500 },
                  { _id: 'ing-2', item_name: 'Bell Peppers', quantity: 2, price: 1.50, packet_weight_grams: 200 },
                  { _id: 'ing-3', item_name: 'Zucchini', quantity: 1, price: 1.20, packet_weight_grams: 300 }
                ],
                optional_items: [
                  { _id: 'ing-4', item_name: 'Parmesan Cheese', quantity: 1, price: 3.50, packet_weight_grams: 100 }
                ]
              }
            },
            {
              id: 'mock-recipe-2',
              name: 'Quinoa Salad Bowl',
              title: 'Quinoa Salad Bowl',
              image: 'https://source.unsplash.com/featured/?quinoa',
              prepTime: 10,
              cookTime: 15,
              servings: 2,
              summary: 'A nutritious quinoa salad with fresh vegetables and herbs',
              tags: ['vegan', 'gluten-free', 'salad'],
              nutrition: {
                calories: 280,
                protein: 10,
                carbs: 35,
                fat: 12,
                fiber: 8,
                sodium: 200
              },
              procedure: '1. Cook quinoa according to package instructions.\n2. Chop vegetables.\n3. Mix quinoa and vegetables.\n4. Add dressing and toss.',
              ingredients: {
                necessary_items: [
                  { _id: 'ing-5', item_name: 'Quinoa', quantity: 1, price: 3.99, packet_weight_grams: 400 },
                  { _id: 'ing-6', item_name: 'Cherry Tomatoes', quantity: 1, price: 2.50, packet_weight_grams: 250 },
                  { _id: 'ing-7', item_name: 'Cucumber', quantity: 1, price: 0.99, packet_weight_grams: 300 }
                ],
                optional_items: [
                  { _id: 'ing-8', item_name: 'Avocado', quantity: 1, price: 1.99, packet_weight_grams: 200 }
                ]
              }
            },
            {
              id: 'mock-recipe-3',
              name: 'Vegetable Stir Fry',
              title: 'Vegetable Stir Fry',
              image: 'https://source.unsplash.com/featured/?stirfry',
              prepTime: 15,
              cookTime: 10,
              servings: 3,
              summary: 'A quick and easy vegetable stir fry with tofu',
              tags: ['vegetarian', 'quick', 'asian'],
              nutrition: {
                calories: 250,
                protein: 15,
                carbs: 30,
                fat: 8,
                fiber: 7,
                sodium: 400
              },
              procedure: '1. Press and cube tofu.\n2. Chop vegetables.\n3. Stir fry tofu until golden.\n4. Add vegetables and sauce.\n5. Serve hot.',
              ingredients: {
                necessary_items: [
                  { _id: 'ing-9', item_name: 'Tofu', quantity: 1, price: 2.49, packet_weight_grams: 400 },
                  { _id: 'ing-10', item_name: 'Broccoli', quantity: 1, price: 1.99, packet_weight_grams: 300 },
                  { _id: 'ing-11', item_name: 'Carrots', quantity: 3, price: 1.29, packet_weight_grams: 200 }
                ],
                optional_items: [
                  { _id: 'ing-12', item_name: 'Soy Sauce', quantity: 1, price: 2.99, packet_weight_grams: 150 }
                ]
              }
            }
          ]);
        }
      } catch (error) {
        console.error('Error checking recipes:', error);
        setError(error.message || 'Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    checkRecipes();
  }, []);

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
    // console.log('Adding recipe to cart:', recipe);
    
    // Use the enhanced addRecipeToCart function that handles different ingredient formats
    // and saves the ingredients for later use
    addRecipeToCart(recipe);
  };

  const visibleRecipes = getVisibleRecipes();
  const currentRecipe = selectedRecipe || getCurrentRecipe();

  // // console.log('Visible recipes:', visibleRecipes);
  // // console.log('Current recipe:', currentRecipe);
  // // console.log('All recipes:', recipes);

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
