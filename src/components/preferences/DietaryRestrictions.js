import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  FormHelperText,
} from '@mui/material';

// Mock data - in a real app, this would come from an API
const dietaryRestrictions = [
  {
    id: 'vegetarian',
    label: 'Vegetarian',
    description: 'No meat, poultry, or fish',
  },
  {
    id: 'vegan',
    label: 'Vegan',
    description: 'No animal products',
  },
  {
    id: 'gluten-free',
    label: 'Gluten-Free',
    description: 'No wheat, barley, rye, or gluten',
  },
  {
    id: 'dairy-free',
    label: 'Dairy-Free',
    description: 'No milk, cheese, or dairy products',
  },
  {
    id: 'keto',
    label: 'Ketogenic',
    description: 'Very low carb, high fat',
  },
  {
    id: 'paleo',
    label: 'Paleo',
    description: 'No grains, legumes, or processed foods',
  },
  {
    id: 'low-sodium',
    label: 'Low Sodium',
    description: 'Reduced salt content',
  },
  {
    id: 'low-carb',
    label: 'Low Carb',
    description: 'Reduced carbohydrate content',
  },
];

function DietaryRestrictions({ selected = [], onChange, error }) {
  const [selectedRestrictions, setSelectedRestrictions] = useState(selected);

  useEffect(() => {
    setSelectedRestrictions(selected);
  }, [selected]);

  const handleToggle = (restrictionId) => {
    const newSelected = selectedRestrictions.includes(restrictionId)
      ? selectedRestrictions.filter(id => id !== restrictionId)
      : [...selectedRestrictions, restrictionId];
    
    setSelectedRestrictions(newSelected);
    onChange(newSelected);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600, mb: 2 }}
      >
        Dietary Restrictions
      </Typography>
      
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, lineHeight: 1.6 }}
      >
        Select any dietary restrictions that apply to you. We'll make sure to only recommend recipes that fit your needs. You can skip this step if you don't have any restrictions.
      </Typography>

      <Grid container spacing={2}>
        {dietaryRestrictions.map((restriction) => (
          <Grid item xs={12} sm={6} md={4} key={restriction.id}>
            <Box>
              <Chip
                label={restriction.label}
                onClick={() => handleToggle(restriction.id)}
                color={selectedRestrictions.includes(restriction.id) ? 'primary' : 'default'}
                variant={selectedRestrictions.includes(restriction.id) ? 'filled' : 'outlined'}
                sx={{
                  width: '100%',
                  height: 'auto',
                  py: 2,
                  px: 1,
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                  '& .MuiChip-label': {
                    whiteSpace: 'normal',
                    textAlign: 'center',
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: 1,
                  px: 1,
                  lineHeight: 1.3,
                }}
              >
                {restriction.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {selectedRestrictions.length > 0 && (
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selected restrictions:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedRestrictions.map((restrictionId) => {
              const restriction = dietaryRestrictions.find(r => r.id === restrictionId);
              return (
                <Chip
                  key={restrictionId}
                  label={restriction?.label}
                  size="small"
                  color="primary"
                  onDelete={() => handleToggle(restrictionId)}
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

      <Box mt={3}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          💡 Tip: You can always update these preferences later from your dashboard.
        </Typography>
      </Box>
    </Box>
  );
}

export default DietaryRestrictions;
