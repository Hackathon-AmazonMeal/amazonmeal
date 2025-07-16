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
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Restaurant,
  ShoppingCart,
  Dashboard,
  Settings,
  ExitToApp,
  AccountCircle,
} from '@mui/icons-material';

// Hooks
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isNewUser } = useUserPreferences();
  const { totalItems } = useCart();
  const { currentUser, signOut } = useUser();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
    handleClose();
  };

  // Don't show header on welcome and login pages
  if (location.pathname === '/login') {
    return null;
  }

  // If user is not logged in, don't show header
  if (!currentUser) {
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
              onClick={() => handleNavigation('/cart')}
            >
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* User Menu */}
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                color: 'text.primary',
                ml: 1,
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : <AccountCircle />}
              </Avatar>
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleNavigation('/preferences'); handleClose(); }}>
                <Settings sx={{ mr: 1 }} />
                Preferences
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
