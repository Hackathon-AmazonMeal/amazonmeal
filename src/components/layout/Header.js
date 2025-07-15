import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Restaurant,
  ShoppingCart,
  Dashboard,
  Settings,
} from '@mui/icons-material';

// Hooks
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useCart } from '../../contexts/CartContext';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isNewUser } = useUserPreferences();
  const { totalItems } = useCart();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Don't show header on welcome page
  if (location.pathname === '/welcome') {
    return null;
  }

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo/Brand */}
        <Box 
          display="flex" 
          alignItems="center" 
          sx={{ cursor: 'pointer' }}
          onClick={() => handleNavigation(isNewUser() ? '/welcome' : '/dashboard')}
        >
          <Restaurant 
            sx={{ 
              color: 'primary.main', 
              fontSize: 32, 
              mr: 1 
            }} 
          />
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Recipe Recommendations
          </Typography>
        </Box>

        {/* Navigation */}
        {!isNewUser() && (
          <Box display="flex" alignItems="center" gap={1}>
            {/* Dashboard */}
            <Button
              startIcon={<Dashboard />}
              onClick={() => handleNavigation('/dashboard')}
              sx={{
                color: isActive('/dashboard') ? 'primary.main' : 'text.primary',
                fontWeight: isActive('/dashboard') ? 600 : 400,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              Dashboard
            </Button>

            {/* Recipes */}
            <Button
              startIcon={<Restaurant />}
              onClick={() => handleNavigation('/recipes')}
              sx={{
                color: isActive('/recipes') ? 'primary.main' : 'text.primary',
                fontWeight: isActive('/recipes') ? 600 : 400,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              Recipes
            </Button>

            {/* Mobile Navigation */}
            <IconButton
              onClick={() => handleNavigation('/dashboard')}
              sx={{
                color: isActive('/dashboard') ? 'primary.main' : 'text.primary',
                display: { xs: 'flex', md: 'none' },
              }}
            >
              <Dashboard />
            </IconButton>

            <IconButton
              onClick={() => handleNavigation('/recipes')}
              sx={{
                color: isActive('/recipes') ? 'primary.main' : 'text.primary',
                display: { xs: 'flex', md: 'none' },
              }}
            >
              <Restaurant />
            </IconButton>

            {/* Shopping Cart */}
            <IconButton
              sx={{
                color: totalItems > 0 ? 'primary.main' : 'text.primary',
                ml: 1,
              }}
            >
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Settings */}
            <IconButton
              onClick={() => handleNavigation('/preferences')}
              sx={{
                color: 'text.primary',
                ml: 1,
              }}
            >
              <Settings />
            </IconButton>
          </Box>
        )}

        {/* Show preferences button for new users */}
        {isNewUser() && location.pathname !== '/preferences' && (
          <Button
            variant="contained"
            onClick={() => handleNavigation('/preferences')}
            sx={{ ml: 2 }}
          >
            Set Preferences
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
