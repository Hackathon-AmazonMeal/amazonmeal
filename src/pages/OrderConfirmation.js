import React from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const orderNumber = `AMZ${Date.now().toString().slice(-6)}`;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="success.main">
          Thank You!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your order has been confirmed
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Order #{orderNumber}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Your fresh ingredients will be delivered on <strong>{deliveryDate}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          We'll send you tracking information via email once your order is on its way.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/recipes')}
          sx={{ mr: 2 }}
        >
          Browse More Recipes
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
        >
          Home
        </Button>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;