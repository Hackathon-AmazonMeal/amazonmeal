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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
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

// Brand constants
const BRAND_OPTIONS = {
  meat: ['Tyson', 'Perdue', 'Organic Valley', 'Local Farm'],
  dairy: ['Organic Valley', 'Horizon', 'Local Dairy', 'Store Brand'],
  produce: ['Generic', 'Local Farm', 'Conventional'],
  default: ['Generic', 'Store Brand', 'Premium']
};

// Available brands for each ingredient type
const getBrandOptions = (item) => {
  if (item.brands && Array.isArray(item.brands) && item.brands.length > 0) {
    return item.brands;
  }
  console.log("items:  ",item);

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
    updateItemBrand,
  } = useCart();
  
  const { addOrderToHistory } = useUserPreferences();

  const handleBrandChange = (itemId, newBrand) => {
    if (updateItemBrand) {
      updateItemBrand(itemId, newBrand);
    }
  };

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
      <Card sx={{ 
        position: 'sticky', 
        top: 24,
        border: '1px solid #D5D9D9',
        borderRadius: '8px',
        boxShadow: 'none'
      }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <ShoppingCart 
            sx={{ 
              fontSize: 48, 
              color: '#879196', 
              mb: 2 
            }} 
          />
          <Typography variant="h6" sx={{ 
            color: '#565959',
            fontSize: '16px',
            fontWeight: 400,
            mb: 1
          }}>
            Your cart is empty
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#565959',
            fontSize: '12px'
          }}>
            Select a recipe and add ingredients to get started
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      position: 'sticky', 
      top: 24,
      border: '1px solid #D5D9D9',
      borderRadius: '8px',
      boxShadow: 'none'
    }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <ShoppingCart sx={{ color: '#FF9900', fontSize: 20 }} />
          <Typography variant="h6" sx={{ 
            fontWeight: 700,
            fontSize: '16px',
            color: '#0F1111'
          }}>
            Shopping Cart
          </Typography>
          <Chip 
            label={totalItems} 
            size="small" 
            sx={{
              backgroundColor: '#FF9900',
              color: '#000000',
              fontSize: '11px',
              height: '20px',
              fontWeight: 700
            }}
          />
        </Stack>

        {currentRecipe && (
          <Box mb={2}>
            <Typography variant="body2" sx={{ 
              color: '#565959',
              fontSize: '12px',
              mb: 0.5
            }}>
              Recipe:
            </Typography>
            <Typography variant="body1" sx={{ 
              fontWeight: 400,
              fontSize: '13px',
              color: '#0F1111'
            }}>
              {currentRecipe.name}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2, borderColor: '#D5D9D9' }} />

        {/* Ingredients List */}
        <Box mb={2}>
          <Typography variant="body2" sx={{ 
            color: '#565959',
            fontSize: '12px',
            mb: 1
          }}>
            Ingredients ({cartSummary.totalUniqueItems}):
          </Typography>
          
          <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
            {items.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  px: 0,
                  py: 1,
                  borderBottom: '1px solid #E6E6E6',
                }}
              >
                <ListItemText
                  primary={item.name}
                  secondary={`${(item.originalAmount * item.quantity).toFixed(1)} ${item.originalUnit}`}
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { 
                      fontWeight: 400,
                      fontSize: '13px',
                      color: '#0F1111'
                    }
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    sx: {
                      fontSize: '11px',
                      color: '#565959'
                    }
                  }}
                />
                
                <FormControl size="small" sx={{ minWidth: 80, mr: 1 }}>
                  <InputLabel sx={{ fontSize: '10px' }}>Brand</InputLabel>
                  <Select
                    value={item.brand || getBrandOptions(item)[0]}
                    label="Brand"
                    onChange={(e) => handleBrandChange(item.id, e.target.value)}
                    sx={{ 
                      fontSize: '10px',
                      height: '28px',
                      '& .MuiSelect-select': {
                        py: 0.5,
                      }
                    }}
                  >
                    {getBrandOptions(item).map((brand) => (
                      <MenuItem key={brand} value={brand} sx={{ fontSize: '10px' }}>
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => decreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                    sx={{
                      border: '1px solid #D5D9D9',
                      borderRadius: '4px',
                      width: 24,
                      height: 24,
                      '&:hover': {
                        backgroundColor: '#F7F8F8',
                      },
                    }}
                  >
                    <Remove sx={{ fontSize: 12 }} />
                  </IconButton>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 20,
                      textAlign: 'center',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#0F1111'
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
                      width: 24,
                      height: 24,
                      '&:hover': {
                        backgroundColor: '#F7F8F8',
                      },
                    }}
                  >
                    <Add sx={{ fontSize: 12 }} />
                  </IconButton>
                  
                  <IconButton
                    size="small"
                    onClick={() => removeIngredient(item.id)}
                    sx={{
                      color: '#B12704',
                      '&:hover': {
                        backgroundColor: 'rgba(177, 39, 4, 0.1)',
                      },
                    }}
                  >
                    <Delete sx={{ fontSize: 12 }} />
                  </IconButton>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#D5D9D9' }} />

        {/* Cart Summary */}
        <Box mb={3}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography variant="body2" sx={{ 
              color: '#565959',
              fontSize: '12px'
            }}>
              Total Items:
            </Typography>
            <Typography variant="body2" sx={{ 
              fontWeight: 400,
              fontSize: '12px',
              color: '#0F1111'
            }}>
              {totalItems}
            </Typography>
          </Stack>
          
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="body1" sx={{ 
              fontWeight: 700,
              fontSize: '14px',
              color: '#0F1111'
            }}>
              Subtotal:
            </Typography>
            <Typography variant="body1" sx={{ 
              fontWeight: 700,
              fontSize: '14px',
              color: '#B12704'
            }}>
              ${estimatedTotal.toFixed(2)}
            </Typography>
          </Stack>

          <Alert 
            severity="info" 
            sx={{ 
              mb: 2,
              backgroundColor: '#D1ECF1',
              border: '1px solid #B8DAFF',
              color: '#0C5460',
              borderRadius: '4px',
              '& .MuiAlert-message': {
                fontSize: '11px'
              }
            }}
          >
            <Typography variant="caption" sx={{ fontSize: '11px' }}>
              Prices are estimated. Actual prices may vary based on store and availability.
            </Typography>
          </Alert>
        </Box>

        {/* Action Buttons */}
        <Stack spacing={1.5}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<CheckCircle />}
            onClick={handleCheckout}
            sx={{ 
              py: 1.5,
              fontSize: '13px',
              fontWeight: 400,
              minHeight: '29px'
            }}
          >
            Checkout
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={clearCart}
            sx={{
              fontSize: '12px',
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
        </Stack>

        {/* Additional Info */}
        <Box mt={2}>
          <Typography variant="caption" sx={{ 
            color: '#565959',
            fontSize: '10px',
            display: 'block'
          }}>
            💡 Tip: Adjust quantities based on your household size and preferences.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CartSidebar;
