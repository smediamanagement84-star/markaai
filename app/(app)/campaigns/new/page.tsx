'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const PLATFORMS = ['facebook', 'instagram', 'tiktok', 'youtube', 'google_business']
const BUDGET_TYPES = ['organic', 'boosted', 'paid']

export default function NewCampaignPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [detail, setDetail] = useState('')
  const [duration, setDuration] = useState(7)
  const [platforms, setPlatforms] = useState<string[]>(['facebook', 'instagram'])
  const [budgetType, setBudgetType] = useState('organic')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function togglePlatform(p: string) {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  async function handleLaunch() {
    if (!name || !subject || platforms.length === 0) {
      setError('Please fill in all required fields.')
      return
    }
    setSaving(true)
    setError('')

    try {
      const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

      if (isDevMode) {
        // Simulate save in dev mode
        await new Promise(resolve => setTimeout(resolve, 800))
        router.push('/campaigns')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      const { data: ws } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_id', user!.id)
        .single()

      if (!ws) throw new Error('No workspace found')

      const { error: insErr } = await supabase.from('campaigns').insert({
        workspace_id: ws.id,
        name,
        promotion_subject: subject,
        promotion_detail: detail,
        duration_days: duration,
        platforms,
        ad_budget_type: budgetType as 'organic' | 'boosted' | 'paid',
        status: 'research'
      })

      if (insErr) throw insErr

      router.push('/campaigns')
      router.refresh()
    } catch (e: any) {
      setError(e.message || 'Failed to launch campaign')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm">← Back</button>
        <h1 style={{ fontSize: 24, marginTop: 12 }}>Launch New Campaign</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>AI will research and plan your full content funnel.</p>
      </div>

      <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="field">
          <label className="label">Campaign Name</label>
          <input 
            className="input" 
            placeholder="e.g. Dashain 2083 Festive Sale" 
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">What are you promoting?</label>
          <input 
            className="input" 
            placeholder="e.g. 30% off travel packages to Pokhara" 
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Additional Details (Optional)</label>
          <textarea 
            className="input" 
            rows={3} 
            placeholder="Key features, target USP, or specific dates..." 
            value={detail}
            onChange={e => setDetail(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field">
            <label className="label">Duration (Days)</label>
            <input 
              type="number" 
              className="input" 
              value={duration} 
              onChange={e => setDuration(parseInt(e.target.value) || 7)}
            />
          </div>
          <div className="field">
            <label className="label">Budget Type</label>
            <select className="input" value={budgetType} onChange={e => setBudgetType(e.target.value)}>
              {BUDGET_TYPES.map(b => <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="label">Select Platforms</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className="btn btn-sm"
                style={{
                  background: platforms.includes(p) ? 'rgba(79,94,247,0.15)' : 'var(--bg-input)',
                  border: `1px solid ${platforms.includes(p) ? 'rgba(79,94,247,0.5)' : 'var(--border)'}`,
                  color: platforms.includes(p) ? '#818cf8' : 'var(--text-dim)',
                  textTransform: 'capitalize'
                }}
              >
                {p.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--red)', fontSize: 13, background: 'rgba(239,68,68,0.1)', padding: '10px 14px', borderRadius: 'var(--radius)' }}>
            {error}
          </div>
        )}

        <button 
          onClick={handleLaunch} 
          disabled={saving} 
          className="btn btn-primary" 
          style={{ alignSelf: 'flex-start', marginTop: 10 }}
        >
          {saving ? 'Launching...' : '🚀 Launch Campaign Strategy'}
        </button>
      </div>
    </div>
  )
}
