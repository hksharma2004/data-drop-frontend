'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, IconButton, Drawer, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NeoButton } from '@/components/ui/neo-button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const NeoAppBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: '#FFFFFF',
  border: '4px solid #000000',
  borderTop: 'none',
  boxShadow: '0px 8px 0px #000000',
  transition: 'all 300ms ease'
}));

const NeoToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  minHeight: '80px',
  [theme.breakpoints.up('md')]: {
    padding: '16px 32px'
  }
}));

const NeoLogoText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 900,
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#000000',
  '& .orange': {
    color: '#FF7A3D'
  },
  '& .black': {
    color: '#000000'
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2rem',
  }
}));

const NeoNavLink = styled(Typography)(({ theme }) => ({
  color: '#000000',
  fontSize: '0.875rem',
  fontWeight: 800,
  cursor: 'pointer',
  padding: '10px 16px',
  border: '3px solid transparent',
  borderRadius: '0px',
  position: 'relative',
  transition: 'all 200ms ease',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  '&:hover': {
    backgroundColor: '#FF7A3D',
    color: '#FFFFFF',
    border: '3px solid #000000',
    boxShadow: '4px 4px 0px #000000',
    transform: 'translate(-2px, -2px)'
  },
  '&:active': {
    transform: 'translate(1px, 1px)',
    boxShadow: '2px 2px 0px #000000'
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1rem',
    padding: '12px 20px',
  }
}));

const NeoIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '3px solid #000000',
  borderRadius: '0px',
  boxShadow: '4px 4px 0px #000000',
  color: '#000000',
  padding: '10px',
  transition: 'all 200ms ease',
  '&:hover': {
    backgroundColor: '#FF7A3D',
    color: '#FFFFFF',
    transform: 'translate(-2px, -2px)',
    boxShadow: '6px 6px 0px #000000'
  },
  '&:active': {
    transform: 'translate(1px, 1px)',
    boxShadow: '2px 2px 0px #000000'
  },
  [theme.breakpoints.down('md')]: {
    padding: '8px',
  }
}));

const NeoDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '300px',
    backgroundColor: '#FFFFFF',
    border: '4px solid #000000',
    borderRight: 'none',
    boxShadow: '-8px 0px 0px #000000',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '320px',
    }
  }
}));

const NeoMobileMenu = styled(Box)(({ theme }) => ({
  '& .MuiListItem-root': {
    padding: '8px 0px'
  }
}));

export default function NeoNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const navItems = [
    { label: 'Features', action: () => scrollToSection('features') },
    { label: 'Pricing', action: () => scrollToSection('pricing') }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const mobileMenu = (
    <NeoMobileMenu>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <NeoLogoText>
          <span className="orange">DATA</span><span className="black">DROP</span>
        </NeoLogoText>
        <NeoIconButton onClick={handleDrawerToggle}>
          <X size={24} />
        </NeoIconButton>
      </Stack>
      
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} sx={{ px: 0 }}>
            <NeoNavLink onClick={item.action} sx={{ width: '100%', textAlign: 'left' }}>
              {item.label}
            </NeoNavLink>
          </ListItem>
        ))}
        <ListItem sx={{ px: 0, mt: 2 }}>
          <Link href="/sign-in" style={{ width: '100%' }}>
            <NeoButton variant="outline" className="w-full mb-4">
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
    </NeoMobileMenu>
  );

  return (
    <>
      <NeoAppBar
        sx={{
          borderBottom: isScrolled ? '6px solid #000000' : '4px solid #000000',
          boxShadow: isScrolled ? '0px 10px 0px #000000' : '0px 8px 0px #000000'
        }}
      >
        <NeoToolbar>
          <NeoLogoText>
            <span className="orange">DATA</span><span className="black">DROP</span>
          </NeoLogoText>
          
          {/* Desktop Navigation */}
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            {navItems.map((item) => (
              <NeoNavLink key={item.label} onClick={item.action}>
                {item.label}
              </NeoNavLink>
            ))}
            
            <Box sx={{ ml: 3 }}>
              <Link href="/sign-in">
                <NeoButton variant="outline" className="mr-3">
                  Log In
                </NeoButton>
              </Link>
              <Link href="/sign-up">
                <NeoButton>
                  Sign Up
                </NeoButton>
              </Link>
            </Box>
          </Stack>
          
          {/* Mobile Menu Button */}
          <NeoIconButton
            onClick={handleDrawerToggle}
            sx={{ 
              display: { md: 'none' }
            }}
          >
            <Menu size={20} />
          </NeoIconButton>
        </NeoToolbar>
      </NeoAppBar>
      
      {/* Mobile Drawer */}
      <NeoDrawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
      >
        {mobileMenu}
      </NeoDrawer>
    </>
  );
}