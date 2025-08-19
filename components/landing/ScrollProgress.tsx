'use client';

import React, { useState, useEffect } from 'react';
import { Box, Fab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronUp } from 'lucide-react';

const ProgressBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '4px',
  backgroundColor: 'rgba(255, 122, 61, 0.2)',
  zIndex: 1000
}));

const ProgressFill = styled(Box)<{ progress: number }>(({ theme, progress }) => ({
  height: '100%',
  width: `${progress}%`,
  backgroundColor: theme.palette.primary.main,
  transition: 'width 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  boxShadow: `0 0 10px ${theme.palette.primary.main}`,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '20px',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main})`,
    filter: 'blur(2px)'
  }
}));

const FloatingButton = styled(Fab, {
  shouldForwardProp: (prop) => prop !== 'visible',
})<{ visible: boolean }>(({ theme, visible }) => ({
  position: 'fixed',
  bottom: '32px',
  right: '32px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: `3px solid ${theme.palette.secondary.main}`,
  boxShadow: `6px 6px 0px ${theme.palette.secondary.main}`,
  transform: visible ? 'translateY(0) scale(1)' : 'translateY(100px) scale(0.8)',
  opacity: visible ? 1 : 0,
  transition: 'all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  zIndex: 1000,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: visible ? 'translateY(-4px) scale(1.1)' : 'translateY(100px) scale(0.8)',
    boxShadow: `8px 8px 0px ${theme.palette.secondary.main}`,
    '& svg': {
      transform: 'translateY(-2px)'
    }
  },
  '&:active': {
    transform: visible ? 'translateY(-2px) scale(0.95)' : 'translateY(100px) scale(0.8)',
    transition: 'all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  '& svg': {
    transition: 'transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
}));

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
      setShowButton(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ProgressBar>
        <ProgressFill progress={scrollProgress} />
      </ProgressBar>
      
      <FloatingButton 
        visible={showButton}
        onClick={scrollToTop}
        size="medium"
      >
        <ChevronUp />
      </FloatingButton>
    </>
  );
}