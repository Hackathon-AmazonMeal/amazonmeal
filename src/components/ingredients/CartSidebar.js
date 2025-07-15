import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Stack,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  CheckCircle,
} from '@mui/icons-material';

// Hooks and Context
import { useCart } from '../../contexts/CartContext';
import { useUserPreferences } from '../../hooks/useUserPreferences';

function CartSidebar() {
  const navigate = useNavigate();
  const {
    items,
    currentRecipe,
    totalItems,
    isEmpty,
    increaseQuantity,
    decreaseQuantity,
    removeIngredient,
    clearCart,
    getEstimatedTotal,
    getCartSummary,
  } = useCart();
  
  const { addOrderToHistory } = useUserPreferences();

  const handleCheckout = () => {
    if (isEmpty()) return;

    // Prepare order data for checkout
    const orderData = {
      orderId: `AM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerInfo: {
        name: 'Chef Ayush',
        email: 'homeayush79@gmail.com'
      },
      orderTotal: getEstimatedTotal(),
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        amount: item.amount,
        unit: item.unit,
        price: item.price || 2.50,
        originalAmount: item.originalAmount,
        originalUnit: item.originalUnit,
      })),
      totalItems,
      currentRecipe: currentRecipe ? {
        id: currentRecipe.id,
        name: currentRecipe.name,
      } : null,
      externalApiCalled: false, // Let CheckoutSuccess handle the API call
    };

    // Add to order history
    const historyOrder = {
      recipeId: currentRecipe?.id,
      recipeName: currentRecipe?.name,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        amount: item.amount,
        unit: item.unit,
      })),
      totalItems,
      estimatedTotal: getEstimatedTotal(),
    };

    addOrderToHistory(historyOrder);
    clearCart();
    
    // Navigate with order data
    navigate('/checkout/success', { 
      state: orderData 
    });
  };

  const cartSummary = getCartSummary();
  const estimatedTotal = getEstimatedTotal();

  if (isEmpty()) {
    return (
      <Card sx={{ position: 'sticky', top: 24 }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <ShoppingCart 
            sx={{ 
              fontSize: 64, 
              color: 'text.disabled', 
              mb: 2 
            }} 
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a recipe and add ingredients to get started
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ position: 'sticky', top: 24 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <ShoppingCart color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Shopping Cart
          </Typography>
          <Chip 
            label={totalItems} 
            size="small" 
            color="primary" 
          />
        </Stack>

        {currentRecipe && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Recipe:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {currentRecipe.name}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Ingredients List */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Ingredients ({cartSummary.totalUniqueItems}):
          </Typography>
          
          <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
            {items.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  px: 0,
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemText
                  primary={item.name}
                  secondary={`${(item.originalAmount * item.quantity).toFixed(1)} ${item.originalUnit}`}
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { fontWeight: 500 }
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption'
                  }}
                />
                
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => decreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 24,
                      textAlign: 'center',
                      fontWeight: 500,
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
                  
                  <IconButton
                    size="small"
                    onClick={() => removeIngredient(item.id)}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Cart Summary */}
        <Box mb={3}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Total Items:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {totalItems}
            </Typography>
          </Stack>
          
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Estimated Total:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              ${estimatedTotal.toFixed(2)}
            </Typography>
          </Stack>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption">
              Prices are estimated. Actual prices may vary based on store and availability.
            </Typography>
          </Alert>
        </Box>

        {/* Action Buttons */}
        <Stack spacing={2}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<CheckCircle />}
            onClick={handleCheckout}
            sx={{ py: 1.5 }}
          >
            Checkout
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={clearCart}
            color="error"
          >
            Clear Cart
          </Button>
        </Stack>

        {/* Additional Info */}
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary" display="block">
            💡 Tip: Adjust quantities based on your household size and preferences.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CartSidebar;
