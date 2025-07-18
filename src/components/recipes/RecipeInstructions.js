import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import {
  AccessTime,
  Restaurant,
  LocalFireDepartment,
  Person,
} from '@mui/icons-material';

function RecipeInstructions({ recipe }) {
  if (!recipe) {
    return null;
  }

  // Function to parse procedure text into steps
  const parseSteps = (procedureText) => {
    if (!procedureText) return [];
    
    // Try a different approach - look for step numbers and use them as delimiters
    const stepPattern = /\d+\.\s/g;
    const stepMatches = [...procedureText.matchAll(stepPattern)];
    
    if (stepMatches.length > 0) {
      const steps = [];
      
      // For each step number found
      for (let i = 0; i < stepMatches.length; i++) {
        const currentMatch = stepMatches[i];
        const currentIndex = currentMatch.index;
        const nextIndex = (i < stepMatches.length - 1) ? stepMatches[i + 1].index : procedureText.length;
        
        // Extract the full step text from current step number to the next step number (or end)
        const stepText = procedureText.substring(currentIndex, nextIndex).trim();
        steps.push(stepText);
      }
      
      return steps;
    }
    
    // If no step numbers found, try splitting by newlines
    const lines = procedureText.split('\n');
    return lines.filter(line => line.trim());
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mb: 3 }}
        >
          {recipe.name}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          {recipe.summary || recipe.description}
        </Typography>

        {/* Recipe Info */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTime color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Prep Time
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {recipe.prepTime} min
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalFireDepartment color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Cook Time
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {recipe.cookTime} min
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <Person color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Servings
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {recipe.servings}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <Restaurant color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Difficulty
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {recipe.difficulty || 'Medium'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Tags */}
        <Box mb={3}>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {recipe.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        {/* Ingredients section removed as per feedback */}

        {recipe.nutrition && (
          <>
            <Divider sx={{ my: 3 }} />

            {/* Nutrition Info */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Nutrition (per serving)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4} sm={2}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      {recipe.nutrition.calories || '500'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calories
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                      {recipe.nutrition.protein || '10'}g
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Protein
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
                      {recipe.nutrition.carbs || '20'}g
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Carbs
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
                      {recipe.nutrition.fat || '10'}g
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Fat
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                      {recipe.nutrition.fiber || '5'}g
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Fiber
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                      {recipe.nutrition.sodium || '10'}mg
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sodium
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Instructions */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Instructions
          </Typography>
          {recipe.procedure ? (
            // Parse and display procedure as numbered steps
            <Stack spacing={2}>
              {parseSteps(recipe.procedure).map((step, index) => (
                <Box key={index} display="flex" gap={2}>
                  <Box
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.6, pt: 0.5 }}
                  >
                    {step.replace(/^\d+\.\s*/, '')} {/* Remove the step number */}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : recipe.instructions ? (
            // Display instructions from existing data structure
            <Stack spacing={2}>
              {recipe.instructions.map((instruction, index) => (
                <Box key={index} display="flex" gap={2}>
                  <Box
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.6, pt: 0.5 }}
                  >
                    {instruction}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
}

export default RecipeInstructions;
