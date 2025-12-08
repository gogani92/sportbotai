/**
 * Landing Page - Home (/)
 * 
 * Glavna stranica BetSense AI aplikacije.
 * Sadrži sve sekcije za predstavljanje platforme.
 */

import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import WhyNotTipster from '@/components/WhyNotTipster';
import Features from '@/components/Features';
import PricingTeaser from '@/components/PricingTeaser';
import ResponsibleGamblingBlock from '@/components/ResponsibleGamblingBlock';

export default function HomePage() {
  return (
    <>
      {/* Hero sekcija - glavna vizuelna komponenta */}
      <Hero />

      {/* Kako funkcioniše - 3 koraka */}
      <HowItWorks />

      {/* Zašto nismo tipster - VAŽNA sekcija za pozicioniranje */}
      <WhyNotTipster />

      {/* Glavne funkcije */}
      <Features />

      {/* Pricing teaser */}
      <PricingTeaser />

      {/* Odgovorno klađenje - OBAVEZNO */}
      <ResponsibleGamblingBlock />
    </>
  );
}
