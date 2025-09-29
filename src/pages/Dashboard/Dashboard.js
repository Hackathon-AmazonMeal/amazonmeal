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
    <Box sx={{ minHeight: '100vh', bgcolor: '#EAEDED' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Welcome Header */}
        <Box mb={3}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ 
              fontWeight: 400, 
              fontSize: '28px',
              color: '#0F1111',
              mb: 1
            }}
          >
            Welcome Back!
          </Typography>
          <Typography variant="h6" sx={{ color: '#565959', fontSize: '14px', fontWeight: 400 }}>
            Here's your personalized recipe dashboard
          </Typography>
        </Box>

        {/* Error Alert */}
        {cartError && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '4px',
              border: '1px solid #F5C6CB',
              backgroundColor: '#F8D7DA',
              color: '#721C24',
              fontSize: '13px'
            }}
            onClose={clearError}
          >
            {cartError}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {/* Quick Stats */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Restaurant sx={{ color: '#FF9900', fontSize: 32, mb: 1 }} />
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700, 
                      mb: 0.5,
                      color: '#0F1111',
                      fontSize: '24px'
                    }}>
                      {recipes.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>
                      Personalized Recipes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <History sx={{ color: '#067D62', fontSize: 32, mb: 1 }} />
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700, 
                      mb: 0.5,
                      color: '#0F1111',
                      fontSize: '24px'
                    }}>
                      {orderHistory.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>
                      Orders Placed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <TrendingUp sx={{ color: '#F79400', fontSize: 32, mb: 1 }} />
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700, 
                      mb: 0.5,
                      color: '#0F1111',
                      fontSize: '24px'
                    }}>
                      {healthGoals.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>
                      Health Goals
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Recipes */}
            <Card sx={{ 
              mb: 3,
              border: '1px solid #D5D9D9',
              borderRadius: '8px',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ p: 2 }}>
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: '#0F1111',
                    fontSize: '18px'
                  }}>
                    Your Recipe Recommendations
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={handleViewAllRecipes}
                    sx={{
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#0F1111',
                      borderColor: '#D5D9D9',
                      '&:hover': {
                        borderColor: '#879196',
                        backgroundColor: '#F7F8F8',
                      },
                    }}
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
                            transition: 'all 0.2s ease',
                            border: '1px solid #D5D9D9',
                            borderRadius: '8px',
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            },
                          }}
                          onClick={() => handleRecipeSelect(recipe)}
                        >
                          <CardMedia
                            component="img"
                            height="120"
                            image={recipe.image}
                            alt={recipe.name}
                          />
                          <CardContent sx={{ p: 1.5 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 400,
                                fontSize: '14px',
                                color: '#0F1111',
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
                                <AccessTime sx={{ fontSize: 14, color: '#565959' }} />
                                <Typography variant="caption" sx={{ fontSize: '11px', color: '#565959' }}>
                                  {recipe.prepTime + recipe.cookTime}m
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <LocalFireDepartment sx={{ fontSize: 14, color: '#565959' }} />
                                <Typography variant="caption" sx={{ fontSize: '11px', color: '#565959' }}>
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
                                  sx={{ 
                                    fontSize: '10px',
                                    height: '20px',
                                    backgroundColor: '#F0F2F2',
                                    color: '#0F1111',
                                    border: '1px solid #D5D9D9',
                                    borderRadius: '4px'
                                  }}
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert 
                    severity="info"
                    sx={{
                      backgroundColor: '#D1ECF1',
                      border: '1px solid #B8DAFF',
                      color: '#0C5460',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  >
                    No recipes loaded yet. Your personalized recommendations will appear here.
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Order History */}
            {orderHistory.length > 0 && (
              <Card sx={{ 
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                boxShadow: 'none'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    color: '#0F1111',
                    fontSize: '18px'
                  }}>
                    Recent Orders
                  </Typography>
                  <Stack spacing={1}>
                    {orderHistory.slice(0, 3).map((order) => (
                      <Box
                        key={order.id}
                        sx={{
                          p: 2,
                          border: '1px solid #D5D9D9',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          backgroundColor: '#FFFFFF',
                          '&:hover': {
                            backgroundColor: '#F7F8F8',
                          },
                        }}
                        onClick={() => handleOrderSelect(order)}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="subtitle1" sx={{ 
                              fontWeight: 400,
                              fontSize: '14px',
                              color: '#0F1111'
                            }}>
                              {order.recipeName}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#565959',
                              fontSize: '12px'
                            }}>
                              {order.totalItems} items • <span style={{ color: '#B12704', fontWeight: 700 }}>${order.estimatedTotal?.toFixed(2)}</span>
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ 
                            color: '#565959',
                            fontSize: '11px'
                          }}>
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
              border: '1px solid #D5D9D9',
              borderRadius: '8px',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Settings sx={{ color: '#FF9900', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700,
                      color: '#0F1111',
                      fontSize: '16px'
                    }}>
                      Your Preferences
                    </Typography>
                  </Stack>
                  <Button 
                    size="small" 
                    startIcon={<Refresh />} 
                    onClick={fetchUserPreferences}
                    disabled={preferencesLoading}
                    sx={{ 
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#0F1111',
                      borderColor: '#D5D9D9',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#F7F8F8',
                      },
                    }}
                  >
                    Refresh
                  </Button>
                </Stack>

                {/* API Preferences */}
                <Box mb={2}>
                  {preferencesLoading ? (
                    <Box display="flex" justifyContent="center" my={2}>
                      <CircularProgress size={20} />
                    </Box>
                  ) : user?.preferences ? (
                    <Stack spacing={1.5}>
                      {/* Diet Type */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '4px', 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D5D9D9'
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: '#FF9900', 
                          fontWeight: 700, 
                          mb: 0.5,
                          fontSize: '12px'
                        }}>
                          Diet Type
                        </Typography>
                        {user.preferences.dietType ? (
                          <Chip
                            label={user.preferences.dietType}
                            size="small"
                            sx={{ 
                              backgroundColor: '#F0F2F2',
                              color: '#0F1111',
                              fontSize: '11px',
                              height: '20px',
                              border: '1px solid #D5D9D9'
                            }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>Not set</Typography>
                        )}
                      </Box>
                      
                      {/* Meal Type */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '4px', 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D5D9D9'
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: '#FF9900', 
                          fontWeight: 700, 
                          mb: 0.5,
                          fontSize: '12px'
                        }}>
                          Meal Type
                        </Typography>
                        {user.preferences.mealType ? (
                          <Chip
                            label={user.preferences.mealType}
                            size="small"
                            sx={{ 
                              backgroundColor: '#F0F2F2',
                              color: '#0F1111',
                              fontSize: '11px',
                              height: '20px',
                              border: '1px solid #D5D9D9'
                            }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>Not set</Typography>
                        )}
                      </Box>
                      
                      {/* Number of People */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '4px', 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D5D9D9'
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: '#FF9900', 
                          fontWeight: 700, 
                          mb: 0.5,
                          fontSize: '12px'
                        }}>
                          Number of People
                        </Typography>
                        {user.preferences.numberOfPeople !== undefined ? (
                          <Chip
                            label={user.preferences.numberOfPeople}
                            size="small"
                            sx={{ 
                              backgroundColor: '#F0F2F2',
                              color: '#0F1111',
                              fontSize: '11px',
                              height: '20px',
                              border: '1px solid #D5D9D9'
                            }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>Not set</Typography>
                        )}
                      </Box>
                      
                      {/* Cooking Time */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '4px', 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D5D9D9'
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: '#FF9900', 
                          fontWeight: 700, 
                          mb: 0.5,
                          fontSize: '12px'
                        }}>
                          Cooking Time
                        </Typography>
                        {user.preferences.cookingTime ? (
                          <Chip
                            label={user.preferences.cookingTime}
                            size="small"
                            sx={{ 
                              backgroundColor: '#F0F2F2',
                              color: '#0F1111',
                              fontSize: '11px',
                              height: '20px',
                              border: '1px solid #D5D9D9'
                            }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>Not set</Typography>
                        )}
                      </Box>
                      
                      {/* Cooking Method */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '4px', 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D5D9D9'
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: '#FF9900', 
                          fontWeight: 700, 
                          mb: 0.5,
                          fontSize: '12px'
                        }}>
                          Cooking Method
                        </Typography>
                        {user.preferences.cookingMethod ? (
                          <Chip
                            label={user.preferences.cookingMethod}
                            size="small"
                            sx={{ 
                              backgroundColor: '#F0F2F2',
                              color: '#0F1111',
                              fontSize: '11px',
                              height: '20px',
                              border: '1px solid #D5D9D9'
                            }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>Not set</Typography>
                        )}
                      </Box>
                      
                      {/* Health Goals */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '4px', 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D5D9D9'
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: '#FF9900', 
                          fontWeight: 700, 
                          mb: 0.5,
                          fontSize: '12px'
                        }}>
                          Health Goals
                        </Typography>
                        {Array.isArray(user.preferences.healthGoals) && user.preferences.healthGoals.length > 0 ? (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                            {user.preferences.healthGoals.map((item, index) => (
                              <Chip
                                key={index}
                                label={item}
                                size="small"
                                sx={{ 
                                  backgroundColor: '#D4EDDA',
                                  color: '#155724',
                                  fontSize: '10px',
                                  height: '18px',
                                  border: '1px solid #C3E6CB'
                                }}
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>None</Typography>
                        )}
                      </Box>
                      
                      {/* Allergies */}
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '4px', 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D5D9D9'
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: '#FF9900', 
                          fontWeight: 700, 
                          mb: 0.5,
                          fontSize: '12px'
                        }}>
                          Allergies
                        </Typography>
                        {Array.isArray(user.preferences.allergies) && user.preferences.allergies.length > 0 ? (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                            {user.preferences.allergies.map((item, index) => (
                              <Chip
                                key={index}
                                label={item}
                                size="small"
                                sx={{ 
                                  backgroundColor: '#F8D7DA',
                                  color: '#721C24',
                                  fontSize: '10px',
                                  height: '18px',
                                  border: '1px solid #F5C6CB'
                                }}
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>None</Typography>
                        )}
                      </Box>
                    </Stack>
                  ) : (
                    <Alert 
                      severity="info" 
                      sx={{ 
                        backgroundColor: '#D1ECF1',
                        border: '1px solid #B8DAFF',
                        color: '#0C5460',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      No preferences found for {user?.email}. Click Refresh to fetch your preferences.
                    </Alert>
                  )}
                </Box>

                <Divider sx={{ my: 2, borderColor: '#D5D9D9' }} />

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Settings />}
                  onClick={handleEditPreferences}
                  sx={{ 
                    fontWeight: 400,
                    fontSize: '13px',
                    textTransform: 'none',
                    py: 1,
                    minHeight: '29px'
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
