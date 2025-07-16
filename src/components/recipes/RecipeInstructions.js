import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

function RecipeInstructions({ recipe }) {
  if (!recipe) {
    return null;
  }

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
          sx={{ lineHeight: 1.6 }}
        >
          {recipe.summary || recipe.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RecipeInstructions;
