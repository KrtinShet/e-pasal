import type { Metadata } from 'next';

import { HeroSection } from '@/components/landing/hero-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';

export const metadata: Metadata = {
  title: 'Baazarify - Launch Your Online Store in Nepal',
  description:
    'Baazarify is the all-in-one e-commerce platform built for Nepal. Create your store, manage products, accept local payments like eSewa and Khalti, and grow your business online.',
  keywords: [
    'e-commerce Nepal',
    'online store Nepal',
    'sell online Nepal',
    'eSewa payments',
    'Khalti payments',
    'Nepali e-commerce platform',
    'Baazarify',
  ],
  openGraph: {
    title: 'Baazarify - Launch Your Online Store in Nepal',
    description:
      'Create your online store in minutes. Accept local payments, manage orders, and grow your business with Baazarify.',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
    </>
  );
}
