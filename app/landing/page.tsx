'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import neobrutalistTheme from '@/lib/neobrutalism-theme';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import ContentSection from '@/components/landing/ContentSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ScrollProgress from '@/components/landing/ScrollProgress';

export default function LandingPage() {
  return (
    <ThemeProvider theme={neobrutalistTheme}>
      <CssBaseline />
      <Navbar />
      <ScrollProgress />
      <HeroSection />
      <ContentSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </ThemeProvider>
  );
}