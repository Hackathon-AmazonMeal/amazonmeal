import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import {
  Restaurant,
  ShoppingCart,
  Person,
  Schedule,
  Favorite
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [weeklyStats] = useState({
    mealsPlanned: 12,
    recipesLiked: 8,
    shoppingListItems: 24
  });

  useEffect(() => {
    // Mock data for today's meals
    setTodaysMeals([
      { id: 1, name: 'Avocado Toast', type: 'Breakfast', time: '8:00 AM' },
      { id: 2, name: 'Grilled Chicken Salad', type: 'Lunch', time: '12:30 PM' },
      { id: 3, name: 'Salmon with Quinoa', type: 'Dinner', time: '7:00 PM' }
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Create Meal Plan',
      description: 'Generate AI-powered meal recommendations',
      icon: <Restaurant />,
      action: () => navigate('/meal-plans'),
      color: 'primary'
    },
    {
      title: 'Browse Recipes',
      description: 'Discover new recipes tailored to you',
      icon: <Favorite />,
      action: () => navigate('/recipes'),
      color: 'secondary'
    },
    {
      title: 'Shopping List',
      description: 'View and manage your shopping list',
      icon: <ShoppingCart />,
      action: () => navigate('/shopping-list'),
      color: 'success'
    },
    {
      title: 'Profile Settings',
      description: 'Update preferences and dietary restrictions',
      icon: <Person />,
      action: () => navigate('/profile'),
      color: 'info'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {currentUser?.name || 'Food Lover'}! 👋
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Ready to plan some delicious meals today?
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6">{weeklyStats.mealsPlanned}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Meals This Week
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Favorite />
                </Avatar>
                <Box>
                  <Typography variant="h6">{weeklyStats.recipesLiked}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Recipes Liked
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <ShoppingCart />
                </Avatar>
                <Box>
                  <Typography variant="h6">{weeklyStats.shoppingListItems}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Shopping Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Today's Meals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Meal Plan
              </Typography>
              {todaysMeals.map((meal) => (
                <Box key={meal.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">{meal.name}</Typography>
                      <Chip label={meal.type} size="small" color="primary" />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {meal.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/meal-plans')}>
                View Full Plan
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={action.action}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: `${action.color}.main`, mr: 2, width: 32, height: 32 }}>
                        {action.icon}
                      </Avatar>
                      <Typography variant="subtitle1">
                        {action.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
