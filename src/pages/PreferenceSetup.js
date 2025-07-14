import React, { useState } from 'react';
import { Container, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Chip, Box, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PreferenceSetup = () => {
  const { updatePreferences } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [],
    allergies: [],
    cuisinePreferences: [],
    goal: ''
  });

  const handleSubmit = () => {
    updatePreferences(preferences);
    navigate('/recipes');
  };

  const handleChipToggle = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Tell us about your preferences
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Dietary Restrictions</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['VEGETARIAN', 'VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE', 'KETO', 'PALEO'].map(restriction => (
              <Chip
                key={restriction}
                label={restriction.replace('_', ' ')}
                clickable
                color={preferences.dietaryRestrictions.includes(restriction) ? 'primary' : 'default'}
                onClick={() => handleChipToggle('dietaryRestrictions', restriction)}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Allergies</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['NUTS', 'SHELLFISH', 'EGGS', 'SOY', 'FISH', 'MILK'].map(allergy => (
              <Chip
                key={allergy}
                label={allergy}
                clickable
                color={preferences.allergies.includes(allergy) ? 'secondary' : 'default'}
                onClick={() => handleChipToggle('allergies', allergy)}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Cuisine Preferences</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['ITALIAN', 'MEXICAN', 'ASIAN', 'AMERICAN', 'MEDITERRANEAN', 'INDIAN'].map(cuisine => (
              <Chip
                key={cuisine}
                label={cuisine}
                clickable
                color={preferences.cuisinePreferences.includes(cuisine) ? 'primary' : 'default'}
                onClick={() => handleChipToggle('cuisinePreferences', cuisine)}
              />
            ))}
          </Box>
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Health Goal</InputLabel>
          <Select
            value={preferences.goal}
            onChange={(e) => setPreferences(prev => ({ ...prev, goal: e.target.value }))}
          >
            <MenuItem value="WEIGHT_LOSS">Weight Loss</MenuItem>
            <MenuItem value="MUSCLE_GAIN">Muscle Gain</MenuItem>
            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
            <MenuItem value="GENERAL_HEALTH">General Health</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          fullWidth 
          size="large"
          onClick={handleSubmit}
          disabled={!preferences.goal}
        >
          Generate My Recipes
        </Button>
      </Paper>
    </Container>
  );
};

export default PreferenceSetup;