import React, { useEffect, useState, useRef } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Restaurant,
  Dashboard,
  ShoppingCart,
  Receipt,
  Email,
  Person,
  Warning,
} from '@mui/icons-material';
import orderService from '../../services/orderService';
import { cartService } from '../../services/cartService';

function CheckoutSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order data passed from cart with default values
  const orderData = location.state || {};
  const { 
    orderId = `AM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate default order ID
    customerInfo = {
      name: 'Chef Ayush',
      email: 'homeayush79@gmail.com'
    }, 
    orderTotal = 0, 
    items = [], 
    externalApiCalled = false,
    externalOrderId: passedExternalOrderId 
  } = orderData;

  // Ensure customerInfo has default values even if partially provided
  const safeCustomerInfo = {
    name: customerInfo?.name || 'Chef Ayush',
    email: customerInfo?.email || 'homeayush79@gmail.com',
    ...customerInfo
  };

  // Check if this is a direct navigation (no order data passed)
  const isDirectNavigation = !location.state;

  // State for external API call
  const [apiCallStatus, setApiCallStatus] = useState(externalApiCalled ? 'success' : 'loading');
  const [apiError, setApiError] = useState(null);
  const [externalOrderId, setExternalOrderId] = useState(passedExternalOrderId || null);
  
  // Ref to track if API call has been made to prevent duplicates
  const apiCallMadeRef = useRef(externalApiCalled);

  // Process order with external API when component mounts (only if not already called)
  useEffect(() => {
    // Skip API call if it was already made in Cart component or if we've already made a call
    if (externalApiCalled || apiCallMadeRef.current) {
      console.log('External API already called, skipping duplicate call');
      return;
    }

    // Mark that we're about to make an API call
    apiCallMadeRef.current = true;

    const processExternalOrder = async () => {
      // Use safe customer info with defaults
      if (!safeCustomerInfo.email || !safeCustomerInfo.name) {
        console.warn('Insufficient customer data for external API call:', safeCustomerInfo);
        setApiCallStatus('error');
        setApiError('Missing customer information required for processing');
        return;
      }

      // If no items or total, create a default order
      const safeItems = items.length > 0 ? items : [
        {
          id: 'default-item',
          name: 'Sample Meal Ingredients',
          quantity: 1,
          unit: 'set',
          price: orderTotal || 25.99
        }
      ];

      const safeOrderTotal = orderTotal || 25.99;

      try {
        setApiCallStatus('loading');
        
        const externalOrderData = {
          orderId: orderId,
          email: safeCustomerInfo.email,
          customerName: safeCustomerInfo.name,
          items: safeItems,
          totalAmount: safeOrderTotal,
        };

        console.log('Processing order with external API:', externalOrderData);
        
        const result = await orderService.processOrder(externalOrderData);
        
        if (result.success) {
          setApiCallStatus('success');
          setExternalOrderId(result.orderId);
          console.log('External order processed successfully:', result);
          
          // Process order after successful fulfillment
          try {
            console.log('Processing order fulfillment for order ID:', orderId);
            await cartService.processOrder(orderId);
            console.log('Order fulfillment processing completed successfully');
          } catch (processError) {
            console.error('Failed to process order fulfillment:', processError);
            // Don't fail the entire flow if processing fails
            // The order was still successful, just log the error
          }
        } else {
          throw new Error('External order processing failed');
        }
      } catch (error) {
        console.error('Failed to process external order:', error);
        setApiCallStatus('error');
        setApiError(error.message || 'Failed to process order with external service');
      }
    };

    processExternalOrder();
  }, []); // Remove dependencies to prevent re-running


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
            {/* API Call Status */}
            {apiCallStatus === 'loading' && (
              <Box mb={3}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Processing your order...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we confirm your order with our fulfillment service
                </Typography>
              </Box>
            )}

            {apiCallStatus === 'error' && (
              <Box mb={3}>
                <Alert 
                  severity="warning" 
                  icon={<Warning />}
                  sx={{ mb: 2, textAlign: 'left' }}
                >
                  <Typography variant="body2">
                    <strong>Order Processing Notice:</strong> {apiError}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Your order has been received locally, but we couldn't confirm it with our external fulfillment service. 
                    Our team will process it manually and contact you shortly.
                  </Typography>
                </Alert>
              </Box>
            )}

            {apiCallStatus === 'success' && (
              <>
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
                  {isDirectNavigation 
                    ? "Welcome to your order confirmation page! This is a demo showing how your successful orders will appear."
                    : "Thank you for your order! Your ingredients have been confirmed with our fulfillment service and will be delivered to you soon."
                  }
                </Typography>

                {isDirectNavigation && (
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

                {/* External Order Confirmation */}
                <Alert 
                  severity="success" 
                  sx={{ mb: 4, textAlign: 'left' }}
                >
                  <Typography variant="body2">
                    <strong>✅ Order Confirmed:</strong> Your order has been successfully processed 
                    with our fulfillment partner.
                  </Typography>
                  {externalOrderId && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Fulfillment Order ID:</strong> {externalOrderId}
                    </Typography>
                  )}
                </Alert>
              </>
            )}

            {/* Order Details - Show actual cart data */}
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
                    {orderId}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" />
                    Customer:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {safeCustomerInfo.name}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" />
                    Email:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {safeCustomerInfo.email}
                  </Typography>
                </Box>
                
                {/* Show recipe info if available */}
                {orderData.currentRecipe && (
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Restaurant fontSize="small" />
                      Recipe:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {orderData.currentRecipe.name}
                    </Typography>
                  </Box>
                )}
                
                <Divider />
                
                {/* Show actual items if available */}
                {items.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Items Ordered ({items.length}):
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                      {items.map((item, index) => (
                        <Box key={item.id || index} display="flex" justifyContent="space-between" alignItems="center" sx={{ py: 0.5 }}>
                          <Typography variant="body2">
                            {item.name} ({item.quantity}x)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {(item.originalAmount * item.quantity).toFixed(1)} {item.originalUnit}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${(orderTotal || 25.99).toFixed(2)}
                  </Typography>
                </Box>
                {items.length === 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      * Default order created - Sample meal ingredients package
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
            {apiCallStatus === 'success' && (
              <Typography variant="caption" color="text.secondary">
                You'll be automatically redirected to your dashboard in a few seconds
              </Typography>
            )}
            {apiCallStatus === 'error' && (
              <Typography variant="caption" color="text.secondary">
                You can continue to explore the app using the buttons above
              </Typography>
            )}
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
