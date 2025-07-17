import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Box, 
  Paper, 
  IconButton, 
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  Chip
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  Delete, 
  ShoppingCart, 
  Person, 
  Email, 
  Add, 
  Remove,
  Restaurant 
} from '@mui/icons-material';
import orderService from '../services/orderService';

const Cart = () => {
  // Use the SAME properties and methods as CartSidebar
  const { 
    items,                    // Same as CartSidebar
    currentRecipe,           // Same as CartSidebar
    totalItems,              // Same as CartSidebar
    isEmpty,                 // Same as CartSidebar
    increaseQuantity,        // Same as CartSidebar
    decreaseQuantity,        // Same as CartSidebar
    removeIngredient,        // Same as CartSidebar
    clearCart,               // Same as CartSidebar
    getEstimatedTotal,       // Same as CartSidebar
    getCartSummary           // Same as CartSidebar
  } = useCart();
  
  const { user } = useUser();
  const navigate = useNavigate();
  
  // State for order processing
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Default customer information - using your provided details
  const getCustomerInfo = () => ({
    name: user?.name || user?.preferences?.name || 'Chef Ayush',
    email: user?.email || user?.preferences?.email || 'homeayush79@gmail.com',
  });

  // Get computed values (same as CartSidebar)
  const cartSummary = getCartSummary();
  const estimatedTotal = getEstimatedTotal();

  const handleCheckout = async () => {
    if (isEmpty()) return;
    
    try {
      setIsProcessingOrder(true);
      setOrderError(null);

      const customerInfo = getCustomerInfo();

      // Convert cart items to the format expected by orderService
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price || 2.50
      }));

      // Validate order data
      const validation = orderService.validateOrderData({
        email: customerInfo.email,
        customerName: customerInfo.name,
        items: orderItems,
        totalAmount: estimatedTotal,
      });

      if (!validation.isValid) {
        setOrderError(validation.errors.join(', '));
        return;
      }

      // console.log('Processing order with customer info:', customerInfo);
      // console.log('Cart items:', orderItems);
      // console.log('Total amount:', estimatedTotal);

      // Process order with external API
      const orderResult = await orderService.processOrder({
        email: customerInfo.email,
        customerName: customerInfo.name,
        items: orderItems,
        totalAmount: estimatedTotal,
      });

      if (orderResult.success) {
        // Clear cart and show success
        clearCart();
        setSuccessMessage(`Order ${orderResult.orderId} processed successfully!`);
        
        // Navigate to success page after a short delay
        setTimeout(() => {
          navigate('/checkout/success', { 
            state: { 
              orderId: orderResult.orderId,
              customerInfo: customerInfo,
              orderTotal: estimatedTotal,
              items: orderItems,
              externalApiCalled: true, // Flag to indicate API was already called
              externalOrderId: orderResult.orderId
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      setOrderError(error.message || 'Failed to process order. Please try again.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage('');
  };

  const handleCloseErrorMessage = () => {
    setOrderError(null);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        
        {isEmpty() ? (
          <Box textAlign="center" py={8}>
            <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Add some ingredients from recipes to get started!
            </Typography>
          </Box>
        ) : (
          <Paper elevation={2}>
            {/* Recipe Info (same as CartSidebar) */}
            {currentRecipe && (
              <Box sx={{ p: 3, bgcolor: 'primary.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Restaurant color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recipe: {currentRecipe.name}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  All ingredients for this recipe have been added to your cart
                </Typography>
              </Box>
            )}

            {/* Cart Summary Header */}
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">
                  Cart Summary
                </Typography>
                <Chip 
                  label={`${totalItems} items`} 
                  size="small" 
                  color="primary" 
                />
                <Chip 
                  label={`${cartSummary.totalUniqueItems} unique`} 
                  size="small" 
                  variant="outlined" 
                />
              </Stack>
            </Box>

            <List>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            {(item.originalAmount * item.quantity).toFixed(1)} {item.originalUnit}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Stack>
                      }
                    />
                    
                    {/* Quantity Controls (same as CartSidebar) */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          minWidth: 32,
                          textAlign: 'center',
                          fontWeight: 600,
                          px: 1,
                          py: 0.5,
                          bgcolor: 'primary.50',
                          borderRadius: 1,
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      
                      <IconButton
                        size="small"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Stack>

                    <IconButton 
                      edge="end" 
                      onClick={() => removeIngredient(item.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItem>
                  {index < items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
              {/* Cart Totals (same calculation as CartSidebar) */}
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1" color="text.secondary">
                    Total Items:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {totalItems}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1" color="text.secondary">
                    Unique Items:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {cartSummary.totalUniqueItems}
                  </Typography>
                </Stack>
                
                <Divider />
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">
                    Estimated Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    ${estimatedTotal.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>

              {/* Pricing Notice (same as CartSidebar) */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Prices are estimated. Actual prices may vary based on store and availability.
                </Typography>
              </Alert>
              
              {/* Show customer info that will be used */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }}>
                <Typography variant="body2" color="info.main" gutterBottom>
                  <Person sx={{ fontSize: 16, mr: 0.5 }} />
                  Order will be placed for: <strong>{getCustomerInfo().name}</strong>
                </Typography>
                <Typography variant="body2" color="info.main">
                  <Email sx={{ fontSize: 16, mr: 0.5 }} />
                  Confirmation email: <strong>{getCustomerInfo().email}</strong>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={clearCart}
                  color="error"
                  disabled={isProcessingOrder}
                >
                  Clear Cart
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCheckout}
                  size="large"
                  sx={{ flex: 1 }}
                  disabled={isEmpty() || isProcessingOrder}
                  startIcon={isProcessingOrder ? <CircularProgress size={20} /> : null}
                >
                  {isProcessingOrder ? 'Processing Order...' : `Checkout - $${estimatedTotal.toFixed(2)}`}
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!orderError}
        autoHideDuration={6000}
        onClose={handleCloseErrorMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseErrorMessage} severity="error" sx={{ width: '100%' }}>
          {orderError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;
