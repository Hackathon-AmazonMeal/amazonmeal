import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Divider,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Restaurant } from '@mui/icons-material';
import { useUser } from '../../contexts/UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, getDemoUsers } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  const handleGuestLogin = async () => {
    try {
      setError('');
      setLoading(true);
      // Create a guest user with minimal information
      const guestUser = {
        username: `Guest_${Math.floor(Math.random() * 10000)}`,
        email: `guest_${Date.now()}@example.com`,
        preferences: {
          dietaryRestrictions: [],
          allergies: [],
          dislikedIngredients: [],
          cookingTime: 'MEDIUM',
          cuisinePreferences: [],
          skillLevel: 'BEGINNER'
        }
      };
      
      await signUp(guestUser);
      // Redirect to preferences page for setup
      navigate('/preferences');
    } catch (error) {
      setError('Failed to create guest account');
    }
    
    setLoading(false);
  };

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };


  const demoUsers = getDemoUsers();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#EAEDED',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4,
            border: '1px solid #D5D9D9',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF'
          }}
        >
          {/* Logo */}
          <Box textAlign="center" mb={4}>
            <Restaurant 
              sx={{ 
                fontSize: 40, 
                color: '#FF9900', 
                mb: 2 
              }} 
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ 
                fontWeight: 400,
                fontSize: '28px',
                color: '#0F1111',
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#565959',
              fontSize: '14px'
            }}>
              Access your personalized recipes
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: '#F8D7DA',
                border: '1px solid #F5C6CB',
                color: '#721C24',
                borderRadius: '4px',
                fontSize: '13px'
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0F1111',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  fontSize: '13px',
                  '& fieldset': {
                    borderColor: '#888C8C',
                  },
                  '&:hover fieldset': {
                    borderColor: '#E77600',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#E77600',
                    borderWidth: 2,
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0F1111',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  fontSize: '13px',
                  '& fieldset': {
                    borderColor: '#888C8C',
                  },
                  '&:hover fieldset': {
                    borderColor: '#E77600',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#E77600',
                    borderWidth: 2,
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                fontSize: '13px',
                fontWeight: 400,
                minHeight: '29px'
              }}
              disabled={loading}
            >
              {loading ? (
                <Box display="flex" alignItems="center">
                  <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                  Signing In...
                </Box>
              ) : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3, borderColor: '#D5D9D9' }}>
            <Typography variant="body2" sx={{ 
              color: '#565959',
              fontSize: '12px'
            }}>
              OR TRY WITHOUT ACCOUNT
            </Typography>
          </Divider>

          {/* Guest Login Button */}
          <Button
            fullWidth
            variant="outlined"
            sx={{ 
              mb: 3, 
              py: 1.5,
              fontSize: '13px',
              fontWeight: 400,
              color: '#0F1111',
              borderColor: '#D5D9D9',
              '&:hover': {
                borderColor: '#879196',
                backgroundColor: '#F7F8F8',
              },
            }}
            onClick={handleGuestLogin}
            disabled={loading}
          >
            Login as Guest
          </Button>

          <Divider sx={{ my: 3, borderColor: '#D5D9D9' }}>
            <Typography variant="body2" sx={{ 
              color: '#565959',
              fontSize: '12px'
            }}>
              OR TRY DEMO
            </Typography>
          </Divider>

          {/* Demo Users */}
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ 
              color: '#565959',
              fontSize: '12px',
              textAlign: 'center'
            }}>
              Try these demo accounts:
            </Typography>
            {demoUsers.map((user, index) => (
              <Card 
                key={index} 
                sx={{
                  border: '1px solid #D5D9D9',
                  borderRadius: '4px',
                  boxShadow: 'none'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 400,
                        fontSize: '13px',
                        color: '#0F1111'
                      }}>
                        {user.username}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: '#565959',
                        fontSize: '11px'
                      }}>
                        {user.email}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleDemoLogin(user.email)}
                      sx={{
                        fontSize: '11px',
                        fontWeight: 400,
                        color: '#0F1111',
                        borderColor: '#D5D9D9',
                        minHeight: '24px',
                        px: 2,
                        '&:hover': {
                          borderColor: '#879196',
                          backgroundColor: '#F7F8F8',
                        },
                      }}
                    >
                      Use Account
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;