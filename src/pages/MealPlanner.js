import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, Box } from '@mui/material';

const MealPlanner = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateMealPlan = async () => {
    setLoading(true);
    // Mock meal plan generation
    setTimeout(() => {
      const mockMealPlan = {
        name: 'Weekly Meal Plan',
        meals: [
          { day: 1, mealType: 'BREAKFAST', recipeName: 'Oatmeal with Berries' },
          { day: 1, mealType: 'LUNCH', recipeName: 'Vegetarian Pasta' },
          { day: 1, mealType: 'DINNER', recipeName: 'Grilled Chicken' },
          { day: 2, mealType: 'BREAKFAST', recipeName: 'Smoothie Bowl' },
          { day: 2, mealType: 'LUNCH', recipeName: 'Caesar Salad' },
          { day: 2, mealType: 'DINNER', recipeName: 'Fish Tacos' },
        ]
      };
      setMealPlan(mockMealPlan);
      setLoading(false);
    }, 2000);
  };

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Meal Planner
      </Typography>
      
      {!mealPlan ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Generate your personalized meal plan
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={generateMealPlan}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Meal Plan'}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6, 7].map(day => (
            <Grid item xs={12} md={6} lg={4} key={day}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {dayNames[day - 1]}
                  </Typography>
                  {['BREAKFAST', 'LUNCH', 'DINNER'].map(mealType => {
                    const meal = mealPlan.meals.find(m => m.day === day && m.mealType === mealType);
                    return (
                      <Box key={mealType} sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" color="primary">
                          {mealType}
                        </Typography>
                        <Typography variant="body2">
                          {meal ? meal.recipeName : 'No meal planned'}
                        </Typography>
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MealPlanner;