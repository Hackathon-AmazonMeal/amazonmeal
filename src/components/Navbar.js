import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart } from '@mui/icons-material';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AmazonMeal
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {currentUser && !currentUser.preferences && (
            <Button color="inherit" component={Link} to="/preferences">Setup</Button>
          )}
          {currentUser && currentUser.preferences && (
            <>
              <Button color="inherit" component={Link} to="/recipes">Recipes</Button>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" component={Link} to="/cart">
                <Badge badgeContent={itemCount} color="secondary">
                  <ShoppingCart />
                </Badge>
              </Button>
            </>
          )}
          {currentUser && (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;