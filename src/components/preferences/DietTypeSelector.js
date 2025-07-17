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
  Stack,
} from '@mui/material';
import {
  Restaurant,
  Nature,
  Egg,
} from '@mui/icons-material';
import { useUserPreferences } from '../../hooks/useUserPreferences';

const dietTypes = [
  {
    id: 'vegetarian',
    label: 'Vegetarian',
    description: 'Plant-based diet with dairy products',
    icon: <Nature />,
    color: 'success',
  },
  {
    id: 'non-vegetarian',
    label: 'Non Vegetarian',
    description: 'Includes meat, poultry, and fish',
    icon: <Restaurant />,
    color: 'primary',
  },
  {
    id: 'eggetarian',
    label: 'Eggetarian',
    description: 'Vegetarian diet that includes eggs',
    icon: <Egg />,
    color: 'warning',
  },
];

function DietTypeSelector({ selected, onChange, error }) {
  // Get diet type from context if not provided as prop
  const { getDietType, updatePreferenceField } = useUserPreferences();
  const contextDietType = getDietType();
  
  // Use prop if provided, otherwise use context value
  const [selectedDietType, setSelectedDietType] = useState(selected || contextDietType);

  // Update local state when prop changes
  useEffect(() => {
    if (selected) {
      setSelectedDietType(selected);
    }
  }, [selected]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedDietType(value);
    
    // Call prop onChange if provided
    if (onChange) {
      onChange(value);
    }
    
    // Always update context
    updatePreferenceField('dietType', value);
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Diet Type
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        Choose your dietary preference.
      </Typography>

      <RadioGroup value={selectedDietType} onChange={handleChange}>
        <Grid container spacing={3}>
          {dietTypes.map((diet) => (
            <Grid item xs={12} md={4} key={diet.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedDietType === diet.id ? 2 : 1,
                  borderColor: selectedDietType === diet.id ? `${diet.color}.main` : 'divider',
                  bgcolor: selectedDietType === diet.id ? `${diet.color}.50` : 'background.paper',
                }}
                onClick={() => {
                  setSelectedDietType(diet.id);
                  if (onChange) {
                    onChange(diet.id);
                  }
                  updatePreferenceField('dietType', diet.id);
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ color: `${diet.color}.main`, mb: 2, fontSize: '2rem' }}>
                    {diet.icon}
                  </Box>
                  <FormControlLabel
                    value={diet.id}
                    control={<Radio color={diet.color} />}
                    label={diet.label}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {diet.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
      
      {error && (
        <FormHelperText error sx={{ mt: 2, fontSize: '0.9rem' }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}

export default DietTypeSelector;