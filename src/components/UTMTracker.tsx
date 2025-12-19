'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * UTM Tracker Component
 * 
 * Captures UTM parameters from the URL and stores them in localStorage
 * for attribution when the user eventually registers.
 * 
 * Add this to your layout to track all landing pages.
 */
export default function UTMTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get('utm_source') || searchParams.get('ref');
    const medium = searchParams.get('utm_medium');
    const campaign = searchParams.get('utm_campaign');
    
    // Only update if we have new params (don't overwrite existing)
    if (source || medium || campaign) {
      const existingParams = localStorage.getItem('utm_params');
      const existing = existingParams ? JSON.parse(existingParams) : {};
      
      const newParams = {
        source: source || existing.source,
        medium: medium || existing.medium,
        campaign: campaign || existing.campaign,
        landingPage: window.location.pathname,
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem('utm_params', JSON.stringify(newParams));
    }
    
    // Also capture referrer if no UTM and no existing params
    if (!source && !localStorage.getItem('utm_params') && document.referrer) {
      try {
        const referrerHost = new URL(document.referrer).hostname;
        if (referrerHost && referrerHost !== window.location.hostname) {
          localStorage.setItem('utm_params', JSON.stringify({
            source: referrerHost,
            medium: 'referral',
            landingPage: window.location.pathname,
            timestamp: new Date().toISOString(),
          }));
        }
      } catch {
        // Invalid referrer URL, ignore
      }
    }
  }, [searchParams]);

  // This component doesn't render anything
  return null;
}
