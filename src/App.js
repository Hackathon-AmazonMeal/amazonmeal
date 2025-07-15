import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { RecipeProvider } from './contexts/RecipeContext';
import { CartProvider } from './contexts/CartContext';

// Pages
import Welcome from './pages/Welcome/Welcome';
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

// Custom hook for user state
import { useUserPreferences } from './hooks/useUserPreferences';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { currentUser, loading } = useAuth();
  const { user, isLoading } = useUserPreferences();

  if (loading || isLoading) {
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
        
        {/* Protected routes */}
        <Route 
          path="/welcome" 
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          } 
        />
        
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
            currentUser ? (
              user && user.preferences ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/welcome" replace />
            ) : (
              <Navigate to="/login" replace />
            )
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
      <AuthProvider>
        <UserProvider>
          <RecipeProvider>
            <CartProvider>
              <Router>
                <AppContent />
              </Router>
            </CartProvider>
          </RecipeProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
