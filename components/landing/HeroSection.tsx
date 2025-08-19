'use client';

import React from 'react';
import { Box, Typography, Stack, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NeoButton } from '@/components/ui/neo-button';
import Image from 'next/image';
import Link from 'next/link';

const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: '90vh',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    zIndex: 0,
  }
}));

const Headline = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
  fontWeight: 900,
  lineHeight: 1.1,
  color: '#000000',
  textTransform: 'uppercase',
  letterSpacing: '-0.03em',
  textShadow: `6px 6px 0px ${theme.palette.grey[50]}`,
  textAlign: 'center',
}));

const ReimaginedBlock = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  backgroundColor: theme.palette.primary.main,
  color: '#000000',
  padding: '4px 12px',
  border: '4px solid #000000',
  boxShadow: '1px 1px 0px #000000',
  transform: 'rotate(-2deg)',
}));

export default function HeroSection() {
  const scrollToContent = () => {
    const contentSection = document.getElementById('content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroContainer>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={12} alignItems="center" justifyContent="space-between">
          <Box>
            <Image src="/assets/images/logo-datadrop.png" width={600} height={600} className='' alt="logo" />
          </Box>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Stack spacing={4} alignItems={{ xs: 'center', md: 'flex-start' }}>
              <Headline component="h1" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              Smart File Management.
                <br />
                <ReimaginedBlock>
                  <Typography 
                    variant="h1" 
                    component="span"
                    sx={{ 
                      fontSize: 'clamp(2.5rem, 8vw, 5rem)', 
                      fontWeight: 900,
                      lineHeight: 1.1,
                      letterSpacing: '-0.03em',
                      textTransform: 'uppercase',
                    }}
                  >
                    REIMAGINED.
                  </Typography>
                </ReimaginedBlock>
              </Headline>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  textAlign: { xs: 'center', md: 'left' },
                  maxWidth: '600px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Upload, share, and manage files with production-grade security and blazing speed. QR-powered sharing with AI integration.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Link href="/sign-up" style={{ textDecoration: 'none' }}>
                  <NeoButton size="lg">
                    Get Started
                  </NeoButton>
                </Link>
                <NeoButton size="lg" variant="outline" onClick={scrollToContent}>
                  Learn More
                </NeoButton>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </HeroContainer>
  );
}
