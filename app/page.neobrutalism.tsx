'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import neobrutalistTheme from '@/lib/neobrutalism-theme';
import NeoNavbar from '@/components/neobrutalism/NeoNavbar';
import NeoHeroSection from '@/components/neobrutalism/NeoHeroSection';

export default function NeobrutalistPage() {
  return (
    <ThemeProvider theme={neobrutalistTheme}>
      <CssBaseline />
      <div className="min-h-screen bg-white">
        <NeoNavbar />
        <NeoHeroSection />
      </div>
    </ThemeProvider>
  );
}