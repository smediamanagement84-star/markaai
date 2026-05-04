import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getMockData } from '@/lib/mock-data'

export const metadata: Metadata = { title: 'Leads' }

const STAGE_CONFIG: Record<string, { badge: string; label: string }> = {
  new:       { badge: 'badge-accent', label: 'New' },
  contacted: { badge: 'badge-gold',   label: 'Contacted' },
  qualified: { badge: 'badge-green',  label: 'Qualified' },
  converted: { badge: 'badge-green',  label: 'Converted' },
  lost:      { badge: 'badge-red',    label: 'Lost' },
}

export default async function LeadsPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  let leads: any[] | null = null

  if (isDevMode) {
    // Use mock data in dev mode
    leads = getMockData('leads')
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

    const { data: leadsData } = await supabase
      .from('leads')
      .select('*')
      .eq('workspace_id', ws.id)
      .order('created_at', { ascending: false })
      .limit(100)

    leads = leadsData
  }

  const newCount       = leads?.filter(l => l.stage === 'new').length ?? 0
  const convertedCount = leads?.filter(l => l.stage === 'converted').length ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Leads</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
            {leads?.length ?? 0} total · {newCount} new · {convertedCount} converted
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/leads/forms" className="btn btn-secondary btn-sm">📋 Lead Forms</a>
          <button className="btn btn-primary btn-sm">+ Manual Lead</button>
        </div>
      </div>

      {/* Empty */}
      {!leads || leads.length === 0 ? (
        <div className="card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '64px 24px', gap: 14,
        }}>
          <div style={{ fontSize: 48 }}>🎯</div>
          <h2 style={{ fontSize: 18 }}>No leads yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center', maxWidth: 380 }}>
            Leads are captured from your posts, DMs, and lead forms. Connect accounts to start capturing.
          </p>
          <a href="/settings#connect" className="btn btn-primary" style={{ marginTop: 4 }}>
            Connect Accounts
          </a>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Stage</th>
                <th>Source</th>
                <th>Urgency</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const cfg = STAGE_CONFIG[lead.stage] ?? STAGE_CONFIG.new
                return (
                  <tr key={lead.id}>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                        {lead.name ?? 'Unknown'}
                      </p>
                      {lead.notes && (
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lead.notes.slice(0, 60)}</p>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {lead.phone && <span style={{ fontSize: 13 }}>📱 {lead.phone}</span>}
                        {lead.email && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>✉️ {lead.email}</span>}
                        {!lead.phone && !lead.email && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                      </div>
                    </td>
                    <td><span className={`badge ${cfg.badge}`}>{cfg.label}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {lead.source_type?.replace('_', ' ') ?? '—'}
                      {lead.source_platform && ` · ${lead.source_platform}`}
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: (lead.urgency_score ?? 0) >= 7 ? 'var(--red)' : (lead.urgency_score ?? 0) >= 4 ? 'var(--gold)' : 'var(--text-muted)',
                      }}>
                        {lead.urgency_score ?? '—'}/10
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
