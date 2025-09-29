import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Stack } from '@mui/material';
import { Restaurant, ArrowForward } from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { currentUser, signIn } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/recipes');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (currentUser) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#EAEDED', py: 4 }}>
        <Container maxWidth="md">
          <Box textAlign="center" sx={{ py: 8 }}>
            <Restaurant sx={{ fontSize: 80, color: '#FF9900', mb: 3 }} />
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 400,
                fontSize: '48px',
                color: '#0F1111',
                mb: 2
              }}
            >
              Welcome back, {currentUser.username}!
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#565959',
                fontSize: '20px',
                fontWeight: 400,
                mb: 4
              }}
            >
              Ready to plan your next meal?
            </Typography>
            
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => navigate('/recipes')}
                startIcon={<Restaurant />}
                endIcon={<ArrowForward />}
                sx={{ 
                  fontSize: '16px',
                  fontWeight: 400,
                  px: 4,
                  py: 2,
                  minHeight: '48px'
                }}
              >
                Browse Recipes
              </Button>
              
              <Button 
                variant="outlined" 
                size="large" 
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  fontSize: '16px',
                  fontWeight: 400,
                  px: 4,
                  py: 2,
                  color: '#0F1111',
                  borderColor: '#D5D9D9',
                  '&:hover': {
                    borderColor: '#879196',
                    backgroundColor: '#F7F8F8',
                  },
                }}
              >
                Go to Dashboard
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#EAEDED', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4,
              border: '1px solid #D5D9D9',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              width: '100%'
            }}
          >
            <Box textAlign="center" mb={3}>
              <Restaurant sx={{ fontSize: 60, color: '#FF9900', mb: 2 }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 400,
                  fontSize: '28px',
                  color: '#0F1111',
                  mb: 1
                }}
              >
                Welcome to AmazonMeal
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#565959',
                  fontSize: '14px',
                  mb: 3
                }}
              >
                Your AI-powered meal planning assistant
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0F1111',
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    fontSize: '13px',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0F1111',
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    fontSize: '13px',
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3,
                  fontSize: '13px',
                  fontWeight: 400,
                  minHeight: '29px'
                }}
              >
                Sign In
              </Button>
            </Box>
            
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" sx={{ color: '#565959', fontSize: '12px', mb: 2 }}>
                Or explore without signing in
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/recipes')}
                startIcon={<Restaurant />}
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
                Browse Recipes
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;