import React from 'react';
import {
  Typography,
  Card,
  CardContent,
} from '@mui/material';

function RecipeInstructions({ recipe }) {
  if (!recipe) {
    return null;
  }

  // Use API data if available (from external API), otherwise use recipe data
  const title = recipe.apiData?.title || recipe.name;
  const summary = recipe.apiData?.summary || recipe.description;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mb: 3 }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          {summary}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RecipeInstructions;
