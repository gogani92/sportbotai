// Cron endpoint for automated blog generation
// Called by Vercel Cron or external scheduler

import { NextRequest, NextResponse } from 'next/server';
import { generateBatch, seedKeywords, getNextKeyword } from '@/lib/blog';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max for generation

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret OR Vercel's internal cron header
    const authHeader = request.headers.get('Authorization');
    const vercelCron = request.headers.get('x-vercel-cron'); // Vercel sends this for cron jobs
    const cronSecret = process.env.CRON_SECRET;

    // Allow if: Vercel cron header present, OR auth matches secret, OR no secret configured
    const isVercelCron = vercelCron === '1' || vercelCron === 'true';
    const isAuthorized = !cronSecret || authHeader === `Bearer ${cronSecret}`;
    
    if (!isVercelCron && !isAuthorized) {
      console.log('[Blog Cron] Unauthorized request - no valid auth');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`[Blog Cron] Starting generation... (vercelCron: ${isVercelCron}, authorized: ${isAuthorized})`);

    // Check if we have keywords
    const nextKeyword = await getNextKeyword();
    
    console.log(`[Blog Cron] Next keyword: ${nextKeyword || 'none'}`);
    
    if (!nextKeyword) {
      // Seed keywords if none exist
      console.log('[Blog Cron] No keywords found, seeding...');
      await seedKeywords();
    }

    // Generate 1 post per cron run (to stay within limits)
    console.log('[Blog Cron] Starting batch generation...');
    const results = await generateBatch(1);

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    console.log(`[Blog Cron] Complete: ${successful} generated, ${failed.length} failed`);
    if (failed.length > 0) {
      console.error('[Blog Cron] Failures:', failed.map(f => f.error));
    }

    return NextResponse.json({
      success: true,
      generated: successful,
      failed: failed.length,
      results: results.map(r => ({
        success: r.success,
        slug: r.slug,
        error: r.error,
        cost: r.cost,
        duration: r.duration,
      })),
    });

  } catch (error) {
    console.error('Cron blog generation error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

// POST for manual trigger with count
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const count = Math.min(body.count || 1, 5); // Max 5 at a time

    const results = await generateBatch(count);

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error('Manual blog generation error:', error);
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}
