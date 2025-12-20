/**
 * Activity Tracking API
 * 
 * POST /api/activity - Update user's last active timestamp
 * 
 * Called periodically by the client to track user activity.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Update last active timestamp
    await prisma.user.update({
      where: { email: session.user.email },
      data: { lastActiveAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silently fail - this is non-critical
    return NextResponse.json({ success: false });
  }
}
