import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getMockData } from '@/lib/mock-data'

export const metadata: Metadata = { title: 'Inbox' }

const SENTIMENT_CONFIG: Record<string, { label: string; badge: string; emoji: string }> = {
  lead:     { label: 'Lead',     badge: 'badge-green',  emoji: '🎯' },
  negative: { label: 'Negative', badge: 'badge-red',    emoji: '⚠️' },
  neutral:  { label: 'Neutral',  badge: 'badge-gray',   emoji: '💬' },
  spam:     { label: 'Spam',     badge: 'badge-gray',   emoji: '🚫' },
}

export default async function InboxPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  let messages: any[] | null = null

  if (isDevMode) {
    // Use mock data in dev mode
    messages = getMockData('messages') as any[]
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

    const { data: messagesData } = await supabase
      .from('inbox_messages')
      .select('*')
      .eq('workspace_id', ws.id)
      .eq('is_resolved', false)
      .order('urgency_score', { ascending: false })
      .limit(50)

    messages = messagesData
  }

  const leadCount    = messages?.filter(m => m.sentiment === 'lead').length ?? 0
  const negativeCount = messages?.filter(m => m.sentiment === 'negative').length ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Inbox</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
            {messages?.length ?? 0} unresolved messages
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {leadCount > 0 && <span className="badge badge-green">🎯 {leadCount} leads</span>}
          {negativeCount > 0 && <span className="badge badge-red">⚠️ {negativeCount} negative</span>}
        </div>
      </div>

      {/* Messages */}
      {!messages || messages.length === 0 ? (
        <div className="card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '64px 24px', gap: 14,
        }}>
          <div style={{ fontSize: 48 }}>💬</div>
          <h2 style={{ fontSize: 18 }}>Inbox is clear</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center' }}>
            Comments, DMs, and mentions will appear here once your accounts are connected.
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
                <th>Sender</th>
                <th>Message</th>
                <th>Sentiment</th>
                <th>Urgency</th>
                <th>Platform</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => {
                const cfg = SENTIMENT_CONFIG[msg.sentiment ?? 'neutral'] ?? SENTIMENT_CONFIG.neutral
                return (
                  <tr key={msg.id}>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                        {msg.sender_name ?? 'Unknown'}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {msg.message_type}
                      </p>
                    </td>
                    <td style={{ maxWidth: 300 }}>
                      <p style={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontSize: 13,
                      }}>
                        {msg.message_text ?? '—'}
                      </p>
                      {msg.ai_suggested_reply && (
                        <p style={{ fontSize: 11.5, color: '#818cf8', marginTop: 4 }}>
                          💡 AI reply ready
                        </p>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${cfg.badge}`}>
                        {cfg.emoji} {cfg.label}
                      </span>
                    </td>
                    <td>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontWeight: 700,
                        fontSize: 13,
                        color: (msg.urgency_score ?? 0) >= 7 ? 'var(--red)' : (msg.urgency_score ?? 0) >= 4 ? 'var(--gold)' : 'var(--text-muted)',
                      }}>
                        {msg.urgency_score ?? '—'}/10
                      </div>
                    </td>
                    <td style={{ textTransform: 'capitalize', fontSize: 13 }}>
                      {msg.platform}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(msg.received_at).toLocaleDateString()}
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
