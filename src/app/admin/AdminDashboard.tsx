'use client';

import { useState } from 'react';

interface Stats {
  totalUsers: number;
  proUsers: number;
  premiumUsers: number;
  freeUsers: number;
  totalAnalyses: number;
  todayAnalyses: number;
  mrr: number;
}

interface RecentUser {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
  createdAt: Date;
  _count: { analyses: number };
}

interface RecentAnalysis {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  createdAt: Date;
  user: { name: string | null; email: string | null };
}

interface ChatQuery {
  id: string;
  query: string;
  category: string | null;
  brainMode: string | null;
  sport: string | null;
  team: string | null;
  usedRealTimeSearch: boolean;
  createdAt: Date;
}

interface ChatAnalytics {
  totalQueries: number;
  todayQueries: number;
  queriesWithSearch: number;
  queriesWithCitations: number;
  searchRate: number;
  topCategories: Array<{ category: string; count: number }>;
  topTeams: Array<{ team: string; count: number }>;
  recentQueries: ChatQuery[];
  agentPostsCount: number;
}

interface AdminDashboardProps {
  stats: Stats;
  recentUsers: RecentUser[];
  recentAnalyses: RecentAnalysis[];
  chatAnalytics?: ChatAnalytics;
}

type TabType = 'overview' | 'users' | 'analyses' | 'chat' | 'agent';

export default function AdminDashboard({ 
  stats, 
  recentUsers, 
  recentAnalyses,
  chatAnalytics 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary mt-1">SportBot AI analytics and management</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            icon={<UsersIcon />}
          />
          <StatCard
            label="MRR"
            value={`€${stats.mrr.toFixed(0)}`}
            icon={<MoneyIcon />}
            highlight
          />
          <StatCard
            label="Analyses"
            value={stats.totalAnalyses}
            icon={<ChartIcon />}
          />
          <StatCard
            label="Today"
            value={stats.todayAnalyses}
            icon={<TrendingIcon />}
          />
          <StatCard
            label="Chat Queries"
            value={chatAnalytics?.totalQueries || 0}
            icon={<ChatIcon />}
            color="blue"
          />
          <StatCard
            label="Agent Posts"
            value={chatAnalytics?.agentPostsCount || 0}
            icon={<BotIcon />}
            color="purple"
          />
        </div>

        {/* Subscription & Chat Stats Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Subscription Breakdown */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Subscriptions</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-bg-tertiary">
                <div className="text-2xl font-bold text-text-muted">{stats.freeUsers}</div>
                <div className="text-sm text-text-secondary">Free</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-2xl font-bold text-primary">{stats.proUsers}</div>
                <div className="text-sm text-text-secondary">Pro</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="text-2xl font-bold text-accent">{stats.premiumUsers}</div>
                <div className="text-sm text-text-secondary">Premium</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border-primary">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Conversion Rate</span>
                <span className="text-text-primary font-medium">
                  {stats.totalUsers > 0 
                    ? ((stats.proUsers + stats.premiumUsers) / stats.totalUsers * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Chat Performance */}
          {chatAnalytics && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Chat Performance</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">{chatAnalytics.todayQueries}</div>
                  <div className="text-sm text-text-secondary">Today&apos;s Queries</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">{chatAnalytics.searchRate}%</div>
                  <div className="text-sm text-text-secondary">Real-time Search</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-primary space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">With Citations</span>
                  <span className="text-text-primary font-medium">{chatAnalytics.queriesWithCitations}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Perplexity Calls</span>
                  <span className="text-text-primary font-medium">{chatAnalytics.queriesWithSearch}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            Overview
          </TabButton>
          <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
            Chat Analytics
          </TabButton>
          <TabButton active={activeTab === 'agent'} onClick={() => setActiveTab('agent')}>
            Agent Insights
          </TabButton>
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            Users
          </TabButton>
          <TabButton active={activeTab === 'analyses'} onClick={() => setActiveTab('analyses')}>
            Analyses
          </TabButton>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Users Preview */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Latest Users</h3>
              <div className="space-y-3">
                {recentUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-xs font-bold text-bg-primary">
                          {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">{user.name || 'Anonymous'}</div>
                        <div className="text-xs text-text-muted">{user.email}</div>
                      </div>
                    </div>
                    <PlanBadge plan={user.plan} />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Analyses Preview */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Latest Analyses</h3>
              <div className="space-y-3">
                {recentAnalyses.slice(0, 5).map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-text-primary">
                        {analysis.homeTeam} vs {analysis.awayTeam}
                      </div>
                      <div className="text-xs text-text-muted">
                        {analysis.sport} • {analysis.user.name || analysis.user.email}
                      </div>
                    </div>
                    <div className="text-xs text-text-secondary">
                      {formatTimeAgo(new Date(analysis.createdAt))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && chatAnalytics && (
          <div className="space-y-6">
            {/* Top Categories & Teams */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Categories */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Top Query Categories</h3>
                {chatAnalytics.topCategories.length > 0 ? (
                  <div className="space-y-3">
                    {chatAnalytics.topCategories.map((cat, i) => (
                      <div key={cat.category} className="flex items-center gap-3">
                        <span className="text-text-muted w-6">{i + 1}.</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-text-primary">{cat.category}</span>
                            <span className="text-sm text-text-muted">{cat.count}</span>
                          </div>
                          <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(cat.count / chatAnalytics.topCategories[0].count) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted text-sm">No data yet. Start asking questions!</p>
                )}
              </div>

              {/* Top Teams */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Most Asked Teams</h3>
                {chatAnalytics.topTeams.length > 0 ? (
                  <div className="space-y-3">
                    {chatAnalytics.topTeams.map((team, i) => (
                      <div key={team.team} className="flex items-center gap-3">
                        <span className="text-text-muted w-6">{i + 1}.</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-text-primary">{team.team}</span>
                            <span className="text-sm text-text-muted">{team.count}</span>
                          </div>
                          <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${(team.count / chatAnalytics.topTeams[0].count) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted text-sm">No team data yet.</p>
                )}
              </div>
            </div>

            {/* Recent Queries Table */}
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-border-primary">
                <h3 className="text-lg font-semibold text-text-primary">Recent Chat Queries</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg-tertiary">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Query</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Mode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Search</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-primary">
                    {chatAnalytics.recentQueries.map((q) => (
                      <tr key={q.id} className="hover:bg-bg-tertiary/50">
                        <td className="px-6 py-4">
                          <div className="text-sm text-text-primary max-w-xs truncate" title={q.query}>
                            {q.query}
                          </div>
                          {q.team && (
                            <div className="text-xs text-text-muted mt-1">Team: {q.team}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {q.category ? (
                            <CategoryBadge category={q.category} />
                          ) : (
                            <span className="text-text-muted">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {q.brainMode ? (
                            <ModeBadge mode={q.brainMode} />
                          ) : (
                            <span className="text-text-muted">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {q.usedRealTimeSearch ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-text-muted">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {formatTimeAgo(new Date(q.createdAt))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agent' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">SportBot Agent Insights</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-6 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="text-3xl font-bold text-purple-400">{chatAnalytics?.agentPostsCount || 0}</div>
                  <div className="text-sm text-text-secondary mt-1">Total Posts Generated</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-400">{chatAnalytics?.totalQueries || 0}</div>
                  <div className="text-sm text-text-secondary mt-1">Chat Conversations</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-3xl font-bold text-green-400">{chatAnalytics?.searchRate || 0}%</div>
                  <div className="text-sm text-text-secondary mt-1">Real-time Search Rate</div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Query Distribution</h3>
              <p className="text-text-muted text-sm mb-4">What users are asking about most:</p>
              {chatAnalytics?.topCategories && chatAnalytics.topCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {chatAnalytics.topCategories.map((cat) => (
                    <div 
                      key={cat.category}
                      className="px-4 py-2 rounded-full bg-bg-tertiary text-text-primary text-sm"
                    >
                      {cat.category} <span className="text-text-muted ml-1">({cat.count})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted">No category data yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-bg-tertiary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Analyses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-bg-tertiary/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{user.name || 'Anonymous'}</div>
                        <div className="text-xs text-text-muted">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <PlanBadge plan={user.plan} />
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {user._count.analyses}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {formatDate(new Date(user.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'analyses' && (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-bg-tertiary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Match</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Sport</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {recentAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-bg-tertiary/50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary">
                        {analysis.homeTeam} vs {analysis.awayTeam}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary capitalize">{analysis.sport}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {analysis.user.name || analysis.user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {formatTimeAgo(new Date(analysis.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Helper Components
// ============================================

function StatCard({ label, value, icon, highlight, color }: { 
  label: string; 
  value: string | number; 
  icon: React.ReactNode;
  highlight?: boolean;
  color?: 'blue' | 'purple' | 'green';
}) {
  const colorClasses = {
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
    green: 'border-green-500/30 bg-green-500/5 text-green-400',
  };
  
  const baseClass = highlight 
    ? 'border-accent/30 bg-accent/5' 
    : color 
      ? colorClasses[color]
      : '';

  return (
    <div className={`card p-4 ${baseClass}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={highlight ? 'text-accent' : color ? colorClasses[color].split(' ')[2] : 'text-text-muted'}>
          {icon}
        </span>
      </div>
      <div className={`text-2xl font-bold ${highlight ? 'text-accent' : color ? colorClasses[color].split(' ')[2] : 'text-text-primary'}`}>
        {value}
      </div>
      <div className="text-sm text-text-secondary">{label}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-accent text-bg-primary'
          : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    FREE: 'bg-text-muted/20 text-text-muted',
    PRO: 'bg-primary/20 text-primary',
    PREMIUM: 'bg-accent/20 text-accent',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[plan] || colors.FREE}`}>
      {plan}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-medium">
      {category}
    </span>
  );
}

function ModeBadge({ mode }: { mode: string }) {
  const colors: Record<string, string> = {
    agent: 'bg-purple-500/20 text-purple-400',
    data: 'bg-green-500/20 text-green-400',
    analysis: 'bg-yellow-500/20 text-yellow-400',
    post: 'bg-pink-500/20 text-pink-400',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[mode] || 'bg-gray-500/20 text-gray-400'}`}>
      {mode}
    </span>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ============================================
// Icons
// ============================================

function UsersIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
