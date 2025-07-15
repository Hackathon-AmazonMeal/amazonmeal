import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
} from '@mui/material';
import {
  Restaurant,
  Psychology,
  ShoppingCart,
  TrendingUp,
} from '@mui/icons-material';

const features = [
  {
    icon: <Psychology color="primary" sx={{ fontSize: 40 }} />,
    title: 'AI-Powered Recommendations',
    description: 'Get personalized recipe suggestions based on your dietary preferences, health goals, and taste preferences.',
  },
  {
    icon: <Restaurant color="primary" sx={{ fontSize: 40 }} />,
    title: 'Diverse Recipe Collection',
    description: 'Explore thousands of recipes from breakfast to dinner, covering various cuisines and dietary needs.',
  },
  {
    icon: <ShoppingCart color="primary" sx={{ fontSize: 40 }} />,
    title: 'Smart Shopping Lists',
    description: 'Automatically generate shopping lists with adjustable quantities and seamless checkout experience.',
  },
  {
    icon: <TrendingUp color="primary" sx={{ fontSize: 40 }} />,
    title: 'Health Goal Tracking',
    description: 'Track your nutrition goals and get recipes that align with your health and fitness objectives.',
  },
];

const benefits = [
  'Save time on meal planning',
  'Discover new favorite recipes',
  'Meet your health goals',
  'Reduce food waste',
  'Simplify grocery shopping',
];

function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/preferences');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF9900 0%, #FFB84D 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
            }}
          >
            Welcome to Recipe Recommendations
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Discover personalized recipes tailored to your taste, dietary needs, and health goals. 
            Let AI help you plan delicious meals and simplify your cooking journey.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'grey.100',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6, color: 'text.primary' }}
        >
          Why Choose Our Platform?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ flexShrink: 0 }}>
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6, color: 'text.primary' }}
          >
            What You'll Get
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box textAlign="center">
                  <Chip
                    label={benefit}
                    variant="outlined"
                    sx={{
                      fontSize: '1rem',
                      py: 2,
                      px: 1,
                      height: 'auto',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }}
          >
            Ready to Transform Your Cooking?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            Join thousands of home cooks who have discovered their perfect recipes. 
            It only takes 2 minutes to set up your preferences.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Your Journey
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default Welcome;
