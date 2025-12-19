import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminDashboard from './AdminDashboard';

// Admin access list
const ADMIN_EMAILS = [
  'gogecmaestrotib92@gmail.com',
  'aiinstamarketing@gmail.com',
];

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Check authentication
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Check if user is admin
  if (!ADMIN_EMAILS.includes(session.user.email)) {
    redirect('/');
  }

  // Fetch dashboard stats
  const [
    totalUsers,
    proUsers,
    premiumUsers,
    totalAnalyses,
    todayAnalyses,
    recentUsers,
    recentAnalyses,
    // Chat/Memory stats
    chatStats,
    topCategories,
    topTeams,
    recentQueries,
    agentPostsCount,
    // Prediction stats
    aiPredictionStats,
  ] = await Promise.all([
    // Total users
    prisma.user.count(),
    
    // Pro subscribers
    prisma.user.count({ where: { plan: 'PRO' } }),
    
    // Premium subscribers
    prisma.user.count({ where: { plan: 'PREMIUM' } }),
    
    // Total analyses
    prisma.analysis.count(),
    
    // Today's analyses
    prisma.analysis.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    
    // Recent users (last 10)
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        createdAt: true,
        _count: { select: { analyses: true } },
      },
    }),
    
    // Recent analyses (last 10)
    prisma.analysis.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        sport: true,
        homeTeam: true,
        awayTeam: true,
        createdAt: true,
        user: {
          select: { name: true, email: true },
        },
      },
    }),
    
    // Chat query stats
    getChatStats(),
    
    // Top categories
    getTopCategoriesFromDB(),
    
    // Top teams
    getTopTeamsFromDB(),
    
    // Recent queries
    getRecentQueries(),
    
    // Agent posts count
    getAgentPostsCount(),
    
    // AI Prediction stats (Prediction model from pre-analyze)
    getAIPredictionStats(),
  ]);

  // Calculate MRR (Monthly Recurring Revenue)
  const mrr = (proUsers * 18.99) + (premiumUsers * 40);

  const stats = {
    totalUsers,
    proUsers,
    premiumUsers,
    freeUsers: totalUsers - proUsers - premiumUsers,
    totalAnalyses,
    todayAnalyses,
    mrr,
  };

  const chatAnalytics = {
    ...chatStats,
    topCategories,
    topTeams,
    recentQueries,
    agentPostsCount,
  };

  return (
    <AdminDashboard
      stats={stats}
      recentUsers={recentUsers}
      recentAnalyses={recentAnalyses}
      chatAnalytics={chatAnalytics}
      aiPredictionStats={aiPredictionStats}
    />
  );
}

// Helper functions for chat analytics
async function getChatStats() {
  try {
    const [totalQueries, todayQueries, queriesWithSearch, queriesWithCitations] = await Promise.all([
      prisma.chatQuery.count(),
      prisma.chatQuery.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.chatQuery.count({ where: { usedRealTimeSearch: true } }),
      prisma.chatQuery.count({ where: { hadCitations: true } }),
    ]);
    
    return {
      totalQueries,
      todayQueries,
      queriesWithSearch,
      queriesWithCitations,
      searchRate: totalQueries > 0 ? Math.round((queriesWithSearch / totalQueries) * 100) : 0,
    };
  } catch {
    return { totalQueries: 0, todayQueries: 0, queriesWithSearch: 0, queriesWithCitations: 0, searchRate: 0 };
  }
}

async function getTopCategoriesFromDB() {
  try {
    const results = await prisma.chatQuery.groupBy({
      by: ['category'],
      where: { category: { not: null } },
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
      take: 10,
    });
    return results.map(r => ({ category: r.category!, count: r._count.category }));
  } catch {
    return [];
  }
}

async function getTopTeamsFromDB() {
  try {
    const results = await prisma.chatQuery.groupBy({
      by: ['team'],
      where: { team: { not: null } },
      _count: { team: true },
      orderBy: { _count: { team: 'desc' } },
      take: 10,
    });
    return results.map(r => ({ team: r.team!, count: r._count.team }));
  } catch {
    return [];
  }
}

async function getRecentQueries() {
  try {
    return await prisma.chatQuery.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        query: true,
        category: true,
        brainMode: true,
        sport: true,
        team: true,
        usedRealTimeSearch: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

async function getAgentPostsCount() {
  try {
    return await prisma.agentPost.count();
  } catch {
    return 0;
  }
}

/**
 * Get AI Prediction stats from the Prediction model (pre-analyzed matches)
 */
async function getAIPredictionStats() {
  try {
    const [
      totalPredictions,
      pendingPredictions,
      hitPredictions,
      missPredictions,
      recentPredictions,
      byLeague,
      bySport,
    ] = await Promise.all([
      // Total predictions
      prisma.prediction.count(),
      
      // Pending (not yet validated)
      prisma.prediction.count({ where: { outcome: 'PENDING' } }),
      
      // Hits
      prisma.prediction.count({ where: { outcome: 'HIT' } }),
      
      // Misses
      prisma.prediction.count({ where: { outcome: 'MISS' } }),
      
      // Recent 50 predictions
      prisma.prediction.findMany({
        take: 50,
        orderBy: { kickoff: 'desc' },
        select: {
          id: true,
          matchName: true,
          sport: true,
          league: true,
          kickoff: true,
          prediction: true,
          conviction: true,
          odds: true,
          outcome: true,
          actualResult: true,
          createdAt: true,
        },
      }),
      
      // By league
      prisma.prediction.groupBy({
        by: ['league'],
        where: { outcome: { not: 'PENDING' } },
        _count: { id: true },
      }).then(async (leagues) => {
        return Promise.all(
          leagues.map(async (l) => {
            const hits = await prisma.prediction.count({
              where: { league: l.league, outcome: 'HIT' },
            });
            return {
              league: l.league,
              total: l._count.id,
              hits,
              accuracy: l._count.id > 0 ? Math.round((hits / l._count.id) * 100) : 0,
            };
          })
        );
      }),
      
      // By sport
      prisma.prediction.groupBy({
        by: ['sport'],
        where: { outcome: { not: 'PENDING' } },
        _count: { id: true },
      }).then(async (sports) => {
        return Promise.all(
          sports.map(async (s) => {
            const hits = await prisma.prediction.count({
              where: { sport: s.sport, outcome: 'HIT' },
            });
            return {
              sport: s.sport,
              total: s._count.id,
              hits,
              accuracy: s._count.id > 0 ? Math.round((hits / s._count.id) * 100) : 0,
            };
          })
        );
      }),
    ]);
    
    const evaluatedCount = hitPredictions + missPredictions;
    const overallAccuracy = evaluatedCount > 0 
      ? Math.round((hitPredictions / evaluatedCount) * 100) 
      : 0;
    
    return {
      totalPredictions,
      pendingPredictions,
      hitPredictions,
      missPredictions,
      evaluatedCount,
      overallAccuracy,
      recentPredictions,
      byLeague: byLeague.sort((a, b) => b.total - a.total).slice(0, 10),
      bySport: bySport.sort((a, b) => b.total - a.total),
    };
  } catch (error) {
    console.error('Error fetching AI prediction stats:', error);
    return {
      totalPredictions: 0,
      pendingPredictions: 0,
      hitPredictions: 0,
      missPredictions: 0,
      evaluatedCount: 0,
      overallAccuracy: 0,
      recentPredictions: [],
      byLeague: [],
      bySport: [],
    };
  }
}
