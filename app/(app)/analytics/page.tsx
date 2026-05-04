import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import type { Workspace } from '@/lib/types/database'
import { getMockData } from '@/lib/mock-data'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  let snapshots: any[] | null = null
  let topPosts: any[] | null = null
  let latestByPlatform: any[] = []

  if (isDevMode) {
    // Use mock data in dev mode
    snapshots = getMockData('analytics')
    const posts = getMockData('posts')
    topPosts = posts
      .filter((p: any) => p.marka_score !== null)
      .sort((a: any, b: any) => (b.marka_score || 0) - (a.marka_score || 0))
      .slice(0, 5)

    // Aggregate per platform
    const platforms = [...new Set(snapshots?.map(s => s.platform) ?? [])]
    latestByPlatform = platforms.map(p => {
      const latest = snapshots?.find(s => s.platform === p)
      const prev   = snapshots?.filter(s => s.platform === p)[1]
      return { platform: p, latest, prev }
    })
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: workspaces } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id)
      .limit(1)

    const ws = workspaces?.[0] as Workspace | undefined
    if (!ws) redirect('/onboarding')

    // Last 7 analytics snapshots
    const { data: snapshotsData } = await supabase
      .from('analytics_snapshots')
      .select('*')
      .eq('workspace_id', ws.id)
      .order('snapshot_date', { ascending: false })
      .limit(14)

    snapshots = snapshotsData

    // Aggregate per platform
    const platforms = [...new Set(snapshots?.map(s => s.platform) ?? [])]
    latestByPlatform = platforms.map(p => {
      const latest = snapshots?.find(s => s.platform === p)
      const prev   = snapshots?.filter(s => s.platform === p)[1]
      return { platform: p, latest, prev }
    })

    // Top posts by marka score
    const { data: topPostsData } = await supabase
      .from('posts')
      .select('id, caption, platform, marka_score, status, created_at')
      .eq('workspace_id', ws.id)
      .not('marka_score', 'is', null)
      .order('marka_score', { ascending: false })
      .limit(5)

    topPosts = topPostsData
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
          Account snapshots, engagement trends, and top-performing content
        </p>
      </div>

      {/* Platform stats */}
      {latestByPlatform.length > 0 ? (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Platform Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {latestByPlatform.map(({ platform, latest, prev }) => {
              const followerDelta = latest && prev && latest.followers && prev.followers
                ? latest.followers - prev.followers
                : null

              return (
                <div key={platform} className="stat-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="stat-label" style={{ textTransform: 'capitalize' }}>{platform.replace('_', ' ')}</span>
                    {followerDelta !== null && (
                      <span className={`stat-delta ${followerDelta >= 0 ? 'delta-up' : 'delta-down'}`}>
                        {followerDelta >= 0 ? '↑' : '↓'} {Math.abs(followerDelta)}
                      </span>
                    )}
                  </div>
                  <div className="stat-value">
                    {latest?.followers?.toLocaleString() ?? '—'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                    <div>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Reach</p>
                      <p style={{ fontWeight: 700, fontSize: 13 }}>{latest?.reach?.toLocaleString() ?? '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Engagement</p>
                      <p style={{ fontWeight: 700, fontSize: 13 }}>
                        {latest?.engagement_rate != null ? `${latest.engagement_rate}%` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '48px 24px', gap: 12,
        }}>
          <div style={{ fontSize: 40 }}>📊</div>
          <h2 style={{ fontSize: 16 }}>No analytics data yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center' }}>
            Connect your social accounts and data will sync automatically.
          </p>
          <a href="/settings#connect" className="btn btn-primary" style={{ marginTop: 4 }}>Connect Accounts</a>
        </div>
      )}

      {/* Top posts by Marka Score */}
      {topPosts && topPosts.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Top Posts by Marka Score</h2>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Caption</th>
                  <th>Platform</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topPosts.map(post => (
                  <tr key={post.id}>
                    <td style={{ maxWidth: 400 }}>
                      <p style={{
                        fontSize: 13.5,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {post.caption}
                      </p>
                    </td>
                    <td style={{ textTransform: 'capitalize', fontSize: 13 }}>
                      {post.platform}
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: (post.marka_score ?? 0) >= 75 ? 'var(--green)' : (post.marka_score ?? 0) >= 50 ? 'var(--gold)' : 'var(--red)',
                      }}>
                        {post.marka_score}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
