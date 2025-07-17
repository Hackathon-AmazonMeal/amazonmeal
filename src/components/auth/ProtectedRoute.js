import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Box, Typography } from '@mui/material';
import chefGif from '../../assets/chef.gif';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        gap={2}
      >
        <img 
          src={chefGif} 
          alt="Chef cooking" 
          style={{ 
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            objectFit: 'cover'
          }} 
        />
        <Typography variant="h6" color="text.secondary">
          Please wait while we process your request...
        </Typography>
      </Box>
    );
  }

  if (!currentUser) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
