/**
 * API Route: /api/stripe/webhook
 * 
 * Stripe Webhook handler for events:
 * - checkout.session.completed (successful payment)
 * - customer.subscription.updated (subscription change)
 * - customer.subscription.deleted (cancelled subscription)
 * - invoice.payment_failed (failed payment)
 * 
 * SETUP STEPS:
 * 1. In Stripe Dashboard go to Developers > Webhooks
 * 2. Click "Add endpoint"
 * 3. Enter URL: https://sportbotai.com/api/stripe/webhook
 * 4. Select events:
 *    - checkout.session.completed
 *    - customer.subscription.created
 *    - customer.subscription.updated
 *    - customer.subscription.deleted
 *    - invoice.payment_failed
 * 5. Copy "Signing secret" (starts with "whsec_...")
 * 6. Add to Vercel env vars:
 *    STRIPE_WEBHOOK_SECRET=whsec_...
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { 
  sendWelcomeEmail, 
  sendPaymentFailedEmail, 
  sendCancellationEmail,
  sendRenewalEmail 
} from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Webhook secret for verification
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Plan name mapping
const PLAN_NAMES: Record<string, string> = {
  [process.env.STRIPE_PRO_PRICE_ID || '']: 'Pro',
  [process.env.STRIPE_PREMIUM_PRICE_ID || '']: 'Premium',
};

/**
 * POST /api/stripe/webhook
 */
export async function POST(request: NextRequest) {
  try {
    // Read raw body
    const body = await request.text();
    
    // Get Stripe signature from header
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

    // Verify event
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

    // Handle event based on type
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
// ================================================

/**
 * Checkout completed - user has paid
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);
  
  const customerEmail = session.customer_email;
  const priceId = session.metadata?.priceId || '';
  const planName = PLAN_NAMES[priceId] || session.metadata?.planName || 'Pro';
  
  if (customerEmail) {
    // Send welcome email
    await sendWelcomeEmail(customerEmail, planName);
    console.log(`[Webhook] Welcome email sent to ${customerEmail} for ${planName}`);
  }
  
  // TODO: Update user in database
  // await prisma.user.update({
  //   where: { email: customerEmail },
  //   data: {
  //     stripeCustomerId: session.customer as string,
  //     subscriptionId: session.subscription as string,
  //     subscriptionStatus: 'active',
  //     plan: planName.toLowerCase(),
  //   }
  // });
}

/**
 * New subscription created
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  // Get customer email
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  if ('email' in customer && customer.email) {
    const priceId = subscription.items.data[0]?.price?.id || '';
    const planName = PLAN_NAMES[priceId] || 'Pro';
    
    // Welcome email is sent in handleCheckoutCompleted
    console.log(`[Webhook] Subscription created for ${customer.email} - ${planName}`);
  }
}

/**
 * Subscription updated (e.g., plan change, renewal)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  const status = subscription.status;
  const priceId = subscription.items.data[0]?.price?.id || '';
  const planName = PLAN_NAMES[priceId] || 'Pro';
  
  // Get customer email
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  if (!('email' in customer) || !customer.email) return;
  
  // If subscription was renewed (active status after being past_due or similar)
  if (status === 'active') {
    const nextBillingDate = new Date(subscription.current_period_end * 1000);
    await sendRenewalEmail(customer.email, planName, nextBillingDate);
    console.log(`[Webhook] Renewal email sent to ${customer.email}`);
  }
  
  // TODO: Update subscription in database
  // await prisma.subscription.update({
  //   where: { stripeSubscriptionId: subscription.id },
  //   data: {
  //     status: status,
  //     currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  //   }
  // });
}

/**
 * Subscription cancelled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  // Get customer email
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  if (!('email' in customer) || !customer.email) return;
  
  const priceId = subscription.items.data[0]?.price?.id || '';
  const planName = PLAN_NAMES[priceId] || 'Pro';
  const endDate = new Date(subscription.current_period_end * 1000);
  
  // Send cancellation email
  await sendCancellationEmail(customer.email, planName, endDate);
  console.log(`[Webhook] Cancellation email sent to ${customer.email}`);
  
  // TODO: Update user in database
  // await prisma.user.update({
  //   where: { stripeSubscriptionId: subscription.id },
  //   data: { 
  //     plan: 'free',
  //     subscriptionStatus: 'canceled',
  //   }
  // });
}

/**
 * Payment failed (e.g., card expired)
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed for invoice:', invoice.id);
  
  const customerEmail = invoice.customer_email;
  
  if (customerEmail) {
    // Get plan name from subscription
    let planName = 'Pro';
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const priceId = subscription.items.data[0]?.price?.id || '';
      planName = PLAN_NAMES[priceId] || 'Pro';
    }
    
    // Send payment failed email
    await sendPaymentFailedEmail(customerEmail, planName);
    console.log(`[Webhook] Payment failed email sent to ${customerEmail}`);
  }
  
  // TODO: Update subscription status in database
  // await prisma.subscription.update({
  //   where: { stripeCustomerId: invoice.customer as string },
  //   data: { status: 'past_due' }
  // });
}
