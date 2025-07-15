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
  Snackbar
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Delete, ShoppingCart, Person, Email } from '@mui/icons-material';
import orderService from '../services/orderService';

const Cart = () => {
  const { cartItems, removeIngredient, clearCart, cartTotal } = useCart();
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
              orderTotal: cartTotal 
            }
          });
        }, 2000); // Increased delay to show success message
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
        
        {cartItems.length === 0 ? (
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
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        onClick={() => removeIngredient(item.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.quantity} ${item.unit} - $${(item.price * item.quantity).toFixed(2)}`}
                    />
                  </ListItem>
                  {index < cartItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Total: ${cartTotal.toFixed(2)}
              </Typography>
              
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
                  disabled={cartItems.length === 0 || isProcessingOrder}
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