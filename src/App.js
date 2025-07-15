import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Context Providers
import { UserProvider } from './contexts/UserContext';
import { RecipeProvider } from './contexts/RecipeContext';
import { CartProvider } from './contexts/CartContext';

// Pages
import Welcome from './pages/Welcome/Welcome';
import PreferencesPage from './pages/Preferences/PreferencesPage';
import RecipesPage from './pages/Recipes/RecipesPage';
import Dashboard from './pages/Dashboard/Dashboard';
import CheckoutSuccess from './pages/Checkout/CheckoutSuccess';

// Components
import Layout from './components/layout/Layout';

// Theme
import theme from './styles/theme';

// Custom hook for user state
import { useUserPreferences } from './hooks/useUserPreferences';

function AppContent() {
  const { user, isLoading } = useUserPreferences();

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Welcome route for new users */}
        <Route path="/welcome" element={<Welcome />} />
        
        {/* Preferences setup route */}
        <Route path="/preferences" element={<PreferencesPage />} />
        
        {/* Main recipes page */}
        <Route path="/recipes" element={<RecipesPage />} />
        
        {/* Dashboard for returning users */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Checkout success page */}
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        
        {/* Default route logic */}
        <Route 
          path="/" 
          element={
            user && user.preferences ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/welcome" replace />
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <RecipeProvider>
          <CartProvider>
            <Router>
              <AppContent />
            </Router>
          </CartProvider>
        </RecipeProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
