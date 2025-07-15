import React, { useEffect } from 'react';
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
} from '@mui/material';
import {
  Restaurant,
  History,
  Settings,
  TrendingUp,
  AccessTime,
  LocalFireDepartment,
} from '@mui/icons-material';

// Hooks and Context
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useRecipes } from '../../contexts/RecipeContext';
import { useCart } from '../../contexts/CartContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user, getDietaryRestrictions, getHealthGoals, getDietType } = useUserPreferences();
  const { recipes, getRecommendations } = useRecipes();
  const { addRecipeToCart } = useCart();

  useEffect(() => {
    // Load recommendations if not already loaded
    if (user?.preferences && recipes.length === 0) {
      getRecommendations(user.preferences);
    }
  }, [user, recipes.length, getRecommendations]);

  const handleRecipeSelect = (recipe) => {
    addRecipeToCart(recipe);
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
  const dietaryRestrictions = getDietaryRestrictions();
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
                        onClick={() => handleRecipeSelect({ id: order.recipeId, name: order.recipeName })}
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
            <Card sx={{ position: 'sticky', top: 24 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                  <Settings color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Your Preferences
                  </Typography>
                </Stack>

                {/* Diet Type */}
                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Diet Type:
                  </Typography>
                  <Chip
                    label={dietType.charAt(0).toUpperCase() + dietType.slice(1)}
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Dietary Restrictions */}
                {dietaryRestrictions.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Dietary Restrictions:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {dietaryRestrictions.map((restriction) => (
                        <Chip
                          key={restriction}
                          label={restriction}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Health Goals */}
                {healthGoals.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Health Goals:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {healthGoals.map((goal) => (
                        <Chip
                          key={goal}
                          label={goal.replace('-', ' ')}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Settings />}
                  onClick={handleEditPreferences}
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
