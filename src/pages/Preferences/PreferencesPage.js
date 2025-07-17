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
import { useUser } from '../../contexts/UserContext';
import { useApi } from '../../hooks/useApi';
import { useRecipes } from '../../contexts/RecipeContext';
import axios from 'axios';

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
  const { setLoading, setError, clearError, preferences: userPreferences } = useUserPreferences();
  const { currentUser, updatePreferences: updateUserPreferences } = useUser();
  const { post, isLoading: isApiLoading, error: apiError, clearError: clearApiError } = useApi();
  const { setRecipes, setLoading: setRecipesLoading } = useRecipes();
  
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [activeStep, setActiveStep] = useState(0);
  // Initialize preferences from user context
  const [preferences, setPreferences] = useState(() => {
    // Get preferences from user context if available
    if (userPreferences) {
      return {
        dietType: userPreferences.dietType || 'vegetarian',
        healthGoals: userPreferences.healthGoals || [],
        mealType: userPreferences.mealType || 'dinner',
        cookingTime: userPreferences.cookingTime || 'medium',
        cookingMethod: userPreferences.cookingMethod || 'stovetop',
        numberOfPeople: userPreferences.numberOfPeople || 1,
        allergies: userPreferences.allergies || [],
      };
    }
    
    // Default preferences if user has none
    return {
      dietType: 'vegetarian',
      healthGoals: [],
      mealType: 'dinner',
      cookingTime: 'medium',
      cookingMethod: 'stovetop',
      numberOfPeople: 1,
      allergies: [],
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Update preferences when user preferences change
  useEffect(() => {
    if (userPreferences) {
      setPreferences({
        dietType: userPreferences.dietType || 'vegetarian',
        healthGoals: userPreferences.healthGoals || [],
        mealType: userPreferences.mealType || 'dinner',
        cookingTime: userPreferences.cookingTime || 'medium',
        cookingMethod: userPreferences.cookingMethod || 'stovetop',
        numberOfPeople: userPreferences.numberOfPeople || 1,
        allergies: userPreferences.allergies || [],
      });
    }
  }, [userPreferences]);

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
    
    if (activeStep === STEPS.length - 1) {
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
        if (!preferences.numberOfPeople) {
          stepErrors.numberOfPeople = 'Please select who you are cooking for';
        }
        break;
      case 6: // Allergies - optional
        break;
      default:
        break;
    }

    return stepErrors;
  };

  // Function to fetch images for recipes
  const fetchImagesForRecipes = async (recipes) => {
    try {
      // Extract recipe titles for image fetching
      const recipeTitles = recipes.map(recipe => recipe.title);
      
      // Call the images API
      const response = await axios.post('https://recipe-generator-model-58mk.vercel.app/images', recipeTitles);
      
      console.log('Images API response:', response.data);
      
      // Map images to recipes
      const recipesWithImages = recipes.map((recipe, index) => {
        // Extract prep and cook times from procedure text
        const prepTimePattern = /prep.*?(\d+)[-\s]?min/i;
        const prepMatch = recipe.procedure?.match(prepTimePattern);
        
        const cookTimePattern = /cook.*?(\d+)[-\s]?min/i;
        const cookMatch = recipe.procedure?.match(cookTimePattern);
        
        const otherCookingPattern = /(simmer|bake|roast|grill).*?(\d+)[-\s]?min/i;
        const otherMatch = recipe.procedure?.match(otherCookingPattern);
        
        const prepTime = prepMatch ? parseInt(prepMatch[1]) : 15;
        const cookTime = cookMatch ? parseInt(cookMatch[1]) : (otherMatch ? parseInt(otherMatch[2]) : 25);
        
        // Get image URL from response data (which is a dictionary with recipe titles as keys)
        const imageUrl = response.data[recipe.title] || 
                        `https://source.unsplash.com/featured/?food,${encodeURIComponent(recipe.title)}`;
        
        return {
          ...recipe,
          id: `recipe-${index}`, // Add an ID for React keys
          image: imageUrl,
          // Add default values for UI compatibility
          name: recipe.title,
          prepTime: prepTime,
          cookTime: cookTime,
          servings: recipe.ingredients?.necessary_items?.length > 0 ? 
            Math.ceil(recipe.ingredients.necessary_items.reduce((sum, item) => sum + item.quantity, 0) / 3) : 2,
          nutrition: {
            calories: 350,
            protein: 15,
            carbs: 40,
            fat: 12
          },
          tags: recipe.summary ? 
            recipe.summary.split(' ').filter(word => word.length > 7).slice(0, 3) : 
            ['healthy', 'homemade']
        };
      });
      
      return recipesWithImages;
    } catch (error) {
      console.error('Error fetching images:', error);
      // Return recipes with placeholder images if image fetch fails
      return recipes.map((recipe, index) => ({
        ...recipe,
        id: `recipe-${index}`,
        image: `https://source.unsplash.com/featured/?food,${encodeURIComponent(recipe.title)}`,
        name: recipe.title,
        prepTime: 15,
        cookTime: 25,
        servings: 2,
        nutrition: {
          calories: 350,
          protein: 15,
          carbs: 40,
          fat: 12
        },
        tags: ['healthy', 'homemade']
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setLoading(true);
      setRecipesLoading(true);
      clearError();

      // Check if user is still authenticated
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Log complete preferences object
      console.log('Complete Preferences Object:', preferences);
      
      // Get userId from logged in user
      const userId = currentUser?.email || currentUser?.userId;
      
      // Save preferences to backend API
      try {
        const pref = JSON.stringify({
            email: userId,
            preferences: preferences,
          });
          console.log("preference: ", pref);

        const response = await fetch('https://user-ms-iimt.vercel.app/preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: pref,
        });

        if (response.status === 401) {
          // User session expired, redirect to login
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to save preferences');
        }
        
        // Update user preferences in context
        updateUserPreferences(preferences);
      } catch (fetchError) {
        // If API call fails, still update preferences locally
        console.warn('API call failed, saving preferences locally:', fetchError);
        updateUserPreferences(preferences);
      }

      // Call the recipe API with the preferences
      try {
        console.log('Fetching recipes with preferences:', preferences);
        
        // Call the recipe API directly with the preferences
        const response = await axios.post('https://recipe-generator-model-58mk.vercel.app/recipes', {
          dietType: preferences.dietType,
          healthGoals: preferences.healthGoals,
          mealType: preferences.mealType,
          cookingTime: preferences.cookingTime,
          cookingMethod: preferences.cookingMethod,
          prepFor: preferences.numberOfPeople,
          allergies: preferences.allergies,
        });
        
        console.log('Recipe API response:', response.data);
        
        // Process the recipes if we got a response
        if (response.data && response.data.length > 0) {
          // Fetch images for the recipes
          const recipesWithImages = await fetchImagesForRecipes(response.data);
          
          // Save the enhanced recipes in the context
          setRecipes(recipesWithImages);
        }
      } catch (apiError) {
        console.error('Error fetching recipes:', apiError);
        // If API call fails, we'll show mock data on the recipes page
      }

      // Navigate to recipes page
      navigate('/recipes');
    } catch (error) {
      console.error('Error setting up preferences:', error);
      setError('Failed to save your preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
      setRecipesLoading(false);
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
          />
        );
      case 1:
        return (
          <HealthGoals
            selected={preferences.healthGoals}
            onChange={(value) => updatePreferences('healthGoals', value)}
          />
        );
      case 2:
        return (
          <MealTypeSelector
            selected={preferences.mealType}
            onChange={(value) => updatePreferences('mealType', value)}
          />
        );
      case 3:
        return (
          <CookingTimeToggle
            selected={preferences.cookingTime}
            onChange={(value) => updatePreferences('cookingTime', value)}
          />
        );
      case 4:
        return (
          <CookingMethodSelector
            selected={preferences.cookingMethod}
            onChange={(value) => updatePreferences('cookingMethod', value)}
          />
        );
      case 5:
        return (
          <PrepForSelector
            selected={preferences.numberOfPeople}
            onChange={(value) => updatePreferences('numberOfPeople', value)}
          />
        );
      case 6:
        return (
          <AllergySelector
            selected={preferences.allergies}
            onChange={(value) => updatePreferences('allergies', value)}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = activeStep === STEPS.length - 1;
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
