'use client';

import React from 'react';
import { Box, Typography, Stack, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NeoButton } from '@/components/ui/neo-button';
import { NeoCard } from '@/components/ui/neo-card';
import { Play } from 'lucide-react';

const NeoHeroContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#FFFFFF',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  paddingTop: '120px',
  paddingBottom: '80px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(#000000 2px, transparent 2px),
      linear-gradient(90deg, #000000 2px, transparent 2px)
    `,
    backgroundSize: '50px 50px',
    opacity: 0.1,
    zIndex: 1
  }
}));

const NeoFloatingCard = styled(NeoCard)(({ theme }) => ({
  position: 'absolute',
  padding: '20px',
  backgroundColor: '#FF7A3D',
  color: '#FFFFFF',
  border: '4px solid #000000',
  boxShadow: '12px 12px 0px #000000',
  animation: 'neoFloat 6s ease-in-out infinite',
  '@keyframes neoFloat': {
    '0%, 100%': { 
      transform: 'translateY(0px) rotate(0deg)' 
    },
    '50%': { 
      transform: 'translateY(-20px) rotate(5deg)' 
    }
  },
  '&:nth-of-type(1)': {
    top: '20%',
    left: '10%',
    animationDelay: '0s',
    width: '120px',
    height: '80px'
  },
  '&:nth-of-type(2)': {
    top: '60%',
    right: '15%',
    animationDelay: '2s',
    width: '100px',
    height: '100px'
  },
  '&:nth-of-type(3)': {
    bottom: '30%',
    left: '75%',
    animationDelay: '4s',
    width: '80px',
    height: '120px'
  }
}));

const NeoMainCard = styled(NeoCard)(({ theme }) => ({
  padding: '60px 40px',
  backgroundColor: '#FFFFFF',
  border: '6px solid #000000',
  boxShadow: '16px 16px 0px #000000',
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down('md')]: {
    padding: '40px 20px'
  }
}));

const NeoLogoText = styled(Typography)(({ theme }) => ({
  fontSize: '4rem',
  fontWeight: 900,
  marginBottom: '2rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  textAlign: 'center',
  '& .orange': {
    color: '#FF7A3D'
  },
  '& .black': {
    color: '#000000'
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '3rem'
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem'
  }
}));

const NeoHeadline = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 900,
  lineHeight: 1.1,
  marginBottom: '1rem',
  color: '#000000',
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem'
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem'
  }
}));

const NeoSubheadline = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 900,
  lineHeight: 1.1,
  marginBottom: '2rem',
  color: '#FF7A3D',
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  textAlign: 'center',
  textShadow: '4px 4px 0px #000000',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem'
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem'
  }
}));

const NeoDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#333333',
  textAlign: 'center',
  marginBottom: '3rem',
  maxWidth: '600px',
  margin: '0 auto 3rem auto',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem'
  }
}));

const NeoButtonGroup = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: '24px',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '2rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '16px'
  }
}));

const NeoDisclaimer = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 700,
  color: '#666666',
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '0.1em'
}));

export default function NeoHeroSection() {
  return (
    <NeoHeroContainer>
      {/* Floating Elements */}
      <NeoFloatingCard>
        <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
          SECURE
        </Typography>
      </NeoFloatingCard>
      <NeoFloatingCard>
        <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
          FAST
        </Typography>
      </NeoFloatingCard>
      <NeoFloatingCard>
        <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
          SIMPLE
        </Typography>
      </NeoFloatingCard>
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <NeoMainCard>
          <NeoLogoText>
            <span className="orange">DATA</span><span className="black">DROP</span>
          </NeoLogoText>
          
          <NeoHeadline>
            Your Files,
          </NeoHeadline>
          
          <NeoSubheadline>
            Perfectly Organized
          </NeoSubheadline>
          
          <NeoDescription>
            The most intuitive cloud storage solution for individuals and teams who demand better file management
          </NeoDescription>
          
          <NeoButtonGroup>
            <NeoButton size="lg">
              Start Free Trial
            </NeoButton>
            <NeoButton variant="outline" size="lg">
              <Play className="mr-2" size={20} />
              Watch Demo
            </NeoButton>
          </NeoButtonGroup>
          
          <NeoDisclaimer>
            No credit card required • 14-day free trial • Cancel anytime
          </NeoDisclaimer>
        </NeoMainCard>
      </Container>
    </NeoHeroContainer>
  );
}