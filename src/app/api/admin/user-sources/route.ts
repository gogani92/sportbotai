/**
 * Admin API: User Sources Report
 * 
 * GET /api/admin/user-sources
 * 
 * Returns aggregated data about user acquisition sources.
 * Requires admin authentication.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Admin emails - add your email here
const ADMIN_EMAILS = ['admin@sportbotai.com', 'gogani92@gmail.com'];

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get aggregated source data
    const sourceStats = await prisma.user.groupBy({
      by: ['referralSource'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Get recent users with their sources
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        referralSource: true,
        referralMedium: true,
        referralCampaign: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    // Get medium breakdown
    const mediumStats = await prisma.user.groupBy({
      by: ['referralMedium'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Get campaign breakdown
    const campaignStats = await prisma.user.groupBy({
      by: ['referralCampaign'],
      _count: {
        id: true,
      },
      where: {
        referralCampaign: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Get total counts
    const totalUsers = await prisma.user.count();
    const trackedUsers = await prisma.user.count({
      where: {
        referralSource: {
          not: null,
        },
      },
    });

    return NextResponse.json({
      summary: {
        totalUsers,
        trackedUsers,
        trackingRate: totalUsers > 0 ? ((trackedUsers / totalUsers) * 100).toFixed(1) + '%' : '0%',
      },
      bySource: sourceStats.map(s => ({
        source: s.referralSource || 'Unknown/Direct',
        count: s._count.id,
      })),
      byMedium: mediumStats.map(m => ({
        medium: m.referralMedium || 'Unknown',
        count: m._count.id,
      })),
      byCampaign: campaignStats.map(c => ({
        campaign: c.referralCampaign,
        count: c._count.id,
      })),
      recentUsers: recentUsers.map(u => ({
        email: u.email,
        name: u.name,
        plan: u.plan,
        source: u.referralSource || 'Unknown',
        medium: u.referralMedium || '-',
        campaign: u.referralCampaign || '-',
        signedUp: u.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('[Admin] Error fetching user sources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user sources' },
      { status: 500 }
    );
  }
}
