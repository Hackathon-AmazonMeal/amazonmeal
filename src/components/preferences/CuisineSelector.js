import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  FormHelperText,
} from '@mui/material';

const cuisines = [
  { id: 'american', label: 'American' },
  { id: 'asian', label: 'Asian' },
  { id: 'italian', label: 'Italian' },
  { id: 'mediterranean', label: 'Mediterranean' },
  { id: 'mexican', label: 'Mexican' },
  { id: 'indian', label: 'Indian' },
  { id: 'french', label: 'French' },
  { id: 'thai', label: 'Thai' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'japanese', label: 'Japanese' },
  { id: 'greek', label: 'Greek' },
  { id: 'middle-eastern', label: 'Middle Eastern' },
];

function CuisineSelector({ selected = [], onChange, error }) {
  const [selectedCuisines, setSelectedCuisines] = useState(selected);

  useEffect(() => {
    setSelectedCuisines(selected);
  }, [selected]);

  const handleToggle = (cuisineId) => {
    const newSelected = selectedCuisines.includes(cuisineId)
      ? selectedCuisines.filter(id => id !== cuisineId)
      : [...selectedCuisines, cuisineId];
    
    setSelectedCuisines(newSelected);
    onChange(newSelected);
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Cuisine Preferences
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        Which cuisines do you enjoy? Select all that appeal to you.
      </Typography>

      <Grid container spacing={2}>
        {cuisines.map((cuisine) => (
          <Grid item xs={6} sm={4} md={3} key={cuisine.id}>
            <Chip
              label={cuisine.label}
              onClick={() => handleToggle(cuisine.id)}
              color={selectedCuisines.includes(cuisine.id) ? 'primary' : 'default'}
              variant={selectedCuisines.includes(cuisine.id) ? 'filled' : 'outlined'}
              sx={{
                width: '100%',
                py: 2,
                fontSize: '1rem',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            />
          </Grid>
        ))}
      </Grid>

      {selectedCuisines.length > 0 && (
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selected cuisines ({selectedCuisines.length}):
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedCuisines.map((cuisineId) => {
              const cuisine = cuisines.find(c => c.id === cuisineId);
              return (
                <Chip
                  key={cuisineId}
                  label={cuisine?.label}
                  size="small"
                  color="primary"
                  onDelete={() => handleToggle(cuisineId)}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {error && (
        <FormHelperText error sx={{ mt: 2, fontSize: '1rem' }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}

export default CuisineSelector;