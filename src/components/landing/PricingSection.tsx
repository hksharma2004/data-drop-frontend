'use client';

import React from 'react';
import { Box, Typography, Stack, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingContainer = styled(Box)(({ theme }) => ({
  padding: '120px 0',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `
      radial-gradient(circle at 20% 20%, ${theme.palette.primary.main}10 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, ${theme.palette.primary.main}10 0%, transparent 50%)
    `,
    opacity: 0.5
  }
}));

const PricingCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
  border: `4px solid ${theme.palette.secondary.main}`,
  borderRadius: '24px',
  padding: '40px',
  height: '100%',
  position: 'relative',
  boxShadow: `8px 8px 0px ${theme.palette.grey[200]}`,
  transition: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  opacity: 0,
  animation: 'fadeInUp 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
  maxWidth: '500px',
  margin: '0 auto',
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
  '& .check-icon': {
    color: theme.palette.primary.main,
    marginRight: '12px',
    fontSize: '1.5rem'
  }
}));

const PricingButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: `4px solid ${theme.palette.secondary.main}`,
  borderRadius: '16px',
  padding: '18px 36px',
  fontSize: '1rem',
  fontWeight: 700,
  textTransform: 'none',
  width: '100%',
  boxShadow: `6px 6px 0px ${theme.palette.secondary.main}`,
  transition: 'all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translate(-3px, -3px) scale(1.05)',
    boxShadow: `10px 10px 0px ${theme.palette.secondary.main}, 0 0 25px rgba(255, 122, 61, 0.2)`,
  }
}));

const PricingHeader = styled(Stack)(({ theme }) => ({
  opacity: 0,
  transform: 'translateY(30px)',
  animation: 'fadeInUp 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
}));


export default function PricingSection() {
  const freePlanFeatures = [
    "2GB premium storage",
    "Unlimited Share Cards",
    "Full AI features included",
    "Professional support"
  ];

  return (
    <PricingContainer id="pricing">
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <PricingHeader alignItems="center" sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Start Free. Scale Smart.
          </Typography>
        </PricingHeader>

        <PricingCard>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Free Forever Plan
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Everything You Need to Get Started
            </Typography>
            
            <Stack spacing={1} sx={{ mb: 4, textAlign: 'left' }}>
              {freePlanFeatures.map((feature, featureIndex) => (
                <FeatureItem key={featureIndex}>
                  <Check className="check-icon" />
                  <Typography variant="body1">
                    {feature}
                  </Typography>
                </FeatureItem>
              ))}
            </Stack>
            
            <PricingButton>
              Start My Transformation
            </PricingButton>
          </CardContent>
        </PricingCard>

        <Typography variant="h6" color="text.primary" sx={{ mt: 8 }}>
            Ready for more? <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Let's design your perfect plan.</Box>
        </Typography>
      </Container>
    </PricingContainer>
  );
}