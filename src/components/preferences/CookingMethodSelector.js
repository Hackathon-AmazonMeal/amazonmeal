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
  Whatshot,
  Kitchen,
  OutdoorGrill,
  Microwave,
} from '@mui/icons-material';

const cookingMethods = [
  {
    id: 'stovetop',
    label: 'Stovetop',
    icon: <Whatshot />,
    color: 'error',
  },
  {
    id: 'oven',
    label: 'Oven',
    icon: <Kitchen />,
    color: 'primary',
  },
  {
    id: 'grill',
    label: 'Grill',
    icon: <OutdoorGrill />,
    color: 'success',
  },
  {
    id: 'microwave',
    label: 'Microwave',
    icon: <Microwave />,
    color: 'info',
  },
  {
    id: 'air-fryer',
    label: 'Air Fryer',
    icon: <Kitchen />,
    color: 'secondary',
  },
  {
    id: 'slow-cook',
    label: 'Slow Cook',
    icon: <Kitchen />,
    color: 'warning',
  },
  {
    id: 'steaming',
    label: 'Steaming',
    icon: <Kitchen />,
    color: 'info',
  },
];

function CookingMethodSelector({ selected = 'stovetop', onChange, error }) {
  const [selectedMethod, setSelectedMethod] = useState(selected);

  useEffect(() => {
    setSelectedMethod(selected);
  }, [selected]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedMethod(value);
    onChange(value);
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Cooking Method
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        What's your preferred cooking method?
      </Typography>

      <RadioGroup value={selectedMethod} onChange={handleChange}>
        <Grid container spacing={2}>
          {cookingMethods.map((method) => (
            <Grid item xs={6} sm={4} md={3} key={method.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedMethod === method.id ? 2 : 1,
                  borderColor: selectedMethod === method.id ? `${method.color}.main` : 'divider',
                  bgcolor: selectedMethod === method.id ? `${method.color}.50` : 'background.paper',
                }}
                onClick={() => {
                  setSelectedMethod(method.id);
                  onChange(method.id);
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ color: `${method.color}.main`, mb: 2, fontSize: '2rem' }}>
                    {method.icon}
                  </Box>
                  <FormControlLabel
                    value={method.id}
                    control={<Radio color={method.color} />}
                    label={method.label}
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

export default CookingMethodSelector;