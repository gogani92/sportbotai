/**
 * API Route: /api/stripe/webhook
 * 
 * Stripe Webhook handler za obradu događaja kao što su:
 * - checkout.session.completed (uspešno plaćanje)
 * - customer.subscription.updated (promena pretplate)
 * - customer.subscription.deleted (otkazana pretplata)
 * - invoice.payment_failed (neuspelo plaćanje)
 * 
 * SETUP KORACI:
 * 1. U Stripe Dashboard-u idi na Developers > Webhooks
 * 2. Klikni "Add endpoint"
 * 3. Unesi URL: https://tvoja-domena.com/api/stripe/webhook
 * 4. Izaberi događaje:
 *    - checkout.session.completed
 *    - customer.subscription.created
 *    - customer.subscription.updated
 *    - customer.subscription.deleted
 *    - invoice.payment_failed
 * 5. Kopiraj "Signing secret" (počinje sa "whsec_...")
 * 6. Dodaj u .env.local:
 *    STRIPE_WEBHOOK_SECRET=whsec_...
 * 
 * TESTIRANJE LOKALNO:
 * 1. Instaliraj Stripe CLI: https://stripe.com/docs/stripe-cli
 * 2. stripe login
 * 3. stripe listen --forward-to localhost:3000/api/stripe/webhook
 * 4. Kopiraj webhook signing secret koji CLI prikaže
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Webhook secret za verifikaciju
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * POST /api/stripe/webhook
 * 
 * Stripe šalje POST request sa event podacima.
 * VAŽNO: Body mora biti raw (ne JSON parsed) za verifikaciju potpisa.
 */
export async function POST(request: NextRequest) {
  try {
    // Čitaj raw body
    const body = await request.text();
    
    // Dobavi Stripe potpis iz headera
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verifikuj event
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Webhook signature verification failed:', message);
      return NextResponse.json(
        { error: `Webhook Error: ${message}` },
        { status: 400 }
      );
    }

    // Obradi event na osnovu tipa
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// ================================================
// EVENT HANDLERS
// TODO: Implementiraj logiku za svaki handler
// ================================================

/**
 * Uspešno završen checkout - korisnik je platio
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);
  
  // TODO: Implementiraj logiku
  // 
  // 1. Izvuci podatke o korisniku
  // const customerEmail = session.customer_email;
  // const customerId = session.customer;
  // const subscriptionId = session.subscription;
  // const planName = session.metadata?.planName;
  // 
  // 2. Ažuriraj bazu podataka
  // await prisma.user.update({
  //   where: { email: customerEmail },
  //   data: {
  //     stripeCustomerId: customerId,
  //     subscriptionId: subscriptionId,
  //     subscriptionStatus: 'active',
  //     plan: planName,
  //   }
  // });
  // 
  // 3. Pošalji confirmation email
  // await sendEmail({
  //   to: customerEmail,
  //   subject: 'Dobrodošli u BetSense AI Pro!',
  //   template: 'subscription-confirmed',
  // });
  
  console.log('TODO: Implement checkout completed handler');
}

/**
 * Nova pretplata kreirana
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  // TODO: Implementiraj logiku
  // Slično kao handleCheckoutCompleted
  
  console.log('TODO: Implement subscription created handler');
}

/**
 * Pretplata ažurirana (npr. promena plana, renewal)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  // TODO: Implementiraj logiku
  // 
  // const status = subscription.status; // 'active', 'past_due', 'canceled', etc.
  // const currentPeriodEnd = subscription.current_period_end;
  // 
  // await prisma.subscription.update({
  //   where: { stripeSubscriptionId: subscription.id },
  //   data: {
  //     status: status,
  //     currentPeriodEnd: new Date(currentPeriodEnd * 1000),
  //   }
  // });
  
  console.log('TODO: Implement subscription updated handler');
}

/**
 * Pretplata otkazana
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  // TODO: Implementiraj logiku
  // 
  // await prisma.subscription.update({
  //   where: { stripeSubscriptionId: subscription.id },
  //   data: {
  //     status: 'canceled',
  //     canceledAt: new Date(),
  //   }
  // });
  // 
  // // Downgrade korisnika na Free plan
  // await prisma.user.update({
  //   where: { subscriptionId: subscription.id },
  //   data: { plan: 'free' }
  // });
  // 
  // // Pošalji email o otkazu
  // await sendEmail({
  //   to: user.email,
  //   subject: 'Vaša pretplata je otkazana',
  //   template: 'subscription-canceled',
  // });
  
  console.log('TODO: Implement subscription deleted handler');
}

/**
 * Neuspelo plaćanje (npr. kartica istekla)
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed for invoice:', invoice.id);
  
  // TODO: Implementiraj logiku
  // 
  // const customerEmail = invoice.customer_email;
  // 
  // // Pošalji email o neuspelom plaćanju
  // await sendEmail({
  //   to: customerEmail,
  //   subject: 'Problem sa plaćanjem - BetSense AI',
  //   template: 'payment-failed',
  // });
  // 
  // // Opciono: Ažuriraj status u bazi
  // await prisma.subscription.update({
  //   where: { stripeCustomerId: invoice.customer },
  //   data: { status: 'past_due' }
  // });
  
  console.log('TODO: Implement payment failed handler');
}
