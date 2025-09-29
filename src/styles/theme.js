import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9900', // Amazon Orange
      light: '#FFB84D',
      dark: '#E47911',
      contrastText: '#000000',
    },
    secondary: {
      main: '#232F3E', // Amazon Dark Blue
      light: '#37475A',
      dark: '#131A22',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#067D62', // Amazon Green
      light: '#4CAF50',
      dark: '#045D4A',
    },
    warning: {
      main: '#F79400',
      light: '#FFB84D',
      dark: '#CC7700',
    },
    error: {
      main: '#B12704',
      light: '#D32F2F',
      dark: '#8B1E02',
    },
    background: {
      default: '#EAEDED', // Amazon Light Gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F1111', // Amazon Black
      secondary: '#565959', // Amazon Gray
    },
    grey: {
      50: '#FAFAFA',
      100: '#F7F8F8',
      200: '#EAEDED',
      300: '#D5D9D9',
      400: '#879196',
      500: '#565959',
      600: '#232F3E',
      700: '#131A22',
      800: '#0F1111',
      900: '#000000',
    },
  },
  typography: {
    fontFamily: '"Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif',
    h1: {
      fontSize: '28px',
      fontWeight: 400,
      lineHeight: 1.3,
      color: '#0F1111',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 400,
      lineHeight: 1.3,
      color: '#0F1111',
    },
    h3: {
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: 1.3,
      color: '#0F1111',
    },
    h4: {
      fontSize: '18px',
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#0F1111',
    },
    h5: {
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#0F1111',
    },
    h6: {
      fontSize: '14px',
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#0F1111',
    },
    body1: {
      fontSize: '14px',
      lineHeight: 1.4,
      color: '#0F1111',
    },
    body2: {
      fontSize: '12px',
      lineHeight: 1.4,
      color: '#565959',
    },
    button: {
      textTransform: 'none',
      fontWeight: 400,
      fontSize: '13px',
    },
  },
  shape: {
    borderRadius: 4, // Amazon uses smaller border radius
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: 400,
          textTransform: 'none',
          boxShadow: 'none',
          border: '1px solid transparent',
          minHeight: '29px',
          '&:hover': {
            boxShadow: '0 2px 5px 0 rgba(213,217,217,.5)',
          },
        },
        contained: {
          background: 'linear-gradient(to bottom,#f7dfa5,#f0c14b)',
          borderColor: '#a88734 #9c7e31 #846a29',
          color: '#0F1111',
          '&:hover': {
            background: 'linear-gradient(to bottom,#f5d78e,#eeb933)',
            borderColor: '#a88734 #9c7e31 #846a29',
          },
          '&:active': {
            background: 'linear-gradient(to bottom,#f0c14b,#f7dfa5)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,.2)',
          },
        },
        outlined: {
          borderColor: '#D5D9D9',
          color: '#0F1111',
          '&:hover': {
            borderColor: '#879196',
            backgroundColor: '#F7F8F8',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #D5D9D9',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #D5D9D9',
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 5px 0 rgba(213,217,217,.5)',
        },
        elevation2: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#888C8C',
            },
            '&:hover fieldset': {
              borderColor: '#E77600',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E77600',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#F0F2F2',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#888C8C',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E77600',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E77600',
            borderWidth: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 400,
          fontSize: '12px',
          backgroundColor: '#F0F2F2',
          color: '#0F1111',
          border: '1px solid #D5D9D9',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#232F3E',
          boxShadow: 'none',
          borderBottom: '1px solid #3a4553',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E6E6E6',
          '&:last-child': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: '13px',
        },
        standardInfo: {
          backgroundColor: '#D1ECF1',
          color: '#0C5460',
          border: '1px solid #B8DAFF',
        },
        standardSuccess: {
          backgroundColor: '#D4EDDA',
          color: '#155724',
          border: '1px solid #C3E6CB',
        },
        standardWarning: {
          backgroundColor: '#FFF3CD',
          color: '#856404',
          border: '1px solid #FFEAA7',
        },
        standardError: {
          backgroundColor: '#F8D7DA',
          color: '#721C24',
          border: '1px solid #F5C6CB',
        },
      },
    },
  },
});

export default theme;
