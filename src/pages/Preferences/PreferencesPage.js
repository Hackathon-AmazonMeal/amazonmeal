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
import DietTypeSelector from '../../components/preferences/DietTypeSelector';
import HealthGoals from '../../components/preferences/HealthGoals';
import MealTypeSelector from '../../components/preferences/MealTypeSelector';
import CookingTimeToggle from '../../components/preferences/CookingTimeToggle';
import CookingMethodSelector from '../../components/preferences/CookingMethodSelector';
import PrepForSelector from '../../components/preferences/PrepForSelector';
import AllergySelector from '../../components/preferences/AllergySelector';

// Hooks and Context
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useRecipes } from '../../contexts/RecipeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

// Services
import preferenceService from '../../services/preferenceService';

const steps = [
  'Diet',
  'Health Goal',
  'Meal Type',
  'Cooking Time',
  'Cooking Method',
  'Prep for',
  'Allergies',
];

function PreferencesPage() {
  const navigate = useNavigate();
  const { createUser, setLoading, setError, clearError } = useUserPreferences();
  const { getRecommendations } = useRecipes();
  const { currentUser } = useAuth();
  
  // Ensure user is authenticated
  useAuthRedirect();

  const [activeStep, setActiveStep] = useState(0);
  const [preferences, setPreferences] = useState({
    dietType: 'vegetarian',
    healthGoals: [],
    mealType: 'dinner',
    cookingTime: 'medium',
    cookingMethod: 'stovetop',
    prepFor: 1,
    allergies: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Clear any existing errors when component mounts and check auth
  useEffect(() => {
    clearError();
    
    // If user is not authenticated, redirect to login
    if (!currentUser) {
      navigate('/login');
    }
  }, [clearError, currentUser, navigate]);

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
      case 0: // Diet Type
        if (!preferences.dietType) {
          stepErrors.dietType = 'Please select a diet type';
        }
        break;
      case 1: // Health Goals
        if (preferences.healthGoals.length === 0) {
          stepErrors.healthGoals = 'Please select at least one health goal';
        }
        break;
      case 2: // Meal Type
        if (!preferences.mealType) {
          stepErrors.mealType = 'Please select a meal type';
        }
        break;
      case 3: // Cooking Time
        if (!preferences.cookingTime) {
          stepErrors.cookingTime = 'Please select a cooking time';
        }
        break;
      case 4: // Cooking Method
        if (!preferences.cookingMethod) {
          stepErrors.cookingMethod = 'Please select a cooking method';
        }
        break;
      case 5: // Prep For
        if (!preferences.prepFor) {
          stepErrors.prepFor = 'Please select who you are cooking for';
        }
        break;
      case 6: // Allergies - optional
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

      // Check if user is still authenticated
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Log complete preferences object
      console.log('Complete Preferences Object:', preferences);
      
      // Get userId from logged in user
      const email = currentUser?.userId || currentUser?.id;
      
      // Save preferences to backend API (mock for now)
  
        const response = await fetch('https://user-ms-iimt.vercel.app/preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            email,
            preferences,
          }),
        });
    } catch (error) {
      console.error('❌ Error submitting preferences:', error);
      setError(error.message || 'Failed to submit your preferences to the external service. Please try again.');
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
          <DietTypeSelector
            selected={preferences.dietType}
            onChange={(value) => updatePreferences('dietType', value)}
            error={errors.dietType}
          />
        );
      case 1:
        return (
          <HealthGoals
            selected={preferences.healthGoals}
            onChange={(value) => updatePreferences('healthGoals', value)}
            error={errors.healthGoals}
          />
        );
      case 2:
        return (
          <MealTypeSelector
            selected={preferences.mealType}
            onChange={(value) => updatePreferences('mealType', value)}
            error={errors.mealType}
          />
        );
      case 3:
        return (
          <CookingTimeToggle
            selected={preferences.cookingTime}
            onChange={(value) => updatePreferences('cookingTime', value)}
            error={errors.cookingTime}
          />
        );
      case 4:
        return (
          <CookingMethodSelector
            selected={preferences.cookingMethod}
            onChange={(value) => updatePreferences('cookingMethod', value)}
            error={errors.cookingMethod}
          />
        );
      case 5:
        return (
          <PrepForSelector
            selected={preferences.prepFor}
            onChange={(value) => updatePreferences('prepFor', value)}
            error={errors.prepFor}
          />
        );
      case 6:
        return (
          <AllergySelector
            selected={preferences.allergies}
            onChange={(value) => updatePreferences('allergies', value)}
            error={errors.allergies}
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
              🔄 Submitting your preferences to external service...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Connecting directly to preference API to personalize your experience
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default PreferencesPage;
