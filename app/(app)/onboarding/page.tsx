'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  { id: 'workspace',  title: 'Name your workspace',     desc: 'This is your brand space in MarkaAI.' },
  { id: 'business',   title: 'Tell us about your business', desc: 'We use this to craft content that actually fits your brand.' },
  { id: 'platforms',  title: 'Which platforms are you on?', desc: 'Select all that apply.' },
  { id: 'tone',       title: 'What\'s your brand tone?', desc: 'This shapes how the AI speaks for you.' },
  { id: 'goal',       title: 'Primary goal',            desc: 'MarkaAI will optimize your strategy for this.' },
]

const PLATFORMS = ['facebook', 'instagram', 'tiktok', 'youtube', 'google_business']
const PLATFORM_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  google_business: 'Google Business',
}

const TONES = [
  { value: 'professional', label: 'Professional', emoji: '👔' },
  { value: 'casual',       label: 'Casual',       emoji: '😊' },
  { value: 'fun',          label: 'Fun & Bold',   emoji: '🎉' },
  { value: 'luxury',       label: 'Luxury',       emoji: '💎' },
  { value: 'community',    label: 'Community',    emoji: '🤝' },
]

const GOALS = [
  { value: 'awareness',    label: 'Build brand awareness',  emoji: '📢' },
  { value: 'leads',        label: 'Generate leads',         emoji: '🎯' },
  { value: 'engagement',   label: 'Grow engagement',        emoji: '💬' },
  { value: 'sales',        label: 'Drive direct sales',     emoji: '💰' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [workspaceName, setWorkspaceName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [businessDesc, setBusinessDesc] = useState('')
  const [platforms, setPlatforms] = useState<string[]>(['facebook', 'instagram'])
  const [tone, setTone] = useState('professional')
  const [goal, setGoal] = useState('leads')

  function togglePlatform(p: string) {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  async function handleFinish() {
    setSaving(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const slug = workspaceName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Math.random().toString(36).slice(2, 6)

      const { data: ws, error: wsErr } = await supabase
        .from('workspaces')
        .insert({ owner_id: user.id, name: workspaceName, slug })
        .select()
        .single()

      if (wsErr) throw wsErr

      const { error: bpErr } = await supabase
        .from('business_profiles')
        .insert({
          workspace_id: ws.id,
          business_type: businessType,
          business_description: businessDesc,
          active_platforms: platforms,
          brand_tone: tone as 'professional' | 'casual' | 'fun' | 'luxury' | 'community',
          business_goals: [goal],
        })

      if (bpErr) throw bpErr

      const { error: memberErr } = await supabase
        .from('workspace_members')
        .insert({ workspace_id: ws.id, user_id: user.id, role: 'owner' })

      if (memberErr) throw memberErr

      router.push('/dashboard')
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setSaving(false)
    }
  }

  const canNext = () => {
    if (step === 0) return workspaceName.trim().length > 1
    if (step === 1) return businessType.trim().length > 1
    if (step === 2) return platforms.length > 0
    return true
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: 60 }}>
      <div style={{ width: '100%', maxWidth: 540 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 6,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: 'linear-gradient(135deg, #4f5ef7, #c084fc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              color: '#fff',
            }}>M</div>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20 }}>
              MarkaAI
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Step {step + 1} of {STEPS.length} — Let&apos;s set up your workspace
          </p>
        </div>

        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: 28 }}>
          <div className="progress-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4f5ef7, #c084fc)' }} />
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '32px 36px' }}>
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>{STEPS[step].title}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginBottom: 24 }}>{STEPS[step].desc}</p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius)',
              padding: '10px 14px',
              color: 'var(--red)',
              fontSize: 13,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Step 0 — Workspace name */}
          {step === 0 && (
            <div className="field">
              <label className="label" htmlFor="workspace-name">Workspace Name</label>
              <input
                id="workspace-name"
                className="input"
                placeholder="e.g. Himalaya Boutique Travels"
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {/* Step 1 — Business */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label className="label" htmlFor="biz-type">Business Type</label>
                <input
                  id="biz-type"
                  className="input"
                  placeholder="e.g. Travel Agency, Restaurant, Real Estate"
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="biz-desc">Short Description (optional)</label>
                <textarea
                  id="biz-desc"
                  className="input"
                  rows={3}
                  placeholder="Briefly describe what makes your business unique..."
                  value={businessDesc}
                  onChange={e => setBusinessDesc(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2 — Platforms */}
          {step === 2 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className="btn"
                  style={{
                    background: platforms.includes(p) ? 'rgba(79,94,247,0.15)' : 'var(--bg-input)',
                    border: platforms.includes(p) ? '1px solid rgba(79,94,247,0.5)' : '1px solid var(--border)',
                    color: platforms.includes(p) ? '#818cf8' : 'var(--text-dim)',
                  }}
                >
                  {PLATFORM_LABELS[p]}
                </button>
              ))}
            </div>
          )}

          {/* Step 3 — Tone */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TONES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className="btn"
                  style={{
                    justifyContent: 'flex-start',
                    gap: 12,
                    height: 48,
                    background: tone === t.value ? 'rgba(79,94,247,0.12)' : 'var(--bg-input)',
                    border: tone === t.value ? '1px solid rgba(79,94,247,0.4)' : '1px solid var(--border)',
                    color: tone === t.value ? '#818cf8' : 'var(--text-dim)',
                    fontSize: 14,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Step 4 — Goal */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {GOALS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className="btn"
                  style={{
                    justifyContent: 'flex-start',
                    gap: 12,
                    height: 48,
                    background: goal === g.value ? 'rgba(79,94,247,0.12)' : 'var(--bg-input)',
                    border: goal === g.value ? '1px solid rgba(79,94,247,0.4)' : '1px solid var(--border)',
                    color: goal === g.value ? '#818cf8' : 'var(--text-dim)',
                    fontSize: 14,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{g.emoji}</span>
                  {g.label}
                </button>
              ))}
            </div>
          )}

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="btn btn-primary"
                style={{ flex: 2, background: 'linear-gradient(135deg, #4f5ef7, #c084fc)' }}
              >
                {saving ? <span className="spinner" /> : '🚀 Launch Workspace'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
