import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Paper,
} from '@mui/material';
import { Restaurant } from '@mui/icons-material';

const Fresh = () => {
  const navigate = useNavigate();

  const banners = [
    {
      title: 'Fresh Produce Delivered',
      subtitle: 'Farm-fresh vegetables and fruits at your doorstep',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=300&fit=crop',
      color: '#4CAF50'
    },
    {
      title: 'Organic & Local',
      subtitle: 'Support local farmers with organic produce',
      image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&h=300&fit=crop',
      color: '#FF9900'
    }
  ];

  const groceries = [
    { name: 'Fresh Bananas', price: '$2.99', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop' },
    { name: 'Organic Apples', price: '$4.99', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop' },
    { name: 'Fresh Milk', price: '$3.49', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop' },
    { name: 'Whole Grain Bread', price: '$2.79', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
    { name: 'Free Range Eggs', price: '$5.99', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop' },
    { name: 'Fresh Tomatoes', price: '$3.99', image: 'https://images.unsplash.com/photo-1546470427-e5b89b618b84?w=200&h=200&fit=crop' },
    { name: 'Organic Spinach', price: '$2.49', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop' },
    { name: 'Greek Yogurt', price: '$4.29', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 400, mb: 1 }}>
          Amazon Fresh
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fresh groceries delivered to your door
        </Typography>
      </Box>

      {/* Banners */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {banners.map((banner, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper
              sx={{
                position: 'relative',
                height: 200,
                backgroundImage: `url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {banner.title}
                </Typography>
                <Typography variant="body1">
                  {banner.subtitle}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Meal Planning CTA */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center',
          position: 'relative',
          backgroundImage: 'url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=400&fit=crop&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Restaurant sx={{ fontSize: 48, color: '#FF9900', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Plan Your Meals with AI
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Get personalized meal recommendations and automatically generate shopping lists
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{
              bgcolor: '#FF9900',
              color: '#000000',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: '#E68900',
              },
            }}
          >
            Start Meal Planning
          </Button>
        </Box>
      </Paper>

      {/* Grocery Grid */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Popular Items
      </Typography>
      <Grid container spacing={2}>
        {groceries.map((item, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Card sx={{ height: '100%', border: '1px solid #E0E0E0' }}>
              <CardMedia
                component="img"
                height="150"
                image={item.image}
                alt={item.name}
              />
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 400, mb: 1 }}>
                  {item.name}
                </Typography>
                <Typography variant="h6" sx={{ color: '#B12704', fontWeight: 700 }}>
                  {item.price}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    mt: 1,
                    fontSize: '12px',
                    borderColor: '#D5D9D9',
                    color: '#0F1111',
                    '&:hover': {
                      borderColor: '#879196',
                      bgcolor: '#F7F8F8',
                    },
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Fresh;
