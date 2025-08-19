// Mock data for neobrutalism design migration

// Navigation items
export const navItems = [
  { label: 'Features', action: 'features' },
  { label: 'Pricing', action: 'pricing' }
] as const;

// Hero section content
export const heroContent = {
  logo: {
    primary: 'DATA',
    secondary: 'DROP'
  },
  headline: 'Your Files,',
  subheadline: 'Perfectly Organized',
  description: 'The most intuitive cloud storage solution for individuals and teams who demand better file management',
  buttons: {
    primary: 'Start Free Trial',
    secondary: 'Watch Demo'
  },
  disclaimer: 'No credit card required • 14-day free trial • Cancel anytime'
} as const;

// Floating elements for hero section
export const floatingElements = [
  { text: 'SECURE', position: { top: '20%', left: '10%' }, delay: '0s' },
  { text: 'FAST', position: { top: '60%', right: '15%' }, delay: '2s' },
  { text: 'SIMPLE', position: { bottom: '30%', left: '75%' }, delay: '4s' }
] as const;

// Color palette for neobrutalism theme
export const neoColors = {
  black: '#000000',
  white: '#FFFFFF',
  primary: '#FF7A3D',
  primaryDark: '#E5672A',
  gray: '#333333',
  lightGray: '#F5F5F5',
  success: '#00FF00',
  error: '#FF0000',
  warning: '#FFFF00',
  info: '#00FFFF'
} as const;

// Typography settings
export const neoTypography = {
  fontFamily: 'var(--font-poppins), "Arial Black", Arial, sans-serif',
  weights: {
    light: 400,
    regular: 700,
    medium: 800,
    bold: 900
  }
} as const;

// Shadow variations
export const neoShadows = {
  small: '4px 4px 0px #000000',
  medium: '8px 8px 0px #000000',
  large: '12px 12px 0px #000000',
  xlarge: '16px 16px 0px #000000'
} as const;