import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  FormHelperText,
} from '@mui/material';
import {
  Speed,
  Schedule,
  AccessTime,
} from '@mui/icons-material';

function CookingTimeToggle({ selected = 'medium', onChange, error }) {
  const [cookingTime, setCookingTime] = useState(selected);

  useEffect(() => {
    setCookingTime(selected);
  }, [selected]);

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setCookingTime(newValue);
      onChange(newValue);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Cooking Time
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        How much time do you typically have for cooking?
      </Typography>

      <Box display="flex" justifyContent="center">
        <ToggleButtonGroup
          value={cookingTime}
          exclusive
          onChange={handleChange}
          size="large"
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        >
          <ToggleButton value="quick" sx={{ px: 4, py: 2 }}>
            <Speed sx={{ mr: 1 }} />
            Quick (Under 30 min)
          </ToggleButton>
          <ToggleButton value="medium" sx={{ px: 4, py: 2 }}>
            <Schedule sx={{ mr: 1 }} />
            Medium (30-60 min)
          </ToggleButton>
          <ToggleButton value="any" sx={{ px: 4, py: 2 }}>
            <AccessTime sx={{ mr: 1 }} />
            Any Time
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {error && (
        <FormHelperText error sx={{ mt: 2, fontSize: '1rem', textAlign: 'center' }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}

export default CookingTimeToggle;