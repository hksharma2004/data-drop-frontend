'use client';

import React from 'react';
import { Box, Typography, Stack, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NeoButton } from '@/components/ui/neo-button';
import Link from 'next/link';

const CTAContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: '80px 24px',
  borderTop: '4px solid #000000',
  borderBottom: '4px solid #000000',
  color: '#000000',
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
    fontWeight: 900,
    textTransform: 'uppercase',
    lineHeight: 1.1,
}));

export default function CTASection() {
  return (
    <CTAContainer>
      <Container maxWidth="lg">
        <Stack spacing={6} alignItems="center">
            <Title sx={{ textAlign: 'center' }}>
                Stop Waiting.
                <br />
                Start Creating.
            </Title>
            <Link href="/sign-up" style={{ textDecoration: 'none' }}>
              <NeoButton 
                  size="lg"
                  variant="outline"
                  sx={{ 
                      backgroundColor: '#FFFFFF', 
                      color: '#000000', 
                      height: '80px',
                      fontSize: '1.5rem',
                      minWidth: '320px',
                  }}
              >
                  Get Started Now
              </NeoButton>
            </Link>
        </Stack>
      </Container>
    </CTAContainer>
  );
}