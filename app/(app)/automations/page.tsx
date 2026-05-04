import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Automations' }

export default async function AutomationsPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  let flows: any[] | null = null

  if (isDevMode) {
    // Empty mock data for automations in dev mode
    flows = []
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: ws } = await supabase.from('workspaces').select('*').eq('owner_id', user.id).limit(1).single()
    if (!ws) redirect('/onboarding')

    const { data: flowsData } = await supabase
      .from('automation_flows')
      .select('*')
      .eq('workspace_id', ws.id)
      .order('created_at', { ascending: false })

    flows = flowsData
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Automations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
            Trigger WhatsApp / Viber messages on lead capture, DM keywords, or schedule
          </p>
        </div>
        <button className="btn btn-primary">+ New Flow</button>
      </div>

      {!flows || flows.length === 0 ? (
        <div className="card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '64px 24px', gap: 14,
        }}>
          <div style={{ fontSize: 48 }}>⚙️</div>
          <h2 style={{ fontSize: 18 }}>No automation flows yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center', maxWidth: 380 }}>
            Create flows to auto-reply to DMs, follow up with leads via WhatsApp, or send broadcasts.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 4 }}>Create First Flow</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {flows.map(flow => (
            <div key={flow.id} className="card" style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: flow.is_active ? 'rgba(16,185,129,0.12)' : 'var(--bg-input)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  {flow.channel === 'whatsapp' ? '💚' : flow.channel === 'viber' ? '💜' : '✉️'}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{flow.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {flow.trigger_type?.replace('_', ' ')} · {flow.channel} · {flow.total_triggered} triggered
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`badge ${flow.is_active ? 'badge-green' : 'badge-gray'}`}>
                  {flow.is_active ? 'Active' : 'Paused'}
                </span>
                <button className="btn btn-secondary btn-sm">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
