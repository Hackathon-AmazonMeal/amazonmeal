import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormHelperText,
  Checkbox,
  Stack,
} from '@mui/material';
import {
  FitnessCenter,
  MonitorWeight,
  Favorite,
  LocalHospital,
  BatteryChargingFull,
  Restaurant,
  TrendingUp,
} from '@mui/icons-material';

// Mock data - in a real app, this would come from an API
const healthGoals = [
  {
    id: 'weight-loss',
    label: 'Weight Loss',
    description: 'Reduce caloric intake and lose weight',
    icon: <MonitorWeight />,
    targetCalories: 1500,
    color: 'primary',
  },
  {
    id: 'muscle-gain',
    label: 'Muscle Gain',
    description: 'Build muscle mass with high protein',
    icon: <FitnessCenter />,
    targetCalories: 2200,
    targetProtein: 150,
    color: 'success',
  },
  {
    id: 'maintain-weight',
    label: 'Maintain Weight',
    description: 'Maintain current weight and health',
    icon: <TrendingUp />,
    targetCalories: 1800,
    color: 'info',
  },
  {
    id: 'heart-health',
    label: 'Heart Health',
    description: 'Improve cardiovascular health',
    icon: <Favorite />,
    targetSodium: 1500,
    color: 'error',
  },
  {
    id: 'diabetes-management',
    label: 'Diabetes Management',
    description: 'Control blood sugar levels',
    icon: <LocalHospital />,
    targetCarbs: 150,
    color: 'warning',
  },
  {
    id: 'energy-boost',
    label: 'Energy Boost',
    description: 'Increase energy and vitality',
    icon: <BatteryChargingFull />,
    targetCalories: 2000,
    color: 'secondary',
  },
  {
    id: 'digestive-health',
    label: 'Digestive Health',
    description: 'Improve gut health and digestion',
    icon: <Restaurant />,
    targetFiber: 35,
    color: 'success',
  },
];

function HealthGoals({ selected = [], onChange, error }) {
  const [selectedGoals, setSelectedGoals] = useState(selected);

  useEffect(() => {
    setSelectedGoals(selected);
  }, [selected]);

  const handleToggle = (goalId) => {
    const newSelected = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId];
    
    setSelectedGoals(newSelected);
    onChange(newSelected);
  };

  const isSelected = (goalId) => selectedGoals.includes(goalId);

  return (
    <Box>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600, mb: 2 }}
      >
        Health Goals
      </Typography>
      
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, lineHeight: 1.6 }}
      >
        What are your primary health and fitness goals? Select all that apply. We'll recommend recipes that align with your objectives and nutritional needs.
      </Typography>

      <Grid container spacing={3}>
        {healthGoals.map((goal) => (
          <Grid item xs={12} sm={6} md={4} key={goal.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isSelected(goal.id) ? 2 : 1,
                borderColor: isSelected(goal.id) ? `${goal.color}.main` : 'divider',
                bgcolor: isSelected(goal.id) ? `${goal.color}.50` : 'background.paper',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleToggle(goal.id)}
            >
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Stack spacing={2} height="100%">
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box
                      sx={{
                        color: `${goal.color}.main`,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '2rem',
                      }}
                    >
                      {goal.icon}
                    </Box>
                    <Checkbox
                      checked={isSelected(goal.id)}
                      color={goal.color}
                      sx={{ p: 0 }}
                    />
                  </Box>
                  
                  <Box flexGrow={1}>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {goal.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.5 }}
                    >
                      {goal.description}
                    </Typography>
                  </Box>

                  {/* Target Information */}
                  <Box>
                    {goal.targetCalories && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Target: ~{goal.targetCalories} calories/day
                      </Typography>
                    )}
                    {goal.targetProtein && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Protein: {goal.targetProtein}g/day
                      </Typography>
                    )}
                    {goal.targetSodium && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Sodium: &lt;{goal.targetSodium}mg/day
                      </Typography>
                    )}
                    {goal.targetCarbs && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Carbs: ~{goal.targetCarbs}g/day
                      </Typography>
                    )}
                    {goal.targetFiber && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Fiber: {goal.targetFiber}g/day
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedGoals.length > 0 && (
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selected goals ({selectedGoals.length}):
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedGoals.map((goalId) => {
              const goal = healthGoals.find(g => g.id === goalId);
              return (
                <Box
                  key={goalId}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    bgcolor: `${goal.color}.100`,
                    color: `${goal.color}.800`,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                  }}
                >
                  {React.cloneElement(goal.icon, { sx: { fontSize: '1rem' } })}
                  {goal.label}
                </Box>
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
          💡 Tip: You can select multiple goals. We'll find recipes that support all your objectives.
        </Typography>
      </Box>
    </Box>
  );
}

export default HealthGoals;
