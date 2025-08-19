import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7A3D',
      light: '#FF7A3D',
      dark: '#E5672A',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#333333',
      light: '#666666',
      dark: '#000000',
      contrastText: '#FFFFFF'
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999'
    },
    background: {
      default: '#FFFFFF',
      paper: '#FAFAFA'
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
      900: '#171717'
    },
    success: {
      main: '#10B981'
    },
    error: {
      main: '#EF4444'
    },
    info: {
      main: '#3B82F6'
    },
    divider: '#E5E5E5'
  },
  typography: {
    fontFamily: 'var(--font-poppins), Poppins, sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(255, 122, 61, 0.1)',
    '0px 4px 8px rgba(255, 122, 61, 0.15)',
    '0px 8px 16px rgba(255, 122, 61, 0.2)',
    '0px 12px 24px rgba(255, 122, 61, 0.25)',
    '0px 16px 32px rgba(255, 122, 61, 0.3)',
    '0px 20px 40px rgba(255, 122, 61, 0.35)',
    '0px 24px 48px rgba(255, 122, 61, 0.4)',
    '0px 32px 64px rgba(0, 0, 0, 0.12)',
    '0px 40px 80px rgba(0, 0, 0, 0.16)',
    '0px 48px 96px rgba(0, 0, 0, 0.2)',
    '0px 56px 112px rgba(0, 0, 0, 0.24)',
    '0px 64px 128px rgba(0, 0, 0, 0.28)',
    '0px 72px 144px rgba(0, 0, 0, 0.32)',
    '0px 80px 160px rgba(0, 0, 0, 0.36)',
    '0px 88px 176px rgba(0, 0, 0, 0.4)',
    '0px 96px 192px rgba(0, 0, 0, 0.44)',
    '0px 104px 208px rgba(0, 0, 0, 0.48)',
    '0px 112px 224px rgba(0, 0, 0, 0.52)',
    '0px 120px 240px rgba(0, 0, 0, 0.56)',
    '0px 128px 256px rgba(0, 0, 0, 0.6)',
    '0px 136px 272px rgba(0, 0, 0, 0.64)',
    '0px 144px 288px rgba(0, 0, 0, 0.68)',
    '0px 152px 304px rgba(0, 0, 0, 0.72)',
    '0px 160px 320px rgba(0, 0, 0, 0.76)'
  ]
});

export default theme;