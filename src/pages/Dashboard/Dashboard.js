import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
  Chip,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Restaurant,
  History,
  Settings,
  TrendingUp,
  AccessTime,
  LocalFireDepartment,
  Refresh,
} from '@mui/icons-material';

// Hooks and Context
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useRecipes } from '../../contexts/RecipeContext';
import { useCart } from '../../contexts/CartContext';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { useUser } from '../../contexts/UserContext';


function Dashboard() {
  const navigate = useNavigate();
  const { user, getAllergies, getHealthGoals, getDietType } = useUserPreferences();
  const userContext = useUser();
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [preferencesMessage, setPreferencesMessage] = useState(null);
  useAuthRedirect();
  const { recipes, getRecommendations, findRecipeById } = useRecipes();
  const { addRecipeToCart, error: cartError, clearError } = useCart();
  useEffect(() => {
    // Load recommendations if not already loaded
    if (user?.preferences && recipes.length === 0) {
      getRecommendations(user.preferences).catch(error => {
        if (error.message === 'User not authenticated') {
          navigate('/login');
        }
      });
    }
  }, [user, recipes.length, getRecommendations, navigate]);

  // Function to manually fetch preferences from API
  const fetchUserPreferences = async () => {
    if (!user?.email) return;
    
    setPreferencesLoading(true);
    setPreferencesMessage(null);
    try {
      const response = await fetch(`https://user-ms-iimt.vercel.app/preference/${user.email}`);
      if (response.ok) {
        const apiResponse = await response.json();
        // console.log('API Response in fetchUserPreferences:', apiResponse);
        
        // Extract preferences from the correct structure
        if (apiResponse && apiResponse.success && apiResponse.data && apiResponse.data.preferences) {
          // Update user preferences with the correct structure
          userContext.updatePreferences(apiResponse.data.preferences);
          setPreferencesMessage({ type: 'success', text: 'Preferences successfully fetched!' });
        } else {
          console.warn('API response does not have the expected structure:', apiResponse);
          setPreferencesMessage({ type: 'warning', text: 'Received unexpected data format from API.' });
        }
      } else {
        console.warn('Failed to fetch user preferences from API');
        setPreferencesMessage({ type: 'error', text: 'Failed to fetch preferences. Please try again.' });
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      setPreferencesMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setPreferencesLoading(false);
    }
  };

  // Helper function to format preference values
  const formatPreferenceValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None';
      if (value.length === 1) return value[0];
      return `${value.length} items`;
    }
    
    if (typeof value === 'object') {
      return 'Object';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Truncate long strings
    const strValue = String(value);
    return strValue.length > 15 ? strValue.substring(0, 12) + '...' : strValue;
  };

  // Fetch preferences when component mounts
  useEffect(() => {
    if (user?.email) {
      fetchUserPreferences();
    }
    
    // Debug log to see what preferences are available
    // console.log('User Preferences:', user?.preferences);
  }, [user?.email]);

  // Clear preferences message after 5 seconds
  useEffect(() => {
    if (preferencesMessage) {
      const timer = setTimeout(() => {
        setPreferencesMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [preferencesMessage]);

  const handleRecipeSelect = (recipe) => {
    // Check if we have a full recipe object with ingredients
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      addRecipeToCart(recipe);
      navigate('/recipes');
    } else {
      // If we only have partial recipe data (from order history), 
      // try to find the full recipe or navigate to recipe detail
      const fullRecipe = findRecipeById ? findRecipeById(recipe.id) : null;
      if (fullRecipe) {
        addRecipeToCart(fullRecipe);
        navigate('/recipes');
      } else {
        // If we can't find the full recipe, just navigate to recipes page
        navigate('/recipes');
      }
    }
  };

  const handleOrderSelect = (order) => {
    // For order history, try to find the full recipe first
    if (order.recipeId) {
      const fullRecipe = findRecipeById(order.recipeId);
      if (fullRecipe) {
        addRecipeToCart(fullRecipe);
        navigate('/recipes');
        return;
      }
    }
    
    // If we can't find the full recipe, just navigate to recipes page
    navigate('/recipes');
  };

  const handleEditPreferences = () => {
    navigate('/preferences');
  };

  const handleViewAllRecipes = () => {
    navigate('/recipes');
  };

  const orderHistory = user?.orderHistory || [];
  const recentRecipes = recipes.slice(0, 6);
  const allergies = getAllergies();
  const healthGoals = getHealthGoals();
  const dietType = getDietType();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Header */}
        <Box mb={4}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Welcome Back!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Here's your personalized recipe dashboard
          </Typography>
        </Box>

        {/* Error Alert */}
        {cartError && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={clearError}
          >
            {cartError}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {/* Quick Stats */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Restaurant color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                      {recipes.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Personalized Recipes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <History color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                      {orderHistory.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Orders Placed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <TrendingUp color="info" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                      {healthGoals.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Health Goals
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Recipes */}
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Your Recipe Recommendations
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={handleViewAllRecipes}
                  >
                    View All
                  </Button>
                </Stack>

                {recentRecipes.length > 0 ? (
                  <Grid container spacing={2}>
                    {recentRecipes.map((recipe) => (
                      <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 3,
                            },
                          }}
                          onClick={() => handleRecipeSelect(recipe)}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            image={recipe.image}
                            alt={recipe.name}
                          />
                          <CardContent sx={{ p: 2 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                mb: 1,
                              }}
                            >
                              {recipe.name}
                            </Typography>
                            <Stack direction="row" spacing={1} mb={1}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <AccessTime fontSize="small" color="action" />
                                <Typography variant="caption">
                                  {recipe.prepTime + recipe.cookTime}m
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <LocalFireDepartment fontSize="small" color="action" />
                                <Typography variant="caption">
                                  {recipe.nutrition.calories} cal
                                </Typography>
                              </Box>
                            </Stack>
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                              {recipe.tags.slice(0, 2).map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    No recipes loaded yet. Your personalized recommendations will appear here.
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Order History */}
            {orderHistory.length > 0 && (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Orders
                  </Typography>
                  <Stack spacing={2}>
                    {orderHistory.slice(0, 3).map((order) => (
                      <Box
                        key={order.id}
                        sx={{
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        onClick={() => handleOrderSelect(order)}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {order.recipeName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.totalItems} items • ${order.estimatedTotal?.toFixed(2)}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(order.timestamp).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column - User Profile */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              position: 'sticky', 
              top: 24,
              borderRadius: 2,
              boxShadow: 3
            }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Settings color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Your Preferences
                    </Typography>
                  </Stack>
                  <Button 
                    size="small" 
                    startIcon={<Refresh />} 
                    onClick={fetchUserPreferences}
                    disabled={preferencesLoading}
                    sx={{ 
                      fontWeight: 500,
                      borderRadius: 1,
                      textTransform: 'none'
                    }}
                  >
                    Refresh
                  </Button>
                </Stack>

                {/* API Preferences */}
                <Box mb={3}>
                  {/* Success/Error Messages */}
                  {/* {preferencesMessage && (
                    <Alert 
                      severity={preferencesMessage.type} 
                      sx={{ 
                        mb: 2,
                        borderRadius: 1,
                        '& .MuiAlert-message': { fontWeight: 500 }
                      }}
                      onClose={() => setPreferencesMessage(null)}
                    >
                      {preferencesMessage.text}
                    </Alert>
                  )} */}
                  
                  {preferencesLoading ? (
                    <Box display="flex" justifyContent="center" my={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : user?.preferences ? (
                    <Stack spacing={2}>
                      {/* Diet Type */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 1, 
                        bgcolor: 'background.paper',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                          Diet Type
                        </Typography>
                        {user.preferences.dietType ? (
                          <Chip
                            label={user.preferences.dietType}
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 500 }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">Not set</Typography>
                        )}
                      </Box>
                      
                      {/* Meal Type */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 1, 
                        bgcolor: 'background.paper',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                          Meal Type
                        </Typography>
                        {user.preferences.mealType ? (
                          <Chip
                            label={user.preferences.mealType}
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 500 }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">Not set</Typography>
                        )}
                      </Box>
                      
                      {/* Number of People */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 1, 
                        bgcolor: 'background.paper',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                          Number of People
                        </Typography>
                        {user.preferences.numberOfPeople !== undefined ? (
                          <Chip
                            label={user.preferences.numberOfPeople}
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 500 }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">Not set</Typography>
                        )}
                      </Box>
                      
                      {/* Cooking Time */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 1, 
                        bgcolor: 'background.paper',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                          Cooking Time
                        </Typography>
                        {user.preferences.cookingTime ? (
                          <Chip
                            label={user.preferences.cookingTime}
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 500 }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">Not set</Typography>
                        )}
                      </Box>
                      
                      {/* Cooking Method */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 1, 
                        bgcolor: 'background.paper',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                          Cooking Method
                        </Typography>
                        {user.preferences.cookingMethod ? (
                          <Chip
                            label={user.preferences.cookingMethod}
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 500 }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">Not set</Typography>
                        )}
                      </Box>
                      
                      {/* Health Goals */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 1, 
                        bgcolor: 'background.paper',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                          Health Goals
                        </Typography>
                        {Array.isArray(user.preferences.healthGoals) && user.preferences.healthGoals.length > 0 ? (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                            {user.preferences.healthGoals.map((item, index) => (
                              <Chip
                                key={index}
                                label={item}
                                size="small"
                                color="success"
                                sx={{ fontWeight: 500 }}
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">None</Typography>
                        )}
                      </Box>
                      
                      {/* Allergies */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 1, 
                        bgcolor: 'background.paper',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                          Allergies
                        </Typography>
                        {Array.isArray(user.preferences.allergies) && user.preferences.allergies.length > 0 ? (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                            {user.preferences.allergies.map((item, index) => (
                              <Chip
                                key={index}
                                label={item}
                                size="small"
                                color="secondary"
                                sx={{ fontWeight: 500 }}
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">None</Typography>
                        )}
                      </Box>
                    </Stack>
                  ) : (
                    <Alert 
                      severity="info" 
                      sx={{ 
                        borderRadius: 1,
                        '& .MuiAlert-message': { fontWeight: 500 }
                      }}
                    >
                      No preferences found for {user?.email}. Click Refresh to fetch your preferences.
                    </Alert>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Settings />}
                  onClick={handleEditPreferences}
                  sx={{ 
                    fontWeight: 500,
                    borderRadius: 1,
                    textTransform: 'none',
                    py: 1,
                    boxShadow: 2
                  }}
                >
                  Edit Preferences
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;
