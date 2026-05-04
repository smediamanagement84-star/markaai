import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getMockData } from '@/lib/mock-data'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  let user: any
  let profile: any
  let ws: any
  let bp: any = null
  let connected: any[] = []

  if (isDevMode) {
    // Use mock data in dev mode
    user = getMockData('user')
    profile = getMockData('profile')
    ws = { id: 'mock-workspace-001', name: 'Himalayan Coffee House', slug: 'himalayan-coffee', owner_id: user.id, white_label_enabled: false }
    bp = {
      workspace_id: ws.id,
      business_type: 'Coffee Shop',
      business_description: 'Premium coffee in Kathmandu',
      brand_tone: 'casual',
      content_language: 'both',
      lead_monthly_target: 50,
    }
    connected = [
      { platform: 'facebook', account_name: 'Himalayan Coffee House', is_active: true },
      { platform: 'instagram', account_name: '@himalayan_coffee', is_active: true },
    ]
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

    const { data: wsData } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id)
      .limit(1)
      .single()
    ws = wsData

    const { data: bpData } = ws
      ? await supabase
          .from('business_profiles')
          .select('*')
          .eq('workspace_id', ws.id)
          .single()
      : { data: null }
    bp = bpData

    const { data: connectedData } = ws
      ? await supabase
          .from('connected_accounts')
          .select('platform, account_name, is_active')
          .eq('workspace_id', ws.id)
      : { data: [] }
    connected = connectedData || []
  }

  const connectedPlatforms = new Set(connected?.map(c => c.platform) ?? [])

  const PLATFORMS = [
    { key: 'facebook',        label: 'Facebook',        emoji: '📘', desc: 'Page posts, comments, reach' },
    { key: 'instagram',       label: 'Instagram',       emoji: '📸', desc: 'Feed, Reels, DMs' },
    { key: 'tiktok',          label: 'TikTok',          emoji: '🎵', desc: 'Short-form video' },
    { key: 'youtube',         label: 'YouTube',         emoji: '▶️', desc: 'Shorts, analytics' },
    { key: 'google_business', label: 'Google Business', emoji: '🔍', desc: 'GBP posts, reviews' },
    { key: 'whatsapp',        label: 'WhatsApp',        emoji: '💚', desc: 'Broadcast messages' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 720 }}>
      <div>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
          Manage your profile, workspace, and connected accounts
        </p>
      </div>

      {/* Profile */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Profile</h2>
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f5ef7, #c084fc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 800,
              color: '#fff',
              flexShrink: 0,
            }}>
              {(profile?.full_name ?? user.email ?? '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15 }}>{profile?.full_name ?? 'No name set'}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user.email}</p>
            </div>
          </div>
          <hr className="divider" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p className="label">Subscription</p>
              <span className="badge badge-accent" style={{ textTransform: 'capitalize' }}>
                {profile?.subscription_tier ?? 'trial'}
              </span>
            </div>
            <div>
              <p className="label">Preferred Language</p>
              <span style={{ fontSize: 13, color: 'var(--text)', textTransform: 'capitalize' }}>
                {profile?.preferred_language ?? 'english'}
              </span>
            </div>
            <div>
              <p className="label">AI Generations Used</p>
              <span style={{ fontSize: 13, color: 'var(--text)' }}>
                {profile?.ai_generation_count ?? 0}
              </span>
            </div>
            <div>
              <p className="label">Timezone</p>
              <span style={{ fontSize: 13, color: 'var(--text)' }}>
                {profile?.timezone ?? 'Asia/Kathmandu'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace */}
      {ws && (
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Workspace</h2>
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15 }}>{ws.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>/{ws.slug}</p>
              </div>
              <span className={`badge ${ws.white_label_enabled ? 'badge-accent' : 'badge-gray'}`}>
                {ws.white_label_enabled ? 'White Label' : 'Standard'}
              </span>
            </div>
            {bp && (
              <>
                <hr className="divider" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <p className="label">Business Type</p>
                    <p style={{ fontSize: 13 }}>{bp.business_type}</p>
                  </div>
                  <div>
                    <p className="label">Brand Tone</p>
                    <p style={{ fontSize: 13, textTransform: 'capitalize' }}>{bp.brand_tone ?? '—'}</p>
                  </div>
                  <div>
                    <p className="label">Content Language</p>
                    <p style={{ fontSize: 13, textTransform: 'capitalize' }}>{bp.content_language}</p>
                  </div>
                  <div>
                    <p className="label">Lead Target / Month</p>
                    <p style={{ fontSize: 13 }}>{bp.lead_monthly_target}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Connected Accounts */}
      <section id="connect">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Connected Accounts</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PLATFORMS.map(p => {
            const isConnected = connectedPlatforms.has(p.key)
            return (
              <div key={p.key} className="card" style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{p.emoji}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13.5 }}>{p.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.desc}</p>
                  </div>
                </div>
                {isConnected ? (
                  <span className="badge badge-green">✓ Connected</span>
                ) : (
                  <button className="btn btn-secondary btn-sm">Connect</button>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
