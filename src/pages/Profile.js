import React, { useState } from 'react';
import { Container, Typography, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Box, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState(currentUser?.preferences || {
    dietaryRestrictions: [],
    allergies: [],
    cuisinePreferences: [],
    cookingTimePreference: 'MEDIUM',
    skillLevel: 'INTERMEDIATE'
  });

  const handleSave = () => {
    // console.log('Saving preferences:', preferences);
    // In a real app, this would call an API to update user preferences
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <TextField
          fullWidth
          label="Username"
          value={currentUser?.username || ''}
          margin="normal"
          disabled
        />
        <TextField
          fullWidth
          label="Email"
          value={currentUser?.email || ''}
          margin="normal"
          disabled
        />
        
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Dietary Preferences
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Dietary Restrictions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['VEGETARIAN', 'VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE'].map(restriction => (
              <Chip
                key={restriction}
                label={restriction.replace('_', ' ')}
                clickable
                color={preferences.dietaryRestrictions?.includes(restriction) ? 'primary' : 'default'}
                onClick={() => {
                  const current = preferences.dietaryRestrictions || [];
                  const updated = current.includes(restriction)
                    ? current.filter(r => r !== restriction)
                    : [...current, restriction];
                  setPreferences(prev => ({ ...prev, dietaryRestrictions: updated }));
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Cuisine Preferences
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['ITALIAN', 'MEXICAN', 'ASIAN', 'AMERICAN', 'MEDITERRANEAN'].map(cuisine => (
              <Chip
                key={cuisine}
                label={cuisine}
                clickable
                color={preferences.cuisinePreferences?.includes(cuisine) ? 'primary' : 'default'}
                onClick={() => {
                  const current = preferences.cuisinePreferences || [];
                  const updated = current.includes(cuisine)
                    ? current.filter(c => c !== cuisine)
                    : [...current, cuisine];
                  setPreferences(prev => ({ ...prev, cuisinePreferences: updated }));
                }}
              />
            ))}
          </Box>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Cooking Time Preference</InputLabel>
          <Select
            value={preferences.cookingTimePreference || 'MEDIUM'}
            onChange={(e) => setPreferences(prev => ({ ...prev, cookingTimePreference: e.target.value }))}
          >
            <MenuItem value="QUICK">Quick (Under 30 min)</MenuItem>
            <MenuItem value="MEDIUM">Medium (30-60 min)</MenuItem>
            <MenuItem value="LENGTHY">Lengthy (Over 60 min)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Skill Level</InputLabel>
          <Select
            value={preferences.skillLevel || 'INTERMEDIATE'}
            onChange={(e) => setPreferences(prev => ({ ...prev, skillLevel: e.target.value }))}
          >
            <MenuItem value="BEGINNER">Beginner</MenuItem>
            <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
            <MenuItem value="ADVANCED">Advanced</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSave}>
          Save Preferences
        </Button>
      </Paper>
    </Container>
  );
};

export default Profile;