'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, IconButton, Drawer, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NeoButton } from '@/components/ui/neo-button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const NeoAppBar = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderBottom: '4px solid #000000',
  boxShadow: '0px 6px 0px #000000',
  transition: 'all 200ms ease-in-out',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
}));

const NeoToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  minHeight: '70px',
  [theme.breakpoints.up('md')]: {
    padding: '12px 24px',
  }
}));

const NeoLogoText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 900,
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#000000',
  [theme.breakpoints.up('md')]: {
    fontSize: '1.8rem',
  }
}));

const NavLinkContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
  marginLeft: '24px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

const NeoNavLink = styled(Link, {
    shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'textColor' && prop !== 'hoverBgColor' && prop !== 'hoverTextColor'
})<{ bgColor?: string, textColor?: string, hoverBgColor?: string, hoverTextColor?: string }>(
    ({ theme, bgColor, textColor, hoverBgColor, hoverTextColor }) => ({
      color: textColor || '#000000',
      backgroundColor: bgColor || 'transparent',
      fontSize: '0.875rem',
      fontWeight: 800,
      cursor: 'pointer',
      padding: '8px 12px',
      border: '3px solid #000000',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      transition: 'all 200ms ease',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: hoverBgColor || theme.palette.primary.main,
        color: hoverTextColor || '#FFFFFF',
        textDecoration: 'none',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '1rem',
        padding: '10px 16px',
      }
}));

const NeoIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '3px solid #000000',
  borderRadius: '0px',
  boxShadow: '4px 4px 0px #000000',
  color: '#000000',
  padding: '8px',
  transition: 'all 200ms ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    transform: 'translate(-2px, -2px)',
    boxShadow: '6px 6px 0px #000000'
  },
  '&:active': {
    transform: 'translate(1px, 1px)',
    boxShadow: '2px 2px 0px #000000'
  },
  [theme.breakpoints.up('md')]: {
    padding: '10px',
  }
}));

const NeoDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '280px',
    backgroundColor: '#FFFFFF',
    border: '4px solid #000000',
    padding: '20px',
    boxShadow: '-8px 0px 0px #000000',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '320px',
    }
  }
}));

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const navItems = [
    { 
      label: 'Features', 
      action: () => scrollToSection('features'), 
      bgColor: '#FFFFFF', 
      textColor: '#000000',
      hoverBgColor: '#000000',
      hoverTextColor: '#FF7A3D',
    },
    { 
      label: 'About', 
      action: () => scrollToSection('about'),
      bgColor: '#FFFFFF',
      textColor: '#000000',
      hoverBgColor: '#000000',
      hoverTextColor: '#FF7A3D',
    }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const mobileMenu = (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <NeoLogoText>DATADROP</NeoLogoText>
        <IconButton onClick={handleDrawerToggle} sx={{ p: 1 }}>
          <X size={20} />
        </IconButton>
      </Stack>
      
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} sx={{ px: 0, mb: 2 }}>
            <NeoNavLink 
                onClick={item.action} 
                href={`#${item.label.toLowerCase()}`} 
                sx={{ width: '100%', textAlign: 'center' }}
                bgColor={item.bgColor}
                textColor={item.textColor}
                hoverBgColor={item.hoverBgColor}
                hoverTextColor={item.hoverTextColor}
            >
              {item.label}
            </NeoNavLink>
          </ListItem>
        ))}
        <ListItem sx={{ px: 0, mt: 3 }}>
          <Link href="/sign-in" style={{ width: '100%' }}>
            <NeoButton variant="outline" className="w-full mb-3">
              Log In
            </NeoButton>
          </Link>
        </ListItem>
        <ListItem sx={{ px: 0 }}>
          <Link href="/sign-up" style={{ width: '100%' }}>
            <NeoButton className="w-full">
              Sign Up
            </NeoButton>
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <NeoAppBar>
        <NeoToolbar>
          <Stack direction="row" alignItems="center" flexGrow={{ xs: 1, md: 0 }}>
            <NeoLogoText>DATADROP</NeoLogoText>
            
            <NavLinkContainer>
              {navItems.map((item) => (
                <NeoNavLink 
                    key={item.label} 
                    onClick={item.action} 
                    href={`#${item.label.toLowerCase()}`}
                    bgColor={item.bgColor}
                    textColor={item.textColor}
                    hoverBgColor={item.hoverBgColor}
                    hoverTextColor={item.hoverTextColor}
                >
                  {item.label}
                </NeoNavLink>
              ))}
            </NavLinkContainer>
          </Stack>
          
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Link href="/sign-in">
              <NeoButton variant="outline" className="mr-2">
                Log In
              </NeoButton>
            </Link>
            <Link href="/sign-up">
              <NeoButton>
                Sign Up
              </NeoButton>
            </Link>
          </Box>
          
          <Box sx={{ display: { md: 'none' } }}>
             <NeoIconButton onClick={handleDrawerToggle}>
                <Menu size={20} />
             </NeoIconButton>
          </Box>

        </NeoToolbar>
      </NeoAppBar>
      
      <NeoDrawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {mobileMenu}
      </NeoDrawer>
    </>
  );
}