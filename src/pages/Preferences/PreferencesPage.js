import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
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
import { useUser } from '../../contexts/UserContext';
import { useApi } from '../../hooks/useApi';

// Utils
import { validatePreferences } from '../../utils/validation';
import { API, DIET_TYPES, MEAL_TYPES, COOKING_TIMES, COOKING_METHODS, ERROR_MESSAGES } from '../../utils/constants';

// Constants
const STEPS = [
  'Diet',
  'Health Goal',
  'Meal Type',
  'Cooking Time',
  'Cooking Method',
  'Prep for',
  'Allergies',
];

// Default preferences
const DEFAULT_PREFERENCES = {
  dietType: DIET_TYPES.VEGETARIAN,
  healthGoals: [],
  mealType: MEAL_TYPES.DINNER,
  cookingTime: COOKING_TIMES.MEDIUM,
  cookingMethod: COOKING_METHODS.STOVETOP,
  numberOfPeople: 1,
  allergies: [],
};

// Step to validation key mapping
const STEP_VALIDATION_MAP = [
  'dietType',
  'healthGoals',
  'mealType',
  'cookingTime',
  'cookingMethod',
  'numberOfPeople',
  'allergies',
];

/**
 * PreferencesPage component for setting user preferences
 * Implements a multi-step form with validation and submission handling
 */
function PreferencesPage() {
  const navigate = useNavigate();
  const { setLoading: setUserLoading, clearError: clearUserError } = useUserPreferences();
  const { getRecommendations } = useRecipes();
  const { currentUser, updatePreferences: updateUserPreferences } = useUser();
  const { post, isLoading: isApiLoading, error: apiError, clearError: clearApiError } = useApi();
  
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [preferences, setPreferences] = useState({ ...DEFAULT_PREFERENCES });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearUserError();
    clearApiError();
  }, [clearUserError, clearApiError]);

  /**
   * Validates the current step's data
   * @param {number} step - Current step index
   * @returns {Object} - Object containing validation errors
   */
  const validateStep = useCallback((step) => {
    const validationKey = STEP_VALIDATION_MAP[step];
    return validatePreferences(preferences, validationKey);
  }, [preferences]);

  /**
   * Handles form submission
   * Saves preferences and navigates to recipes page
   */
  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setUserLoading(true);
      clearUserError();
      clearApiError();

      // Check if user is authenticated or guest
      const isGuest = !currentUser;
      
      // Get userId from logged in user or use 'guest' for guest users
      const userId = currentUser?.email || currentUser?.userId || 'guest';
      
      // Save preferences to backend API
      try {
        const preferenceData = {
          email: userId,
          preferences: preferences,
        };

        const savedPreferences = await post(API.PREFERENCES, preferenceData);
        
        // Update user preferences in context if user is authenticated
        if (!isGuest) {
          updateUserPreferences(savedPreferences);
        }
      } catch (fetchError) {
        // If API call fails with 401, redirect to login
        if (fetchError.message.includes('401') && !isGuest) {
          navigate('/login');
          return;
        }
        
        // If API call fails, still update preferences locally
        console.warn('API call failed, saving preferences locally:', fetchError);
        if (!isGuest) {
          updateUserPreferences(preferences);
        }
      }

      // Get personalized recommendations
      try {
        await getRecommendations(preferences);
      } catch (recError) {
        if (recError.message === 'User not authenticated' && !isGuest) {
          navigate('/login');
          return;
        }
        throw recError;
      }

      // Navigate to recipes page
      navigate('/recipes');
    } catch (error) {
      console.error('Error setting up preferences:', error);
      setErrors({ submit: ERROR_MESSAGES.PREFERENCES_SAVE_FAILED });
    } finally {
      setIsSubmitting(false);
      setUserLoading(false);
    }
  }, [
    clearUserError, 
    clearApiError,
    currentUser, 
    getRecommendations, 
    navigate, 
    post,
    preferences, 
    setUserLoading, 
    updateUserPreferences
  ]);

  /**
   * Handles navigation to next step or form submission
   */
  const handleNext = useCallback(() => {
    // Validate current step
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    
    if (activeStep === STEPS.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  }, [activeStep, handleSubmit, validateStep]);

  /**
   * Handles navigation to previous step
   */
  const handleBack = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
    setErrors({});
  }, []);

  /**
   * Updates preference state and clears related errors
   * @param {string} key - Preference key to update
   * @param {any} value - New value for the preference
   */
  const updatePreference = useCallback((key, value) => {
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
  }, [errors]);

  /**
   * Renders the content for the current step
   * @param {number} step - Current step index
   * @returns {JSX.Element} - Component for the current step
   */
  const renderStepContent = useCallback((step) => {
    switch (step) {
      case 0:
        return (
          <DietTypeSelector
            selected={preferences.dietType}
            onChange={(value) => updatePreference('dietType', value)}
            error={errors.dietType}
          />
        );
      case 1:
        return (
          <HealthGoals
            selected={preferences.healthGoals}
            onChange={(value) => updatePreference('healthGoals', value)}
            error={errors.healthGoals}
          />
        );
      case 2:
        return (
          <MealTypeSelector
            selected={preferences.mealType}
            onChange={(value) => updatePreference('mealType', value)}
            error={errors.mealType}
          />
        );
      case 3:
        return (
          <CookingTimeToggle
            selected={preferences.cookingTime}
            onChange={(value) => updatePreference('cookingTime', value)}
            error={errors.cookingTime}
          />
        );
      case 4:
        return (
          <CookingMethodSelector
            selected={preferences.cookingMethod}
            onChange={(value) => updatePreference('cookingMethod', value)}
            error={errors.cookingMethod}
          />
        );
      case 5:
        return (
          <PrepForSelector
            selected={preferences.numberOfPeople}
            onChange={(value) => updatePreference('numberOfPeople', value)}
            error={errors.numberOfPeople}
          />
        );
      case 6:
        return (
          <AllergySelector
            selected={preferences.allergies}
            onChange={(value) => updatePreference('allergies', value)}
            error={errors.allergies}
          />
        );
      default:
        return null;
    }
  }, [preferences, updatePreference, errors]);

  // Memoize these values to prevent unnecessary re-renders
  const isLastStep = useMemo(() => activeStep === STEPS.length - 1, [activeStep]);
  const isFirstStep = useMemo(() => activeStep === 0, [activeStep]);

  // Combine API and form errors
  const hasError = useMemo(() => 
    Object.keys(errors).length > 0 || apiError, 
    [errors, apiError]
  );
  
  const errorMessage = useMemo(() => 
    errors.submit || apiError || (Object.values(errors)[0]), 
    [errors, apiError]
  );

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
            {STEPS.map((label) => (
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
        {hasError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
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
            disabled={isFirstStep || isSubmitting || isApiLoading}
            startIcon={<ArrowBack />}
            variant="outlined"
            size="large"
            aria-label="Go back to previous step"
          >
            Back
          </Button>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Step {activeStep + 1} of {STEPS.length}
            </Typography>
          </Box>

          <Button
            onClick={handleNext}
            disabled={isSubmitting || isApiLoading}
            endIcon={
              (isSubmitting || isApiLoading) ? (
                <CircularProgress size={20} />
              ) : isLastStep ? null : (
                <ArrowForward />
              )
            }
            variant="contained"
            size="large"
            sx={{ minWidth: 120 }}
            aria-label={isLastStep ? "Submit preferences" : "Go to next step"}
          >
            {(isSubmitting || isApiLoading)
              ? 'Processing...'
              : isLastStep
              ? 'Get My Recipes'
              : 'Next'
            }
          </Button>
        </Stack>

        {/* Progress Indicator */}
        {(isSubmitting || isApiLoading) && (
          <Box textAlign="center" mt={3} role="status" aria-live="polite">
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

// PropTypes would be defined here if the component accepted props
PreferencesPage.propTypes = {};

export default PreferencesPage;
