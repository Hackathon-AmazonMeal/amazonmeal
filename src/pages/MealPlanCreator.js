import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Chip
} from '@mui/material';

const MealPlanCreator = () => {
  const [mealPlan, setMealPlan] = useState([]);

  const generateMealPlan = () => {
    const mockPlan = [
      { day: 'Monday', breakfast: 'Oatmeal', lunch: 'Salad', dinner: 'Pasta' },
      { day: 'Tuesday', breakfast: 'Toast', lunch: 'Soup', dinner: 'Chicken' },
      { day: 'Wednesday', breakfast: 'Yogurt', lunch: 'Sandwich', dinner: 'Fish' }
    ];
    setMealPlan(mockPlan);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Meal Plan Creator
      </Typography>
      
      <Button variant="contained" onClick={generateMealPlan} sx={{ mb: 3 }}>
        Generate AI Meal Plan
      </Button>

      <Grid container spacing={3}>
        {mealPlan.map((day, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {day.day}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip label="Breakfast" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">{day.breakfast}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Chip label="Lunch" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">{day.lunch}</Typography>
                </Box>
                <Box>
                  <Chip label="Dinner" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">{day.dinner}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MealPlanCreator;
