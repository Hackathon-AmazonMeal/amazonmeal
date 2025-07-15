import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Restaurant,
  Dashboard,
  ShoppingCart,
} from '@mui/icons-material';

function CheckoutSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinueShopping = () => {
    navigate('/recipes');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Success Icon */}
            <Box mb={3}>
              <CheckCircle 
                sx={{ 
                  fontSize: 80, 
                  color: 'success.main',
                  mb: 2,
                }} 
              />
            </Box>

            {/* Success Message */}
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'success.main',
                mb: 2,
              }}
            >
              Order Successful!
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Thank you for your order! Your ingredients are being prepared 
              and will be delivered to you soon.
            </Typography>

            {/* Order Details */}
            <Box 
              sx={{ 
                bgcolor: 'success.50', 
                p: 3, 
                borderRadius: 2,
                mb: 4,
                border: '1px solid',
                borderColor: 'success.200',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                What's Next?
              </Typography>
              <Stack spacing={2} alignItems="center">
                <Typography variant="body1" color="text.secondary">
                  📧 You'll receive an order confirmation email shortly
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  🚚 Your ingredients will be delivered within 2-4 hours
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  👨‍🍳 Follow the recipe instructions for the perfect meal
                </Typography>
              </Stack>
            </Box>

            {/* Features Highlight */}
            <Box mb={4}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                While you wait, explore more features:
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={1} 
                justifyContent="center"
                mt={2}
              >
                <Chip
                  icon={<Restaurant />}
                  label="Discover New Recipes"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<Dashboard />}
                  label="Track Your Orders"
                  color="info"
                  variant="outlined"
                />
                <Chip
                  icon={<ShoppingCart />}
                  label="Plan Next Meals"
                  color="success"
                  variant="outlined"
                />
              </Stack>
            </Box>

            {/* Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              mb={3}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Restaurant />}
                onClick={handleContinueShopping}
                sx={{ px: 4 }}
              >
                Explore More Recipes
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Dashboard />}
                onClick={handleGoToDashboard}
                sx={{ px: 4 }}
              >
                Go to Dashboard
              </Button>
            </Stack>

            {/* Auto-redirect Notice */}
            <Typography variant="caption" color="text.secondary">
              You'll be automatically redirected to your dashboard in a few seconds
            </Typography>
          </CardContent>
        </Card>

        {/* Additional Tips */}
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary" gutterBottom>
            💡 Pro Tips for Your Cooking Experience:
          </Typography>
          <Stack spacing={1} mt={2}>
            <Typography variant="body2" color="text.secondary">
              • Read through the entire recipe before starting
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Prep all ingredients before you begin cooking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Don't forget to rate your recipe experience!
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default CheckoutSuccess;
