import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  FormHelperText,
  Alert,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

// Mock data - in a real app, this would come from an API
const allergies = [
  {
    id: 'nuts',
    label: 'Tree Nuts',
    description: 'Almonds, walnuts, cashews, etc.',
    severity: 'high',
  },
  {
    id: 'peanuts',
    label: 'Peanuts',
    description: 'Peanuts and peanut products',
    severity: 'high',
  },
  {
    id: 'dairy',
    label: 'Dairy',
    description: 'Milk, cheese, yogurt, butter',
    severity: 'medium',
  },
  {
    id: 'eggs',
    label: 'Eggs',
    description: 'Chicken eggs and egg products',
    severity: 'medium',
  },
  {
    id: 'soy',
    label: 'Soy',
    description: 'Soybeans and soy products',
    severity: 'medium',
  },
  {
    id: 'shellfish',
    label: 'Shellfish',
    description: 'Shrimp, crab, lobster, etc.',
    severity: 'high',
  },
  {
    id: 'fish',
    label: 'Fish',
    description: 'All types of fish',
    severity: 'high',
  },
  {
    id: 'wheat',
    label: 'Wheat',
    description: 'Wheat and wheat products',
    severity: 'medium',
  },
  {
    id: 'sesame',
    label: 'Sesame',
    description: 'Sesame seeds and tahini',
    severity: 'medium',
  },
];

function AllergySelector({ selected = [], onChange, error }) {
  const [selectedAllergies, setSelectedAllergies] = useState(selected);

  useEffect(() => {
    setSelectedAllergies(selected);
  }, [selected]);

  const handleToggle = (allergyId) => {
    const newSelected = selectedAllergies.includes(allergyId)
      ? selectedAllergies.filter(id => id !== allergyId)
      : [...selectedAllergies, allergyId];
    
    setSelectedAllergies(newSelected);
    onChange(newSelected);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600, mb: 2 }}
      >
        Food Allergies
      </Typography>
      
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, lineHeight: 1.6 }}
      >
        Please select any food allergies you have. We'll carefully filter out recipes containing these ingredients to keep you safe.
      </Typography>

      {selectedAllergies.length > 0 && (
        <Alert 
          severity="warning" 
          icon={<Warning />}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2">
            <strong>Important:</strong> Always double-check ingredient lists and consult with healthcare providers for severe allergies. This tool is meant to assist but not replace professional medical advice.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2}>
        {allergies.map((allergy) => (
          <Grid item xs={12} sm={6} md={4} key={allergy.id}>
            <Box>
              <Chip
                label={allergy.label}
                onClick={() => handleToggle(allergy.id)}
                color={selectedAllergies.includes(allergy.id) ? getSeverityColor(allergy.severity) : 'default'}
                variant={selectedAllergies.includes(allergy.id) ? 'filled' : 'outlined'}
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
                {allergy.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {selectedAllergies.length > 0 && (
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selected allergies:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedAllergies.map((allergyId) => {
              const allergy = allergies.find(a => a.id === allergyId);
              return (
                <Chip
                  key={allergyId}
                  label={allergy?.label}
                  size="small"
                  color={getSeverityColor(allergy?.severity)}
                  onDelete={() => handleToggle(allergyId)}
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
          💡 Tip: If you don't have any food allergies, you can skip this step and continue.
        </Typography>
      </Box>
    </Box>
  );
}

export default AllergySelector;
