import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, Box, Paper, IconButton, Divider } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Delete, ShoppingCart } from '@mui/icons-material';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    clearCart();
    navigate('/order-confirmation');
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add some ingredients from recipes to get started!
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      
      <Paper elevation={2}>
        <List>
          {cartItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => removeFromCart(item.id)}
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={clearCart}
              color="error"
            >
              Clear Cart
            </Button>
            <Button
              variant="contained"
              onClick={handleCheckout}
              size="large"
              sx={{ flex: 1 }}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Cart;