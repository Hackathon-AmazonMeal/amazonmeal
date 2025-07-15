import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Custom hook to handle authentication redirects
export const useAuthRedirect = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // If user is not authenticated, redirect to login
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  return { currentUser, loading };
};

// Hook to protect API calls - redirects to login if user is not authenticated
export const useProtectedAPI = () => {
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();

  const makeProtectedRequest = async (url, options = {}) => {
    if (!currentUser || !token) {
      navigate('/login');
      throw new Error('User not authenticated');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // If unauthorized, redirect to login
      if (response.status === 401) {
        navigate('/login');
        throw new Error('Session expired');
      }

      return response;
    } catch (error) {
      if (error.message === 'Session expired' || error.message === 'User not authenticated') {
        navigate('/login');
      }
      throw error;
    }
  };

  return { makeProtectedRequest, isAuthenticated: !!currentUser };
};