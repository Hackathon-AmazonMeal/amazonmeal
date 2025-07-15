import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Restaurant,
  Dashboard,
  ShoppingCart,
  Receipt,
  Email,
  Person,
} from '@mui/icons-material';

function CheckoutSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order data passed from cart - this should always be present for real orders
  const orderData = location.state || {};
  const { 
    orderId,
    customerInfo,
    orderTotal,
    items = [],
    externalOrderId,
    isDemo = false // Flag to indicate if this is a demo/direct navigation
  } = orderData;

  // If no order data, this is likely a direct navigation - show demo mode
  const isDemoMode = !location.state || isDemo;

  // Default values for demo mode
  const demoOrderData = {
    orderId: `DEMO-${Date.now()}`,
    customerInfo: {
      name: 'Chef Ayush',
      email: 'homeayush79@gmail.com'
    },
    orderTotal: 25.99,
    items: [
      {
        id: 'demo-item',
        name: 'Sample Meal Ingredients',
        quantity: 1,
        unit: 'set',
        price: 25.99
      }
    ],
    externalOrderId: 'DEMO-EXT-12345'
  };

  // Use actual data or demo data
  const displayData = isDemoMode ? demoOrderData : {
    orderId,
    customerInfo,
    orderTotal,
    items,
    externalOrderId
  };

  // Auto-redirect after viewing success page
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate('/dashboard');
  //   }, 10000);

  //   return () => clearTimeout(timer);
  // }, [navigate]);

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
              Order Confirmed!
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              {isDemoMode 
                ? "Welcome to your order confirmation page! This is a demo showing how your successful orders will appear."
                : "Thank you for your order! Your ingredients have been confirmed and will be delivered to you soon."
              }
            </Typography>

            {isDemoMode && (
              <Alert 
                severity="info" 
                sx={{ mb: 4, textAlign: 'left' }}
              >
                <Typography variant="body2">
                  <strong>Demo Mode:</strong> You've navigated directly to this page. 
                  In a real scenario, you would reach this page after completing a purchase from your cart.
                </Typography>
              </Alert>
            )}

            {/* Order Confirmation - Only show for real orders */}
            {!isDemoMode && (
              <Alert 
                severity="success" 
                sx={{ mb: 4, textAlign: 'left' }}
              >
                <Typography variant="body2">
                  <strong>✅ Order Confirmed:</strong> Your order has been successfully processed 
                  with our fulfillment partner.
                </Typography>
                {displayData.externalOrderId && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Fulfillment Order ID:</strong> {displayData.externalOrderId}
                  </Typography>
                )}
              </Alert>
            )}

            {/* Order Details */}
            <Paper 
              sx={{ 
                bgcolor: 'primary.50', 
                p: 3, 
                borderRadius: 2,
                mb: 4,
                border: '1px solid',
                borderColor: 'primary.200',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Receipt />
                Order Details
              </Typography>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">
                    Order ID:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {displayData.orderId}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" />
                    Customer:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {displayData.customerInfo?.name}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" />
                    Email:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {displayData.customerInfo?.email}
                  </Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${displayData.orderTotal?.toFixed(2)}
                  </Typography>
                </Box>
                {isDemoMode && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      * Demo order - Sample meal ingredients package
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* What's Next Section */}
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
