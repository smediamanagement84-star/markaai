import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getMockData } from '@/lib/mock-data'
import { QuickActionCard } from './QuickActionCard'

export const metadata: Metadata = { title: 'Dashboard' }

// Helper to produce greeting based on time
function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const STAT_CARDS = [
  { label: 'Posts this month',   value: '0', delta: null, icon: '📝', color: 'var(--accent)' },
  { label: 'Avg. Marka Score',   value: '—', delta: null, icon: '⭐', color: 'var(--gold)' },
  { label: 'Leads captured',     value: '0', delta: null, icon: '🎯', color: 'var(--green)' },
  { label: 'Active campaigns',   value: '0', delta: null, icon: '🚀', color: '#c084fc' },
]

const QUICK_ACTIONS = [
  { label: 'Create new post',     href: '/content/new',   icon: '✍️', desc: 'AI-powered caption + hashtags' },
  { label: 'Launch campaign',     href: '/campaigns/new', icon: '🚀', desc: 'Full funnel in minutes' },
  { label: 'Check inbox',          href: '/inbox',         icon: '💬', desc: 'Replies & DMs pending' },
  { label: 'View analytics',      href: '/analytics',     icon: '📊', desc: 'Engagement & reach stats' },
]

export default async function DashboardPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

  let user, profile, workspace, postCount, leadCount, campaignCount

  if (isDevMode) {
    // Use mock data in development mode
    user = getMockData('user') as any
    profile = getMockData('profile') as any
    workspace = { id: 'mock-workspace-001', name: 'Himalayan Coffee House', owner_id: user.id }
    const campaigns = getMockData('campaigns') as any[]
    const posts = getMockData('posts') as any[]
    const leads = getMockData('leads') as any[]
    postCount = posts.length
    leadCount = leads.length
    campaignCount = campaigns.filter((c: any) => ['active', 'scheduled'].includes(c.status)).length
  } else {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) redirect('/login')
    user = authUser

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = profileData

    const { data: workspaces } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id)
      .limit(1)

    workspace = workspaces?.[0]

    // If no workspace yet, redirect to onboarding
    if (!workspace) redirect('/onboarding')

    const { count: pc } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id)
    postCount = pc

    const { count: lc } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id)
    leadCount = lc

    const { count: cc } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id)
      .in('status', ['active', 'producing', 'scheduled'])
    campaignCount = cc
  }

  const stats = [
    { ...STAT_CARDS[0], value: String(postCount ?? 0) },
    { ...STAT_CARDS[1], value: isDevMode ? '84' : '—' },
    { ...STAT_CARDS[2], value: String(leadCount ?? 0) },
    { ...STAT_CARDS[3], value: String(campaignCount ?? 0) },
  ]

  const firstName = profile?.business_name?.split(' ')[0] || profile?.full_name?.split(' ')[0] || 'there'

  // Trial info
  const isTrialing = isDevMode ? true : profile?.subscription_tier === 'trial'
  const trialDaysLeft = isDevMode ? 5 : profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86_400_000))
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>
            {greeting()}, {firstName} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {workspace.name} · Here&apos;s your marketing overview
          </p>
        </div>
        <a href="/content/new" className="btn btn-primary">
          ✍️ &nbsp;New Post
        </a>
      </div>

      {/* Trial banner */}
      {isTrialing && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(79,94,247,0.12), rgba(192,132,252,0.08))',
          border: '1px solid rgba(79,94,247,0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
              ⏳ Trial: <span style={{ color: '#818cf8' }}>{trialDaysLeft} days remaining</span>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Upgrade to unlock unlimited AI generations and full analytics.</p>
          </div>
          <a href="/billing" className="btn btn-primary btn-sm">Upgrade Now</a>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stat-label">{s.label}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {QUICK_ACTIONS.map(action => (
            <QuickActionCard key={action.href} {...action} />
          ))}
        </div>
      </div>

      {/* Recent posts placeholder */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Posts</h2>
          <a href="/content" className="btn btn-ghost btn-sm">View all →</a>
        </div>
        {postCount === 0 ? (
          <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            gap: 12,
          }}>
            <div style={{ fontSize: 40 }}>✍️</div>
            <p style={{ fontWeight: 600, fontSize: 15 }}>No posts yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center' }}>
              Create your first AI-generated post to get started
            </p>
            <a href="/content/new" className="btn btn-primary" style={{ marginTop: 4 }}>
              Generate First Post
            </a>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <p style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: 13.5 }}>
              Posts will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
