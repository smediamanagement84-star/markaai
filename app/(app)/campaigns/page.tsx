import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import type { Campaign } from '@/lib/types/database'
import { getMockData } from '@/lib/mock-data'

export const metadata: Metadata = { title: 'Campaigns' }

const STATUS_COLORS: Record<string, string> = {
  research:          'badge-gray',
  planning:          'badge-gray',
  skeleton:          'badge-gold',
  awaiting_approval: 'badge-gold',
  producing:         'badge-accent',
  scheduled:         'badge-accent',
  active:            'badge-green',
  completed:         'badge-gray',
  paused:            'badge-gray',
}

const STATUS_ORDER = ['active','producing','scheduled','awaiting_approval','skeleton','planning','research','paused','completed']

export default async function CampaignsPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  let campaigns: any[] | null = null

  if (isDevMode) {
    // Use mock data in dev mode
    campaigns = getMockData('campaigns')
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: ws } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id)
      .limit(1)
      .single()

    if (!ws) redirect('/onboarding')

    const { data: campaignsData } = await supabase
      .from('campaigns')
      .select('*')
      .eq('workspace_id', ws.id)
      .order('created_at', { ascending: false })

    campaigns = campaignsData
  }

  // Group by status
  const grouped = STATUS_ORDER.reduce<Record<string, Campaign[]>>((acc, s) => {
    const items = (campaigns as Campaign[] ?? []).filter(c => c.status === s)
    if (items.length) acc[s] = items
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Campaigns</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
            {campaigns?.length ?? 0} total campaigns
          </p>
        </div>
        <a href="/campaigns/new" className="btn btn-primary">🚀 New Campaign</a>
      </div>

      {/* Empty state */}
      {!campaigns || campaigns.length === 0 ? (
        <div className="card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '64px 24px', gap: 14,
        }}>
          <div style={{ fontSize: 48 }}>🚀</div>
          <h2 style={{ fontSize: 18 }}>No campaigns yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center', maxWidth: 380 }}>
            Launch a campaign and MarkaAI will plan a full content funnel for you.
          </p>
          <a href="/campaigns/new" className="btn btn-primary" style={{ marginTop: 4 }}>
            Launch First Campaign
          </a>
        </div>
      ) : (
        /* Kanban board */
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div style={{ display: 'flex', gap: 16, minWidth: 'max-content' }}>
            {Object.entries(grouped).map(([status, items]) => (
              <div key={status} className="kanban-col">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'capitalize' }}>
                    {status.replace('_', ' ')}
                  </span>
                  <span className={`badge ${STATUS_COLORS[status] ?? 'badge-gray'}`}>{items.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map(c => (
                    <a key={c.id} href={`/campaigns/${c.id}`} style={{ textDecoration: 'none' }}>
                      <div className="kanban-card">
                        <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 6, color: 'var(--text)' }}>
                          {c.name}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                          {c.promotion_subject}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          {c.platforms.slice(0, 3).map(p => (
                            <span key={p} className="px-chip" style={{ fontSize: 11, padding: '2px 7px' }}>
                              {p}
                            </span>
                          ))}
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            {c.duration_days}d
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
