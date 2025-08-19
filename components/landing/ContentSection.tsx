'use client';

import React from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const ContentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  padding: '80px 24px',
  borderTop: '4px solid #000000',
  borderBottom: '4px solid #000000',
  overflow: 'hidden',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  border: '4px solid #000000',
  boxShadow: '8px 8px 0px #000000',
  position: 'relative',
  height: '600px',
  width: '100%',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(100%) contrast(1.2)',
  }
}));

const TextBlock = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '4px solid #000000',
  padding: '32px',
  boxShadow: '8px 8px 0px #000000',
  marginBottom: '24px',
}));

const FinallyText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
  fontWeight: 900,
  lineHeight: 1,
  color: theme.palette.primary.main,
  textTransform: 'uppercase',
  textShadow: '4px 4px 0px #000000',
  marginBottom: '16px',
}));

const ActuallyWorksText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.8rem, 6vw, 3.5rem)',
  fontWeight: 900,
  lineHeight: 1,
  color: '#000000',
  textTransform: 'uppercase',
  backgroundColor: '#FFFFFF',
  padding: '12px 16px',
  border: '4px solid #000000',
  display: 'inline-block',
  boxShadow: '4px 4px 0px #000000',
}));

export default function ContentSection() {
  return (
    <ContentContainer id="content-section">
      <Container maxWidth="xl">
        <Stack 
          direction={{ xs: 'column', lg: 'row' }} 
          spacing={{ xs: 6, lg: 8 }} 
          alignItems="flex-start"
          sx={{ minHeight: '600px' }}
        >

          <Box sx={{ flex: 1, maxWidth: '600px' }}>
            <Stack spacing={4}>
              <TextBlock>
                <FinallyText component="h2">
                  Finally.
                </FinallyText>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 'bold', 
                    textTransform: 'uppercase',
                    color: '#000000'
                  }}
                >
                  File Sharing That
                </Typography>
                <ActuallyWorksText component="span">
                  Actually Works.
                </ActuallyWorksText>
              </TextBlock>
              
              <TextBlock>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    color: '#000000'
                  }}
                >
                  Tired of broken links and attachment nightmares? DataDrop offers enterprise power with startup simplicity. Your time is too valuable for file frustration.
                </Typography>
              </TextBlock>
            </Stack>
          </Box>
          

          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            pt: 4 
          }}>
            <ImageContainer>
              <img 
                src="https://images.unsplash.com/photo-1587825140708-df8769a5e876?q=80&w=2070&auto=format&fit=crop"
                alt="A structured yet bold representation of file organization"
              />
            </ImageContainer>
          </Box>
        </Stack>
      </Container>
    </ContentContainer>
  );
}