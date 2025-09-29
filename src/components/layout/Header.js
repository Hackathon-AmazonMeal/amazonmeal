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
  InputBase,
  Select,
  FormControl,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Restaurant,
  ShoppingCart,
  Dashboard,
  Settings,
  ExitToApp,
  AccountCircle,
  Search,
  LocationOn,
  Menu as MenuIcon,
  Close,
  Person,
  Fastfood,
  LocalDining,
  Schedule,
  FitnessCenter,
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
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
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
    <>
      {/* Main Header */}
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: '#131921',
          color: '#FFFFFF',
          boxShadow: 'none',
          border: 'none',
          borderRadius: 0,
          m: 0,
          width: '100%',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px', px: 0 }}>
          {/* Logo */}
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{ cursor: 'pointer', mr: 2 }}
            onClick={() => {
              if (location.pathname === '/' || location.pathname === '/fresh') {
                handleNavigation('/');
              } else {
                handleNavigation('/home');
              }
            }}
          >
            {(location.pathname === '/' || location.pathname === '/fresh') ? (
              <Box
                component="img"
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                alt="Amazon"
                sx={{ 
                  height: 24,
                  filter: 'brightness(0) invert(1)', // Makes the logo white
                }}
              />
            ) : (
              <>
                <Restaurant 
                  sx={{ 
                    color: '#FF9900', 
                    fontSize: 28, 
                    mr: 1 
                  }} 
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 400,
                    color: '#FFFFFF',
                    fontSize: '20px',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  amazonmeal
                </Typography>
              </>
            )}
          </Box>

          {/* Deliver to */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <LocationOn sx={{ color: '#FFFFFF', fontSize: 16, mr: 0.5 }} />
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#CCCCCC', lineHeight: 1 }}>
                Deliver to
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 700, lineHeight: 1 }}>
                New York 10001
              </Typography>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box sx={{ 
            flex: 1, 
            maxWidth: '600px', 
            display: 'flex', 
            mx: 2,
            bgcolor: '#FFFFFF',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <FormControl sx={{ minWidth: 50 }}>
              <Select
                value="All"
                displayEmpty
                sx={{
                  bgcolor: '#F3F3F3',
                  border: 'none',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSelect-select': {
                    fontSize: '12px',
                    py: 1,
                    px: 1,
                  }
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Recipes">Recipes</MenuItem>
                <MenuItem value="Ingredients">Ingredients</MenuItem>
              </Select>
            </FormControl>
            <InputBase
              placeholder="Search AmazonMeal"
              sx={{
                flex: 1,
                px: 1,
                fontSize: '14px',
                color: '#000000',
              }}
            />
            <IconButton 
              sx={{ 
                bgcolor: '#FEBD69', 
                borderRadius: 0, 
                px: 2,
                '&:hover': { bgcolor: '#F3A847' }
              }}
            >
              <Search sx={{ color: '#000000' }} />
            </IconButton>
          </Box>

          {/* Account & Lists */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <Box sx={{ textAlign: 'left', cursor: 'pointer' }} onClick={handleMenu}>
              <Typography sx={{ fontSize: '12px', color: '#CCCCCC', lineHeight: 1 }}>
                Hello, {currentUser.username || 'User'}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 700, lineHeight: 1 }}>
                Account & Lists
              </Typography>
            </Box>
          </Box>

          {/* Orders */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <Box sx={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => handleNavigation('/orders')}>
              <Typography sx={{ fontSize: '12px', color: '#CCCCCC', lineHeight: 1 }}>
                Returns
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 700, lineHeight: 1 }}>
                & Orders
              </Typography>
            </Box>
          </Box>

          {/* Cart */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleNavigation('/cart')}>
            <Badge 
              badgeContent={totalItems} 
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#FF9900',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '11px',
                  top: 8,
                  right: 8,
                }
              }}
            >
              <ShoppingCart sx={{ color: '#FFFFFF', fontSize: 32 }} />
            </Badge>
            <Typography sx={{ 
              fontSize: '14px', 
              color: '#FFFFFF', 
              fontWeight: 700, 
              ml: 0.5,
              display: { xs: 'none', sm: 'block' }
            }}>
              Cart
            </Typography>
          </Box>

          {/* Mobile Menu */}
          <IconButton
            sx={{
              color: '#FFFFFF',
              display: { xs: 'flex', md: 'none' },
              ml: 1,
            }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: '4px',
                border: '1px solid #D5D9D9',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                mt: 1,
              },
            }}
          >
            <MenuItem onClick={() => { handleNavigation('/preferences'); handleClose(); }}>
              <Settings sx={{ mr: 1, fontSize: 18 }} />
              Your Account & Preferences
            </MenuItem>
            <MenuItem onClick={() => { handleNavigation('/orders'); handleClose(); }}>
              <Dashboard sx={{ mr: 1, fontSize: 18 }} />
              Returns & Orders
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1, fontSize: 18 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Category Subheader */}
      <Box sx={{ 
        bgcolor: '#232F3E', 
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 0,
        m: 0,
        width: '100%',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          py: 1,
          px: 0,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}>
          <Button
            startIcon={<MenuIcon />}
            onClick={handleSidebarToggle}
            sx={{
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              mr: 1,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            All
          </Button>

          {[
            'Fresh',
            'Recipes', 
            'Meal Plans',
            'Quick & Easy',
            'Healthy',
            'Vegetarian',
            'Organic',
            'Dashboard'
          ].map((category) => (
            <Button
              key={category}
              onClick={() => {
                if (category === 'Dashboard') {
                  handleNavigation('/dashboard');
                } else if (category === 'Fresh') {
                  handleNavigation('/fresh');
                } else if (category === 'Recipes') {
                  handleNavigation('/recipes');
                } else if (category === 'Meal Plans') {
                  handleNavigation('/dashboard');
                } else {
                  handleNavigation(`/recipes?category=${category.toLowerCase().replace(' ', '-')}`);
                }
              }}
              sx={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: (category === 'Fresh' || category === 'Dashboard') ? 700 : 400,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                px: 1.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              {category}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={handleSidebarToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 365,
            bgcolor: '#FFFFFF',
          },
        }}
      >
        <Box sx={{ width: 365 }}>
          {/* Sidebar Header */}
          <Box sx={{ 
            bgcolor: '#232F3E', 
            color: '#FFFFFF', 
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1 }} />
              <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>
                Hello, {currentUser.username || 'User'}
              </Typography>
            </Box>
            <IconButton onClick={handleSidebarToggle} sx={{ color: '#FFFFFF' }}>
              <Close />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            {/* Main Categories */}
            <ListItem sx={{ bgcolor: '#F3F3F3', py: 1 }}>
              <ListItemText 
                primary="Digital Content & Devices" 
                primaryTypographyProps={{ fontSize: '16px', fontWeight: 700, color: '#0F1111' }}
              />
            </ListItem>
            
            <ListItem button onClick={() => { handleNavigation('/recipes'); handleSidebarToggle(); }}>
              <ListItemIcon><Restaurant /></ListItemIcon>
              <ListItemText primary="All Recipes" />
            </ListItem>
            
            <ListItem button onClick={() => { handleNavigation('/meal-planner'); handleSidebarToggle(); }}>
              <ListItemIcon><Schedule /></ListItemIcon>
              <ListItemText primary="Meal Planner" />
            </ListItem>

            <Divider />

            <ListItem sx={{ bgcolor: '#F3F3F3', py: 1 }}>
              <ListItemText 
                primary="Shop by Category" 
                primaryTypographyProps={{ fontSize: '16px', fontWeight: 700, color: '#0F1111' }}
              />
            </ListItem>

            <ListItem button onClick={() => { handleNavigation('/recipes?category=breakfast'); handleSidebarToggle(); }}>
              <ListItemIcon><Fastfood /></ListItemIcon>
              <ListItemText primary="Breakfast" />
            </ListItem>

            <ListItem button onClick={() => { handleNavigation('/recipes?category=lunch'); handleSidebarToggle(); }}>
              <ListItemIcon><LocalDining /></ListItemIcon>
              <ListItemText primary="Lunch" />
            </ListItem>

            <ListItem button onClick={() => { handleNavigation('/recipes?category=dinner'); handleSidebarToggle(); }}>
              <ListItemIcon><Restaurant /></ListItemIcon>
              <ListItemText primary="Dinner" />
            </ListItem>

            <ListItem button onClick={() => { handleNavigation('/recipes?category=healthy'); handleSidebarToggle(); }}>
              <ListItemIcon><FitnessCenter /></ListItemIcon>
              <ListItemText primary="Healthy Options" />
            </ListItem>

            <ListItem button onClick={() => { handleNavigation('/recipes?category=vegetarian'); handleSidebarToggle(); }}>
              <ListItemIcon><Restaurant /></ListItemIcon>
              <ListItemText primary="Vegetarian" />
            </ListItem>

            <Divider />

            <ListItem sx={{ bgcolor: '#F3F3F3', py: 1 }}>
              <ListItemText 
                primary="Programs & Features" 
                primaryTypographyProps={{ fontSize: '16px', fontWeight: 700, color: '#0F1111' }}
              />
            </ListItem>

            <ListItem button onClick={() => { handleNavigation('/preferences'); handleSidebarToggle(); }}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Your Account" />
            </ListItem>

            <ListItem button onClick={() => { handleNavigation('/orders'); handleSidebarToggle(); }}>
              <ListItemIcon><Dashboard /></ListItemIcon>
              <ListItemText primary="Your Orders" />
            </ListItem>

            <Divider />

            <ListItem button onClick={() => { handleLogout(); handleSidebarToggle(); }}>
              <ListItemIcon><ExitToApp /></ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Header;
