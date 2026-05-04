import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Influencer Discovery' }

export default async function InfluencersPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  let influencers: any[] | null = null

  if (isDevMode) {
    // Empty mock data for influencers in dev mode
    influencers = []
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: ws } = await supabase.from('workspaces').select('*').eq('owner_id', user.id).limit(1).single()
    if (!ws) redirect('/onboarding')

    const { data: influencersData } = await supabase
      .from('influencer_discoveries')
      .select('*')
      .eq('workspace_id', ws.id)
      .order('brand_fit_score', { ascending: false })
      .limit(50)

    influencers = influencersData
  }

  const STATUS_BADGE: Record<string, string> = {
    discovered: 'badge-gray',
    messaged:   'badge-accent',
    responded:  'badge-gold',
    agreed:     'badge-green',
    declined:   'badge-red',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Influencer Discovery</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
            {influencers?.length ?? 0} creators found · sorted by brand fit score
          </p>
        </div>
        <button className="btn btn-primary">🔍 Discover Creators</button>
      </div>

      {!influencers || influencers.length === 0 ? (
        <div className="card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '64px 24px', gap: 14,
        }}>
          <div style={{ fontSize: 48 }}>⭐</div>
          <h2 style={{ fontSize: 18 }}>No influencers yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center', maxWidth: 380 }}>
            Use AI to discover Nepali creators that fit your brand — and track your outreach in one place.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 4 }}>Discover Creators</button>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Creator</th>
                <th>Platform</th>
                <th>Followers</th>
                <th>Eng. Rate</th>
                <th>Brand Fit</th>
                <th>Outreach</th>
              </tr>
            </thead>
            <tbody>
              {influencers.map(inf => (
                <tr key={inf.id}>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: 13.5 }}>{inf.creator_name ?? '—'}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{inf.creator_handle ?? '—'}</p>
                  </td>
                  <td style={{ textTransform: 'capitalize', fontSize: 13 }}>{inf.platform ?? '—'}</td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{inf.follower_count?.toLocaleString() ?? '—'}</td>
                  <td style={{ fontSize: 13 }}>{inf.engagement_rate != null ? `${inf.engagement_rate}%` : '—'}</td>
                  <td>
                    <span style={{
                      fontWeight: 800,
                      fontSize: 14,
                      color: (inf.brand_fit_score ?? 0) >= 70 ? 'var(--green)' : (inf.brand_fit_score ?? 0) >= 40 ? 'var(--gold)' : 'var(--red)',
                    }}>
                      {inf.brand_fit_score ?? '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[inf.outreach_status] ?? 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>
                      {inf.outreach_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
