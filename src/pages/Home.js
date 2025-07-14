import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { currentUser, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/recipes');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (currentUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome back, {currentUser.username}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ready to plan your next meal?
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" size="large" onClick={() => navigate('/recipes')}>
            Browse Recipes
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Welcome to AmazonMeal
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Your AI-powered meal planning assistant
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;