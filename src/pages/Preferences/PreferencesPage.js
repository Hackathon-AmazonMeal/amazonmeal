import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

// Components
import DietaryRestrictions from '../../components/preferences/DietaryRestrictions';
import AllergySelector from '../../components/preferences/AllergySelector';
import HealthGoals from '../../components/preferences/HealthGoals';
import DietTypeSelector from '../../components/preferences/DietTypeSelector';

// Hooks and Context
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useRecipes } from '../../contexts/RecipeContext';

const steps = [
  'Dietary Restrictions',
  'Allergies',
  'Health Goals',
  'Diet Type',
];

function PreferencesPage() {
  const navigate = useNavigate();
  const { createUser, setLoading, setError, clearError } = useUserPreferences();
  const { getRecommendations } = useRecipes();

  const [activeStep, setActiveStep] = useState(0);
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [],
    allergies: [],
    healthGoals: [],
    dietType: 'balanced',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleNext = () => {
    // Validate current step
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setErrors({});
  };

  const validateStep = (step) => {
    const stepErrors = {};

    switch (step) {
      case 0: // Dietary Restrictions - optional
        break;
      case 1: // Allergies - optional
        break;
      case 2: // Health Goals
        if (preferences.healthGoals.length === 0) {
          stepErrors.healthGoals = 'Please select at least one health goal';
        }
        break;
      case 3: // Diet Type
        if (!preferences.dietType) {
          stepErrors.dietType = 'Please select a diet type';
        }
        break;
      default:
        break;
    }

    return stepErrors;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setLoading(true);
      clearError();

      // Create user with preferences
      createUser(preferences);

      // Get personalized recommendations
      await getRecommendations(preferences);

      // Navigate to recipes page
      navigate('/recipes');
    } catch (error) {
      console.error('Error setting up preferences:', error);
      setError('Failed to set up your preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const updatePreferences = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
    
    // Clear errors for this field
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <DietaryRestrictions
            selected={preferences.dietaryRestrictions}
            onChange={(value) => updatePreferences('dietaryRestrictions', value)}
            error={errors.dietaryRestrictions}
          />
        );
      case 1:
        return (
          <AllergySelector
            selected={preferences.allergies}
            onChange={(value) => updatePreferences('allergies', value)}
            error={errors.allergies}
          />
        );
      case 2:
        return (
          <HealthGoals
            selected={preferences.healthGoals}
            onChange={(value) => updatePreferences('healthGoals', value)}
            error={errors.healthGoals}
          />
        );
      case 3:
        return (
          <DietTypeSelector
            selected={preferences.dietType}
            onChange={(value) => updatePreferences('dietType', value)}
            error={errors.dietType}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = activeStep === steps.length - 1;
  const isFirstStep = activeStep === 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            Set Your Preferences
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            Help us personalize your recipe recommendations by sharing your dietary preferences and health goals.
          </Typography>
        </Box>

        {/* Stepper */}
        <Box mb={4}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Fade in={true} key={activeStep}>
              <Box>
                {renderStepContent(activeStep)}
              </Box>
            </Fade>
          </CardContent>
        </Card>

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {Object.values(errors)[0]}
          </Alert>
        )}

        {/* Navigation Buttons */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Button
            onClick={handleBack}
            disabled={isFirstStep || isSubmitting}
            startIcon={<ArrowBack />}
            variant="outlined"
            size="large"
          >
            Back
          </Button>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Step {activeStep + 1} of {steps.length}
            </Typography>
          </Box>

          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            endIcon={
              isSubmitting ? (
                <CircularProgress size={20} />
              ) : isLastStep ? null : (
                <ArrowForward />
              )
            }
            variant="contained"
            size="large"
            sx={{ minWidth: 120 }}
          >
            {isSubmitting
              ? 'Processing...'
              : isLastStep
              ? 'Get My Recipes'
              : 'Next'
            }
          </Button>
        </Stack>

        {/* Progress Indicator */}
        {isSubmitting && (
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Generating your personalized recommendations...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              This may take a few moments
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default PreferencesPage;
