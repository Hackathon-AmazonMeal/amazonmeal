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
  Stack,
  Snackbar
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Delete, ShoppingCart, Person, Email, Add, Remove } from '@mui/icons-material';
import orderService from '../services/orderService';
import cartService from '../services/cartService';

const Cart = () => {
  // Use the SAME properties and methods as CartSidebar for perfect sync
  const { 
    items: cartItems,           // Alias to match existing code
    removeIngredient, 
    clearCart, 
    getEstimatedTotal,          // Use same method as CartSidebar
    totalItems,                 // Add total items count
    isEmpty,                    // Add isEmpty check
    increaseQuantity,           // Add quantity controls
    decreaseQuantity,           // Add quantity controls
    currentRecipe,              // Add current recipe info
    getCartSummary              // Add cart summary
  } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Calculate total using same method as CartSidebar
  const cartTotal = getEstimatedTotal();
  const cartSummary = getCartSummary();
  
  // State for order processing
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Default customer information - using your provided details
  const getCustomerInfo = () => ({
    name: user?.name || user?.preferences?.name || 'Chef Ayush',
    email: user?.email || user?.preferences?.email || 'homeayush79@gmail.com',
  });

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    try {
      setIsProcessingOrder(true);
      setOrderError(null);

      const customerInfo = getCustomerInfo();

      // Validate order data
      const validation = orderService.validateOrderData({
        email: customerInfo.email,
        customerName: customerInfo.name,
        items: cartItems,
        totalAmount: cartTotal,
      });

      if (!validation.isValid) {
        setOrderError(validation.errors.join(', '));
        return;
      }

      console.log('Processing order with customer info:', customerInfo);
      console.log('Cart items:', cartItems);
      console.log('Total amount:', cartTotal);

      // Process order with external API
      const orderResult = await orderService.processOrder({
        email: customerInfo.email,
        customerName: customerInfo.name,
        items: cartItems,
        totalAmount: cartTotal,
        recipeName: currentRecipe,
      });

      if (orderResult.success) {
        
        // setSuccessMessage(`Order ${orderResult.orderId} processed successfully!`);

        //Email sent API
        // Process order after successful fulfillment
        try {
          console.log('Processing order fulfillment for order ID:', orderResult.orderId);
          await cartService.processOrder(orderResult.orderId);
          console.log('Order fulfillment processing completed successfully');
        } catch (processError) {
          console.error('Failed to process order fulfillment:', processError);
          // Don't fail the entire flow if processing fails
          // The order was still successful, just log the error
        }
        
        // Navigate to success page after a short delay
        
          navigate('/checkout/success', { 
            state: { 
              orderId: orderResult.orderId,
              customerInfo: customerInfo,
              orderTotal: cartTotal,
              items: cartItems,
              externalApiCalled: true, // Flag to indicate API was already called
              externalOrderId: orderResult.orderId
            }
          });
        
        // Clear cart and show success
        clearCart();
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
            <List>
              {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    sx={{ py: 2 }}
                  >
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
                  {index < cartItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
              {/* Cart Summary (same as CartSidebar) */}
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
                    ${cartTotal.toFixed(2)}
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
              <Box sx={{ mb: 2, p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }}>
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
                  {isProcessingOrder ? 'Processing Order...' : `Checkout - $${cartTotal.toFixed(2)}`}
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