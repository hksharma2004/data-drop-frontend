import { createTheme } from '@mui/material/styles';

const neobrutalistTheme = createTheme({
  palette: {
    primary: {
      main: '#FF7A3D',
      light: '#FF9A5D',
      dark: '#E5672A',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF'
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
      disabled: '#666666'
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF'
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#000000'
    },
    success: {
      main: '#00FF00',
      contrastText: '#000000'
    },
    error: {
      main: '#FF0000',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FFFF00',
      contrastText: '#000000'
    },
    info: {
      main: '#00FFFF',
      contrastText: '#000000'
    },
    divider: '#000000'
  },
  typography: {
    fontFamily: 'var(--font-poppins), "Arial Black", Arial, sans-serif',
    fontSize: 16,
    fontWeightLight: 400,
    fontWeightRegular: 700,
    fontWeightMedium: 800,
    fontWeightBold: 900,
    h1: {
      fontSize: '4rem',
      fontWeight: 900,
      lineHeight: 1.1,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 800,
      lineHeight: 1.3
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 800,
      lineHeight: 1.3
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.4
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.4
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 700,
      lineHeight: 1.5
    },
    button: {
      fontSize: '1rem',
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  },
  shape: {
    borderRadius: 0
  },
  shadows: [
    'none',
    '4px 4px 0px #000000',
    '6px 6px 0px #000000',
    '8px 8px 0px #000000',
    '10px 10px 0px #000000',
    '12px 12px 0px #000000',
    '14px 14px 0px #000000',
    '16px 16px 0px #000000',
    '18px 18px 0px #000000',
    '20px 20px 0px #000000',
    '22px 22px 0px #000000',
    '24px 24px 0px #000000',
    '26px 26px 0px #000000',
    '28px 28px 0px #000000',
    '30px 30px 0px #000000',
    '32px 32px 0px #000000',
    '34px 34px 0px #000000',
    '36px 36px 0px #000000',
    '38px 38px 0px #000000',
    '40px 40px 0px #000000',
    '42px 42px 0px #000000',
    '44px 44px 0px #000000',
    '46px 46px 0px #000000',
    '48px 48px 0px #000000',
    '50px 50px 0px #000000'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: '4px solid #000000',
          borderRadius: '0px',
          textTransform: 'uppercase',
          fontWeight: 900,
          fontSize: '1rem',
          padding: '12px 24px',
          boxShadow: '6px 6px 0px #000000',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '8px 8px 0px #000000'
          },
          '&:active': {
            transform: 'translate(2px, 2px)',
            boxShadow: '2px 2px 0px #000000'
          }
        },
        containedPrimary: {
          backgroundColor: '#FF7A3D',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#E5672A'
          }
        },
        outlined: {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          borderColor: '#000000',
          '&:hover': {
            backgroundColor: '#F5F5F5',
            borderColor: '#000000'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '4px solid #000000',
          borderRadius: '0px',
          boxShadow: '8px 8px 0px #000000',
          backgroundColor: '#FFFFFF'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            border: '4px solid #000000',
            borderRadius: '0px',
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              border: 'none'
            },
            '&:hover fieldset': {
              border: 'none'
            },
            '&.Mui-focused fieldset': {
              border: 'none'
            }
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          border: '4px solid #000000',
          borderRadius: '0px',
          boxShadow: '0px 8px 0px #000000',
          backgroundColor: '#FFFFFF',
          color: '#000000'
        }
      }
    }
  }
});

export default neobrutalistTheme;