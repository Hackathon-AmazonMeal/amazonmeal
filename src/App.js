// App.js - Main application component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RecipeBrowser from './pages/RecipeBrowser';
import RecipeDetail from './pages/RecipeDetail';
import MealPlanCreator from './pages/MealPlanCreator';
import ShoppingList from './pages/ShoppingList';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

// Material UI theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9900', // Amazon orange
    },
    secondary: {
      main: '#232F3E', // Amazon dark blue
    },
    background: {
      default: '#F7F7F7',
    },
  },
  typography: {
    fontFamily: '"Amazon Ember", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
});

// Private route component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  return (
    <Router>
      <div className="app-container">
        <AppHeader />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/recipes" element={
              <PrivateRoute>
                <RecipeBrowser />
              </PrivateRoute>
            } />
            <Route path="/recipe/:recipeId" element={
              <PrivateRoute>
                <RecipeDetail />
              </PrivateRoute>
            } />
            <Route path="/meal-plans" element={
              <PrivateRoute>
                <MealPlanCreator />
              </PrivateRoute>
            } />
            <Route path="/shopping-list" element={
              <PrivateRoute>
                <ShoppingList />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
