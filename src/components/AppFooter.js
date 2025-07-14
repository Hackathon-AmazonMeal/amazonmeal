import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Divider
} from '@mui/material';

const AppFooter = () => {
  const location = useLocation();

  // Don't show footer on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
        py: 3
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              🍽️ AmazonMeal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-powered meal planning made simple. Discover, plan, and shop for delicious meals tailored to your preferences.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Features
            </Typography>
            <Link href="/recipes" variant="body2" color="text.secondary" display="block">
              Recipe Browser
            </Link>
            <Link href="/meal-plans" variant="body2" color="text.secondary" display="block">
              Meal Planning
            </Link>
            <Link href="/shopping-list" variant="body2" color="text.secondary" display="block">
              Shopping Lists
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Account
            </Typography>
            <Link href="/profile" variant="body2" color="text.secondary" display="block">
              Profile Settings
            </Link>
            <Link href="/preferences" variant="body2" color="text.secondary" display="block">
              Preferences
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              About
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Built for Amazon's Internal Hackathon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Powered by AWS Services
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2024 AmazonMeal. Built with ❤️ for Amazon Hackathon.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Demo Version - Not for Production Use
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AppFooter;
