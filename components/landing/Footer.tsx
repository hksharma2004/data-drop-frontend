'use client';

import React from 'react';
import { Box, Typography, Stack, Container, Grid, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NeoButton } from '@/components/ui/neo-button';
import { Linkedin, Github } from 'lucide-react';
import NextLink from 'next/link';

const electricOrange = '#FF7A3D';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#000000',
  color: '#FFFFFF',
  padding: '120px 24px 60px',
  borderTop: '4px solid #000000',
}));

const UltimateCTAButton = styled(NeoButton)(({ theme }) => ({
    backgroundColor: electricOrange,
    color: '#000000',
    height: '70px',
    minWidth: '300px',
    fontSize: '20px',
    border: '4px solid #000000',
    '&:hover': {
        backgroundColor: '#FFFFFF',
        color: '#000000',
    }
}));

const NavBlock = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 24px',
  border: '3px solid #FFFFFF',
  color: '#FFFFFF',
  textDecoration: 'none',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'all 200ms ease',
  '&:hover': {
    backgroundColor: electricOrange,
    color: '#000000',
    borderColor: '#000000',
  }
}));

const SocialIcon = styled(Link)(({ theme }) => ({
  width: '60px',
  height: '60px',
  border: '3px solid #FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#FFFFFF',
  textDecoration: 'none',
  transition: 'all 200ms ease',
  '&:hover': {
    backgroundColor: electricOrange,
    color: '#000000',
  },
  '& svg': {
    width: '32px',
    height: '32px',
  },
  '& .peerlist-p': {
    fontSize: '2rem',
    fontWeight: 'bold',
  }
}));

const AttributionBlock = styled(Box)(({ theme }) => ({
  background: '#000',
  border: `4px solid ${electricOrange}`,
  padding: '16px 24px',
  boxShadow: `6px 6px 0px ${electricOrange}`,
  color: '#FFFFFF',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  textAlign: 'center',
  marginTop: '80px',
}));


export default function Footer() {
    const navLinks = [
        { label: 'About', href: '#content-section' },
        { label: 'Features', href: '#features' },
        { label: 'Sign Up', href: '/sign-up' }
    ];

    const socialLinks = [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hksharma2004', icon: <Linkedin /> },
        { label: 'GitHub', href: 'https://github.com/hksharma2004', icon: <Github /> },
        { label: 'Peerlist', href: 'https://peerlist.io/harsh5harma', icon: <Typography className="peerlist-p">P</Typography> }
    ];

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Stack spacing={4} alignItems="center" textAlign="center" sx={{ mb: 12 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
            Ready to Work Smarter?
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '700px', color: 'grey.300' }}>
            Experience what file management should feel like. No credit card required.
            </Typography>
            <NextLink href="/sign-up" style={{ textDecoration: 'none' }}>
              <UltimateCTAButton>
                  Transform My Workflow
              </UltimateCTAButton>
            </NextLink>
            <Typography variant="body1" sx={{ color: 'grey.400' }}>
            No credit card required. 100% free forever.
            </Typography>
        </Stack>

        <Box sx={{ borderTop: '4px solid #FFFFFF', pt: 8 }}>
            <Grid container spacing={4} justifyContent="space-between" alignItems="center">
                <Grid item xs={12} md="auto">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {navLinks.map((link) => (
                        <NavBlock key={link.label} href={link.href}>
                        {link.label}
                        </NavBlock>
                    ))}
                    </Stack>
                </Grid>
                <Grid item xs={12} md="auto">
                    <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                    {socialLinks.map((social) => (
                        <SocialIcon key={social.label} href={social.href}>
                        {social.icon}
                        </SocialIcon>
                    ))}
                    </Stack>
                </Grid>
            </Grid>
            <AttributionBlock>
            made by hksharma2004 © 2025
            </AttributionBlock>
        </Box>
      </Container>
    </FooterContainer>
  );
}
