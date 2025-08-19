'use client';

import React from 'react';
import { Box, Typography, Stack, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Zap, ShieldCheck, Share2, Component } from 'lucide-react';

const FeaturesContainer = styled(Box)(({ theme }) => ({
  padding: '80px 24px',
  backgroundColor: '#FFFFFF',
}));

const FeatureCard = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'textColor'
})<{ bgColor?: string, textColor?: string }>(({ theme, bgColor, textColor }) => ({
  border: '4px solid #000000',
  padding: '32px',
  height: '100%',
  transition: 'all 200ms ease',
  backgroundColor: bgColor || '#FFFFFF',
  color: textColor || '#000000',
  '&:hover': {
    transform: 'translate(5px, 5px)',
    boxShadow: 'none',
  }
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: '60px',
  height: '60px',
  border: '4px solid #000000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
  backgroundColor: theme.palette.primary.main,
  '& svg': {
    width: '32px',
    height: '32px',
    color: '#000000',
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(3rem, 10vw, 5rem)',
  fontWeight: 900,
  textAlign: 'center',
  textTransform: 'uppercase',
  marginBottom: '64px',
  textShadow: '6px 6px 0px rgba(0,0,0,0)',
}));

export default function FeaturesSection() {
  const features = [
    {
      icon: <Zap />,
      title: "Smart Storage",
      description: "2GB of blazing-fast, secure storage. Organize files into intelligent cards. No limits on creativity..",
      bgColor: '#FFFFFF',
      textColor: '#000000',
    },
    {
      icon: <ShieldCheck />,
      title: "QR Code Sharing",
      description: "Share file cards instantly with QR codes. One scan, instant access. No complex links or broken attachments.",
      bgColor: '#FFFFFF',
      textColor: '#000000',
    },
    {
      icon: <Share2 />,
      title: "Smart Organization",
      description: "AI analyzes your files and suggests perfect folder structures. Stop thinking, start organizing.",
      bgColor: '#FFFFFF',
      textColor: '#000000',
    },
    {
      icon: <Component />,
      title: "PDF Conversations",
      description: "Ask questions, get answers from your PDFs. AI-powered document intelligence at your fingertips.",
      bgColor: '#FFFFFF',
      textColor: '#000000',
    },
    {
      icon: <Component />,
      title: "Smart Tagging",
      description: "AI automatically tags your cards with relevant keywords. Find anything in seconds, not minutes.",
      bgColor: '#FFFFFF',
      textColor: '#000000',
    },
    {
      icon: <Component />,
      title: "Collaborative Power",
      description: "Share cards with teammates, collaborate in real-time. Your files, your team, your way.",
      bgColor: '#FFFFFF',
      textColor: '#000000',
    }

  ];

  return (
    <FeaturesContainer id="features">
      <Container maxWidth="lg">
        <SectionTitle>FEATURES</SectionTitle>
        <Stack spacing={8}>
            {[0, 2].map(rowIndex => (
                <Stack key={rowIndex} direction={{ xs: 'column', md: 'row' }} spacing={8}>
                    {features.slice(rowIndex, rowIndex + 2).map((feature, index) => (
                         <Box key={index} sx={{ flex: 1 }}>
                            <Box sx={{
                                boxShadow: '10px 10px 0px #000000',
                                transition: 'all 200ms ease',
                                height: '100%',
                                '&:hover': {
                                    boxShadow: '5px 5px 0px #000000',
                                }
                            }}>
                                <FeatureCard 
                                    bgColor={feature.bgColor} 
                                    textColor={feature.textColor}
                                >
                                <FeatureIcon>
                                    {feature.icon}
                                </FeatureIcon>
                                <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase' }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                                    {feature.description}
                                </Typography>
                                </FeatureCard>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            ))}
        </Stack>
      </Container>
    </FeaturesContainer>
  );
}