import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Context Providers
import { UserProvider, useUser } from './contexts/UserContext';
import { RecipeProvider } from './contexts/RecipeContext';
import { CartProvider } from './contexts/CartContext';

// Pages
import LoginPage from './pages/Login/LoginPage';
import PreferencesPage from './pages/Preferences/PreferencesPage';
import RecipesPage from './pages/Recipes/RecipesPage';
import Dashboard from './pages/Dashboard/Dashboard';
import CheckoutSuccess from './pages/Checkout/CheckoutSuccess';
import Cart from './pages/Cart';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Theme
import theme from './styles/theme';

function AppContent() {
  const { currentUser, isLoading } = useUser();

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
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/preferences" 
          element={
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recipes" 
          element={
            <ProtectedRoute>
              <RecipesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        
        {/* Dashboard for returning users */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route 
          path="/checkout/success" 
          element={
            <ProtectedRoute>
              <CheckoutSuccess />
            </ProtectedRoute>
          } 
        />
        {/* Shopping cart page */}
        <Route path="/cart" element={<Cart />} />
        {/* Default route logic */}
        <Route 
          path="/" 
          element={
            currentUser && currentUser.preferences ? 
                <Navigate to="/dashboard" replace /> : 
              <Navigate to="/login" replace />
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
