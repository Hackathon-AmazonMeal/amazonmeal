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
  LinearProgress,
} from '@mui/material';
import {
  Balance,
  FitnessCenter,
  TrendingDown,
  Public,
  Nature,
} from '@mui/icons-material';

// Mock data - in a real app, this would come from an API
const dietTypes = [
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Well-rounded nutrition with all food groups',
    icon: <Balance />,
    macros: {
      carbs: 45,
      protein: 25,
      fat: 30,
    },
    color: 'primary',
    benefits: ['Sustainable long-term', 'Includes all nutrients', 'Easy to follow'],
  },
  {
    id: 'high-protein',
    label: 'High Protein',
    description: 'Emphasis on protein-rich foods',
    icon: <FitnessCenter />,
    macros: {
      carbs: 30,
      protein: 40,
      fat: 30,
    },
    color: 'success',
    benefits: ['Muscle building', 'Increased satiety', 'Better recovery'],
  },
  {
    id: 'low-carb',
    label: 'Low Carb',
    description: 'Reduced carbohydrate intake',
    icon: <TrendingDown />,
    macros: {
      carbs: 20,
      protein: 35,
      fat: 45,
    },
    color: 'warning',
    benefits: ['Weight management', 'Stable blood sugar', 'Reduced cravings'],
  },
  {
    id: 'mediterranean',
    label: 'Mediterranean',
    description: 'Mediterranean-style eating pattern',
    icon: <Public />,
    macros: {
      carbs: 40,
      protein: 20,
      fat: 40,
    },
    color: 'info',
    benefits: ['Heart healthy', 'Anti-inflammatory', 'Rich in antioxidants'],
  },
  {
    id: 'plant-based',
    label: 'Plant-Based',
    description: 'Focus on plant foods',
    icon: <Nature />,
    macros: {
      carbs: 55,
      protein: 15,
      fat: 30,
    },
    color: 'success',
    benefits: ['Environmentally friendly', 'High fiber', 'Lower disease risk'],
  },
];

function DietTypeSelector({ selected = 'balanced', onChange, error }) {
  const [selectedDietType, setSelectedDietType] = useState(selected);

  useEffect(() => {
    setSelectedDietType(selected);
  }, [selected]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedDietType(value);
    onChange(value);
  };

  const selectedDiet = dietTypes.find(diet => diet.id === selectedDietType);

  return (
    <Box>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600, mb: 2 }}
      >
        Diet Type
      </Typography>
      
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, lineHeight: 1.6 }}
      >
        Choose the eating pattern that best fits your lifestyle and goals. This will help us recommend recipes with the right nutritional balance for you.
      </Typography>

      <RadioGroup
        value={selectedDietType}
        onChange={handleChange}
        sx={{ width: '100%' }}
      >
        <Grid container spacing={3}>
          {dietTypes.map((diet) => (
            <Grid item xs={12} md={6} key={diet.id}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedDietType === diet.id ? 2 : 1,
                  borderColor: selectedDietType === diet.id ? `${diet.color}.main` : 'divider',
                  bgcolor: selectedDietType === diet.id ? `${diet.color}.50` : 'background.paper',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => {
                  setSelectedDietType(diet.id);
                  onChange(diet.id);
                }}
              >
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Stack spacing={2} height="100%">
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box
                        sx={{
                          color: `${diet.color}.main`,
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '2rem',
                        }}
                      >
                        {diet.icon}
                      </Box>
                      <FormControlLabel
                        value={diet.id}
                        control={<Radio color={diet.color} />}
                        label=""
                        sx={{ m: 0 }}
                      />
                    </Box>
                    
                    <Box flexGrow={1}>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {diet.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.5, mb: 2 }}
                      >
                        {diet.description}
                      </Typography>

                      {/* Macronutrient Breakdown */}
                      <Box mb={2}>
                        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                          Macronutrient Distribution:
                        </Typography>
                        <Stack spacing={1}>
                          <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="caption">Carbs</Typography>
                              <Typography variant="caption">{diet.macros.carbs}%</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={diet.macros.carbs}
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: 'info.main',
                                },
                              }}
                            />
                          </Box>
                          <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="caption">Protein</Typography>
                              <Typography variant="caption">{diet.macros.protein}%</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={diet.macros.protein}
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: 'success.main',
                                },
                              }}
                            />
                          </Box>
                          <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="caption">Fat</Typography>
                              <Typography variant="caption">{diet.macros.fat}%</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={diet.macros.fat}
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: 'warning.main',
                                },
                              }}
                            />
                          </Box>
                        </Stack>
                      </Box>

                      {/* Benefits */}
                      <Box>
                        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                          Key Benefits:
                        </Typography>
                        <Stack spacing={0.5}>
                          {diet.benefits.map((benefit, index) => (
                            <Typography
                              key={index}
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                              • {benefit}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      {selectedDiet && (
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selected diet type:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: `${selectedDiet.color}.100`,
              color: `${selectedDiet.color}.800`,
              borderRadius: 2,
              fontSize: '0.875rem',
              width: 'fit-content',
            }}
          >
            {React.cloneElement(selectedDiet.icon, { sx: { fontSize: '1rem' } })}
            {selectedDiet.label}
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
          💡 Tip: Don't worry if you're not sure - you can always change this later based on how the recipes work for you.
        </Typography>
      </Box>
    </Box>
  );
}

export default DietTypeSelector;
