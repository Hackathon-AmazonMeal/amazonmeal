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
  Snackbar,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useRecipes } from '../contexts/RecipeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Delete, ShoppingCart, Person, Email, Add, Remove } from '@mui/icons-material';
import orderService from '../services/orderService';
import cartService from '../services/cartService';

const Cart = () => {
  const location = useLocation()

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
    getCartSummary,             // Add cart summary
    updateItemBrand             // Add brand update function
  } = useCart();

  // Brand constants
  const BRAND_OPTIONS = {
    meat: ['Tyson', 'Perdue', 'Organic Valley', 'Local Farm'],
    dairy: ['Organic Valley', 'Horizon', 'Local Dairy', 'Store Brand'],
    produce: ['Organic', 'Local Farm', 'Conventional'],
    default: ['Generic', 'Store Brand', 'Premium']
  };

  // Available brands for each ingredient type
  const getBrandOptions = (item) => {
    if (item.brands && Array.isArray(item.brands) && item.brands.length > 0) {
      return item.brands;
    }

    const name = item.name.toLowerCase();
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork')) {
      return BRAND_OPTIONS.meat;
    } else if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt')) {
      return BRAND_OPTIONS.dairy;
    } else if (name.includes('tomato') || name.includes('onion') || name.includes('lettuce') || name.includes('carrot') || name.includes('potato')) {
      return BRAND_OPTIONS.produce;
    } else {
      return BRAND_OPTIONS.default;
    }
  };

  const handleBrandChange = (itemId, newBrand) => {
    if (updateItemBrand) {
      updateItemBrand(itemId, newBrand);
    }
  };
  
  // Get recipe information from RecipeContext
  const { recipes, getCurrentRecipe } = useRecipes();
  const currentRecipe = getCurrentRecipe();
  
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

      // // console.log('Processing order with customer info:', customerInfo);
      // // console.log('Cart items:', cartItems);
      // // console.log('Total amount:', cartTotal);
      // // console.log('Current recipe from context:', currentRecipe);
      
      // Get the current recipe from RecipeContext
      let orderResult;
      
      // Log the current state for debugging
      // // console.log('Current recipe from RecipeContext:', currentRecipe);
      // // console.log('All recipes in RecipeContext:', recipes);
      // // console.log('First cart item:', cartItems.length > 0 ? cartItems[0] : 'No items');
      
      // Make sure we have a valid recipe
      if (!currentRecipe || (!currentRecipe.name && !currentRecipe.title)) {
        // console.warn('No valid recipe found in RecipeContext');
        
        // Try to find a recipe based on cart items
        if (cartItems.length > 0 && cartItems[0].recipeName) {
          const matchingRecipe = recipes.find(r => 
            r.name === cartItems[0].recipeName || r.title === cartItems[0].recipeName
          );
          
          if (matchingRecipe) {
            // // console.log('Found matching recipe in RecipeContext:', matchingRecipe);
            currentRecipe = matchingRecipe;
          } else {
            // console.warn('No matching recipe found in RecipeContext');
          }
        }
      }
            console.log('(*(*(*')
      // Process order with external API
      orderResult = await orderService.processOrder({
        email: customerInfo.email,
        customerName: customerInfo.name,
        items: cartItems,
        totalAmount: cartTotal,
        recipe: currentRecipe, // Use the recipe from RecipeContext
      });

      if (orderResult && orderResult.success) {
        
        // setSuccessMessage(`Order ${orderResult.orderId} processed successfully!`);

        //Email sent API
        // Process order after successful fulfillment
        try {
          // // console.log('Processing order fulfillment for order ID:', orderResult.orderId);
          await cartService.processOrder(orderResult.orderId);
          // // console.log('Order fulfillment processing completed successfully');
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
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 400, mb: 3 }}>
          Shopping Cart
        </Typography>
        
        {isEmpty() ? (
          <Box textAlign="center" py={8} sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #D5D9D9' }}>
            <ShoppingCart sx={{ fontSize: 64, color: '#879196', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ color: '#0F1111', fontWeight: 400 }}>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="#565959">
              Add some ingredients from recipes to get started!
            </Typography>
          </Box>
        ) : (
          <Paper elevation={0} sx={{ border: '1px solid #D5D9D9', borderRadius: 1 }}>
            <List sx={{ p: 0 }}>
              {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    sx={{ 
                      py: 2, 
                      px: 3,
                      borderBottom: index < cartItems.length - 1 ? '1px solid #E6E6E6' : 'none',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 400, color: '#0F1111', fontSize: '14px' }}>
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                          <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>
                            {(item.originalAmount * item.quantity).toFixed(1)} {item.originalUnit}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#B12704', fontSize: '14px', fontWeight: 700 }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Stack>
                      }
                    />
                    {/* brand list */}
                    <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
                      <InputLabel sx={{ fontSize: '12px' }}>Brand</InputLabel>
                      <Select
                        value={item.brand || getBrandOptions(item)[0]}
                        label="Brand"
                        onChange={(e) => handleBrandChange(item.id, e.target.value)}
                        sx={{ 
                          fontSize: '12px',
                          '& .MuiSelect-select': {
                            py: 1,
                          }
                        }}
                      >
                        {getBrandOptions(item).map((brand) => (
                          <MenuItem key={brand} value={brand} sx={{ fontSize: '12px' }}>
                            {brand}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* Quantity Controls (same as CartSidebar) */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                        sx={{
                          border: '1px solid #D5D9D9',
                          borderRadius: '4px',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            backgroundColor: '#F7F8F8',
                          },
                        }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      
                      <Typography
                        variant="body2"
                        sx={{
                          minWidth: 32,
                          textAlign: 'center',
                          fontWeight: 400,
                          px: 1,
                          py: 0.5,
                          border: '1px solid #D5D9D9',
                          borderRadius: '4px',
                          backgroundColor: '#FFFFFF',
                          fontSize: '12px',
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      
                      <IconButton
                        size="small"
                        onClick={() => increaseQuantity(item.id)}
                        sx={{
                          border: '1px solid #D5D9D9',
                          borderRadius: '4px',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            backgroundColor: '#F7F8F8',
                          },
                        }}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Stack>

                    <IconButton 
                      edge="end" 
                      onClick={() => removeIngredient(item.id)}
                      sx={{
                        color: '#B12704',
                        '&:hover': {
                          backgroundColor: 'rgba(177, 39, 4, 0.1)',
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </ListItem>
                  {index < cartItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ p: 3, bgcolor: '#F7F8F8', borderTop: '1px solid #E6E6E6' }}>
              {/* Cart Summary (same as CartSidebar) */}
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>
                    Total Items:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 400, color: '#0F1111', fontSize: '12px' }}>
                    {totalItems}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>
                    Unique Items:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 400, color: '#0F1111', fontSize: '12px' }}>
                    {cartSummary.totalUniqueItems}
                  </Typography>
                </Stack>
                
                <Divider sx={{ borderColor: '#D5D9D9' }} />
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 700, color: '#0F1111' }}>
                    Subtotal:
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 700, color: '#B12704' }}>
                    ${cartTotal.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>

              {/* Pricing Notice (same as CartSidebar) */}
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3,
                  backgroundColor: '#D1ECF1',
                  border: '1px solid #B8DAFF',
                  '& .MuiAlert-message': {
                    fontSize: '12px',
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '12px' }}>
                  Prices are estimated. Actual prices may vary based on store and availability.
                </Typography>
              </Alert>
              
              {/* Show customer info that will be used */}
              <Box sx={{ 
                mb: 2, 
                p: 2, 
                bgcolor: '#FFFFFF', 
                borderRadius: '4px', 
                border: '1px solid #D5D9D9' 
              }}>
                <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }} gutterBottom>
                  <Person sx={{ fontSize: 14, mr: 0.5 }} />
                  Order will be placed for: <strong style={{ color: '#0F1111' }}>{getCustomerInfo().name}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px' }}>
                  <Email sx={{ fontSize: 14, mr: 0.5 }} />
                  Confirmation email: <strong style={{ color: '#0F1111' }}>{getCustomerInfo().email}</strong>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={clearCart}
                  disabled={isProcessingOrder}
                  sx={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#0F1111',
                    borderColor: '#D5D9D9',
                    '&:hover': {
                      borderColor: '#879196',
                      backgroundColor: '#F7F8F8',
                    },
                  }}
                >
                  Clear Cart
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCheckout}
                  size="large"
                  sx={{ 
                    flex: 1,
                    fontSize: '13px',
                    fontWeight: 400,
                    minHeight: '29px',
                  }}
                  disabled={isEmpty() || isProcessingOrder}
                  startIcon={isProcessingOrder ? <CircularProgress size={16} /> : null}
                >
                  {isProcessingOrder ? 'Processing Order...' : `Proceed to Checkout (${totalItems} items)`}
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
