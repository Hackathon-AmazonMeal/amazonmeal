import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import { ArrowForward, LocalOffer, Star } from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();

  const heroSlides = [
    {
      title: 'Great Indian Festival',
      subtitle: 'Up to 80% off on Electronics, Fashion & more',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
      cta: 'Shop Now'
    },
    {
      title: 'Amazon Fresh',
      subtitle: 'Fresh groceries delivered in 2 hours',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop',
      cta: 'Order Fresh'
    }
  ];

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop', discount: 'Up to 60% off' },
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', discount: 'Min 50% off' },
    { name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', discount: 'Up to 70% off' },
    { name: 'Books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop', discount: 'Up to 40% off' }
  ];

  const deals = [
    {
      title: 'iPhone 15 Pro',
      price: '₹1,34,900',
      originalPrice: '₹1,59,900',
      discount: '16% off',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop',
      rating: 4.5
    },
    {
      title: 'Samsung Galaxy S24',
      price: '₹79,999',
      originalPrice: '₹89,999',
      discount: '11% off',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop',
      rating: 4.3
    },
    {
      title: 'MacBook Air M2',
      price: '₹1,14,900',
      originalPrice: '₹1,34,900',
      discount: '15% off',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
      rating: 4.7
    },
    {
      title: 'Sony WH-1000XM5',
      price: '₹24,990',
      originalPrice: '₹29,990',
      discount: '17% off',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      rating: 4.6
    }
  ];

  const mealCategories = [
    { name: 'Breakfast Recipes', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&h=200&fit=crop', count: '500+ recipes' },
    { name: 'Lunch Ideas', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop', count: '800+ recipes' },
    { name: 'Dinner Specials', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop', count: '1000+ recipes' },
    { name: 'Healthy Options', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop', count: '600+ recipes' }
  ];

  return (
    <Box sx={{ bgcolor: '#EAEDED', minHeight: '100vh' }}>

      {/* Main Hero Section */}
      <Box sx={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${heroSlides[0].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ color: 'white', textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                {heroSlides[0].title}
              </Typography>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {heroSlides[0].subtitle}
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#FF9900',
                  color: '#000',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': { bgcolor: '#E68900' }
                }}
              >
                {heroSlides[0].cta}
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Categories Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Shop by Category
          </Typography>
          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' }, transition: 'transform 0.2s' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={category.image}
                    alt={category.name}
                  />
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>
                      {category.name}
                    </Typography>
                    <Chip
                      label={category.discount}
                      size="small"
                      sx={{ bgcolor: '#B12704', color: 'white', fontSize: '11px' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Deals Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocalOffer sx={{ color: '#FF9900', mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Today's Deals
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {deals.map((deal, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={deal.image}
                    alt={deal.title}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, height: 40, overflow: 'hidden' }}>
                      {deal.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Star sx={{ color: '#FFA41C', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">{deal.rating}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ color: '#B12704', fontWeight: 700 }}>
                        {deal.price}
                      </Typography>
                      <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        {deal.originalPrice}
                      </Typography>
                    </Box>
                    <Chip
                      label={deal.discount}
                      size="small"
                      sx={{ bgcolor: '#CC0C39', color: 'white', fontSize: '10px' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* AmazonMeal Section */}
        <Paper sx={{ p: 4, mb: 3, bgcolor: '#F0F8FF' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9900', mb: 2 }}>
              AmazonMeal - AI Powered Meal Planning
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
              Discover personalized recipes and plan your meals with AI
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/recipes')}
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: '#FF9900',
                  color: '#000',
                  fontWeight: 700,
                  px: 4,
                  '&:hover': { bgcolor: '#E68900' }
                }}
              >
                Browse Recipes
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  color: '#FF9900',
                  borderColor: '#FF9900',
                  fontWeight: 700,
                  px: 4,
                  '&:hover': { bgcolor: '#FFF3E0' }
                }}
              >
                Start Planning
              </Button>
            </Stack>
          </Box>
          
          <Grid container spacing={2}>
            {mealCategories.map((category, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' }, transition: 'transform 0.2s' }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={category.image}
                    alt={category.name}
                  />
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {category.count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Fresh Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Amazon Fresh - Groceries in 2 hours
          </Typography>
          <Box
            sx={{
              height: 200,
              backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=300&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 2,
              }}
            />
            <Box sx={{ position: 'relative', textAlign: 'center', color: 'white' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Fresh Groceries Delivered
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/fresh')}
                sx={{
                  bgcolor: '#FF9900',
                  color: '#000',
                  fontWeight: 700,
                  px: 4,
                  '&:hover': { bgcolor: '#E68900' }
                }}
              >
                Shop Fresh
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
