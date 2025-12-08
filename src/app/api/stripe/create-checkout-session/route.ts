/**
 * API Route: /api/stripe/create-checkout-session
 * 
 * Kreira Stripe Checkout sesiju za Pro ili Premium pretplatu.
 * 
 * SETUP KORACI:
 * 1. Kreiraj Stripe nalog na stripe.com
 * 2. U Stripe Dashboard-u idi na Products i kreiraj dva proizvoda:
 *    - "BetSense AI Pro" - €9.99/mesečno (recurring)
 *    - "BetSense AI Premium" - €19.99/mesečno (recurring)
 * 3. Kopiraj Price ID-jeve (počinju sa "price_...")
 * 4. Dodaj ih u .env.local:
 *    STRIPE_SECRET_KEY=sk_test_...
 *    STRIPE_PRO_PRICE_ID=price_...
 *    STRIPE_PREMIUM_PRICE_ID=price_...
 * 5. Ažuriraj PricingCards.tsx sa pravim Price ID-jevima
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicijalizacija Stripe klijenta
// TODO: Proveri da li je STRIPE_SECRET_KEY podešen u .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

/**
 * POST /api/stripe/create-checkout-session
 * 
 * Request body:
 * {
 *   priceId: string,  // Stripe Price ID
 *   planName: string  // "Pro" ili "Premium"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Proveri da li je Stripe key podešen
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return NextResponse.json(
        { error: 'Stripe nije konfigurisan. Kontaktiraj podršku.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { priceId, planName } = body;

    // Validacija
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID je obavezan' },
        { status: 400 }
      );
    }

    // ================================================
    // TODO: Proveri da li korisnik već ima aktivnu pretplatu
    // Ovo zahteva implementaciju autentifikacije (npr. NextAuth)
    // 
    // Primer:
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Morate biti ulogovani' }, { status: 401 });
    // }
    // 
    // const existingSubscription = await prisma.subscription.findFirst({
    //   where: { userId: session.user.id, status: 'active' }
    // });
    // 
    // if (existingSubscription) {
    //   return NextResponse.json({ error: 'Već imate aktivnu pretplatu' }, { status: 400 });
    // }
    // ================================================

    // Kreiraj Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // URL-ovi nakon plaćanja
      // TODO: Promeni ove URL-ove za produkciju
      success_url: `${getBaseUrl()}/pricing?success=true&plan=${planName}`,
      cancel_url: `${getBaseUrl()}/pricing?canceled=true`,
      
      // Opciono: Poveži sa korisnikom ako imaš auth
      // customer_email: session?.user?.email,
      // metadata: {
      //   userId: session?.user?.id,
      //   planName: planName,
      // },
      
      // Opcije za subscription
      subscription_data: {
        // Trial period (opciono)
        // trial_period_days: 7,
        
        metadata: {
          planName: planName,
        },
      },
      
      // Automatski prikupi billing adresu
      billing_address_collection: 'auto',
      
      // Prikaži uslove korišćenja
      consent_collection: {
        terms_of_service: 'required',
      },

      // Custom branding
      // TODO: Dodaj svoj logo u Stripe Dashboard > Settings > Branding
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Stripe specifične greške
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe greška: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Greška pri kreiranju checkout sesije' },
      { status: 500 }
    );
  }
}

/**
 * Vraća base URL aplikacije.
 * Koristi NEXT_PUBLIC_BASE_URL iz env-a ili fallback na localhost.
 */
function getBaseUrl(): string {
  // Za produkciju, podesi NEXT_PUBLIC_BASE_URL u Vercel env variables
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Za development
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return 'http://localhost:3000';
}
