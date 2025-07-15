import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import {
  WbSunny,
  Restaurant,
  NightsStay,
} from '@mui/icons-material';

const mealTypes = [
  {
    id: 'breakfast',
    label: 'Breakfast',
    icon: <WbSunny />,
    color: 'warning',
  },
  {
    id: 'lunch',
    label: 'Lunch',
    icon: <Restaurant />,
    color: 'primary',
  },
  {
    id: 'dinner',
    label: 'Dinner',
    icon: <NightsStay />,
    color: 'info',
  },
];

function MealTypeSelector({ selected = 'dinner', onChange, error }) {
  const [selectedMealType, setSelectedMealType] = useState(selected);

  useEffect(() => {
    setSelectedMealType(selected);
  }, [selected]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedMealType(value);
    onChange(value);
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Meal Type
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        Which meal are you primarily planning for?
      </Typography>

      <RadioGroup value={selectedMealType} onChange={handleChange}>
        <Grid container spacing={3}>
          {mealTypes.map((meal) => (
            <Grid item xs={12} md={4} key={meal.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedMealType === meal.id ? 2 : 1,
                  borderColor: selectedMealType === meal.id ? `${meal.color}.main` : 'divider',
                  bgcolor: selectedMealType === meal.id ? `${meal.color}.50` : 'background.paper',
                }}
                onClick={() => {
                  setSelectedMealType(meal.id);
                  onChange(meal.id);
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ color: `${meal.color}.main`, mb: 2, fontSize: '2rem' }}>
                    {meal.icon}
                  </Box>
                  <FormControlLabel
                    value={meal.id}
                    control={<Radio color={meal.color} />}
                    label={meal.label}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      {error && (
        <FormHelperText error sx={{ mt: 2, fontSize: '1rem' }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}

export default MealTypeSelector;