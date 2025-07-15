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
  Speed,
  Schedule,
  AccessTime,
} from '@mui/icons-material';

const cookingTimes = [
  {
    id: 'quick',
    label: 'Quick (Under 30 min)',
    description: 'Fast meals for busy schedules',
    icon: <Speed />,
    color: 'success',
  },
  {
    id: 'medium',
    label: 'Medium (30-60 min)',
    description: 'Balanced cooking time',
    icon: <Schedule />,
    color: 'primary',
  },
  {
    id: 'any',
    label: 'Any Time',
    description: 'No time restrictions',
    icon: <AccessTime />,
    color: 'info',
  },
];

function CookingTimeSelector({ selected = 'medium', onChange, error }) {
  const [selectedTime, setSelectedTime] = useState(selected);

  useEffect(() => {
    setSelectedTime(selected);
  }, [selected]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedTime(value);
    onChange(value);
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Cooking Time Preference
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        How much time do you typically have for cooking?
      </Typography>

      <RadioGroup value={selectedTime} onChange={handleChange}>
        <Grid container spacing={3}>
          {cookingTimes.map((time) => (
            <Grid item xs={12} md={4} key={time.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedTime === time.id ? 2 : 1,
                  borderColor: selectedTime === time.id ? `${time.color}.main` : 'divider',
                  bgcolor: selectedTime === time.id ? `${time.color}.50` : 'background.paper',
                }}
                onClick={() => {
                  setSelectedTime(time.id);
                  onChange(time.id);
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ color: `${time.color}.main`, mb: 2 }}>
                    {time.icon}
                  </Box>
                  <FormControlLabel
                    value={time.id}
                    control={<Radio color={time.color} />}
                    label={time.label}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {time.description}
                  </Typography>
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

export default CookingTimeSelector;