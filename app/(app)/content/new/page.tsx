'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { GeneratePostInput, GeneratedPost } from '@/lib/ai/generate-post'

const PLATFORMS = ['facebook', 'instagram', 'tiktok', 'youtube', 'google_business']
const POST_TYPES: Record<string, string[]> = {
  facebook:         ['feed_post', 'reel', 'story'],
  instagram:        ['feed_post', 'reel', 'carousel', 'story'],
  tiktok:           ['reel'],
  youtube:          ['short'],
  google_business:  ['gbp_post'],
}
const FUNNEL_STAGES = ['awareness', 'engagement', 'conversion', 'social_proof']
const LANGUAGES    = ['english', 'nepali', 'both']
const TONES        = ['professional', 'casual', 'fun', 'luxury', 'community']

function scoreColor(s: number) {
  if (s >= 75) return 'var(--green)'
  if (s >= 50) return 'var(--gold)'
  return 'var(--red)'
}

export default function NewPostPage() {
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [platform, setPlatform]     = useState('instagram')
  const [postType, setPostType]     = useState('feed_post')
  const [funnel, setFunnel]         = useState('awareness')
  const [language, setLanguage]     = useState<'english'|'nepali'|'both'>('english')
  const [tone, setTone]             = useState('professional')
  const [topic, setTopic]           = useState('')

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [result, setResult]         = useState<GeneratedPost | null>(null)
  const [genError, setGenError]     = useState('')

  // Save state
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)

  async function handleGenerate() {
    if (!topic.trim()) return
    setGenerating(true)
    setGenError('')
    setResult(null)

    try {
      const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
      let businessType = 'Business'
      let businessDescription = ''

      if (!isDevMode) {
        // Get business profile for context
        const { data: { user } } = await supabase.auth.getUser()
        const { data: ws } = await supabase
          .from('workspaces')
          .select('*')
          .eq('owner_id', user!.id)
          .limit(1)
          .single()

        if (ws) {
          const { data: bp } = await supabase
            .from('business_profiles')
            .select('business_type, business_description')
            .eq('workspace_id', ws.id)
            .single()
          if (bp) {
            businessType = bp.business_type
            businessDescription = bp.business_description ?? ''
          }
        }
      } else {
        businessType = 'Coffee Shop'
        businessDescription = 'Himalayan Coffee House - Premium coffee in Kathmandu'
      }

      const input: GeneratePostInput = {
        businessType,
        businessDescription,
        platform,
        postType,
        funnelStage: funnel,
        topic,
        tone,
        language,
        hashtags: true,
        visualDirection: true,
      }

      const res = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!res.ok) throw new Error('Generation failed')
      const data: GeneratedPost = await res.json()
      setResult(data)
    } catch (e: unknown) {
      setGenError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!result) return
    setSaving(true)

    try {
      const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

      if (isDevMode) {
        // Simulate save in dev mode
        await new Promise(resolve => setTimeout(resolve, 500))
        setSaved(true)
        setTimeout(() => router.push('/content'), 1000)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      const { data: ws } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', user!.id)
        .limit(1)
        .single()

      if (!ws) throw new Error('No workspace found')

      const { error: insertErr } = await supabase.from('posts').insert({
        workspace_id: ws.id,
        platform: platform as 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'google_business' | 'story',
        post_type: postType as 'feed_post' | 'reel' | 'carousel' | 'story' | 'short' | 'gbp_post' | 'broadcast',
        funnel_stage: funnel as 'awareness' | 'engagement' | 'conversion' | 'social_proof',
        caption: result.caption,
        caption_nepali: result.captionNepali ?? null,
        hashtags: result.hashtags,
        visual_direction: result.visualDirection,
        marka_score: result.markaScore,
        score_flags: result.scoreFlags as unknown as Record<string, unknown>,
        status: 'draft',
      })

      if (insertErr) throw insertErr

      setSaved(true)
      setTimeout(() => router.push('/content'), 1000)
    } catch (e: unknown) {
      setGenError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 760 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm">← Back</button>
        <div>
          <h1 style={{ fontSize: 22 }}>Generate New Post</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>AI-powered content tailored to your brand</p>
        </div>
      </div>

      {/* Form card */}
      <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Platform */}
        <div className="field">
          <label className="label">Platform</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => { setPlatform(p); setPostType(POST_TYPES[p][0]) }}
                className="btn btn-sm"
                style={{
                  background: platform === p ? 'rgba(79,94,247,0.15)' : 'var(--bg-input)',
                  border: `1px solid ${platform === p ? 'rgba(79,94,247,0.5)' : 'var(--border)'}`,
                  color: platform === p ? '#818cf8' : 'var(--text-dim)',
                  textTransform: 'capitalize',
                }}
              >
                {p.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Post type + Funnel row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field">
            <label className="label" htmlFor="post-type">Post Type</label>
            <select
              id="post-type"
              className="input"
              value={postType}
              onChange={e => setPostType(e.target.value)}
              style={{ background: 'var(--bg-input)', cursor: 'pointer' }}
            >
              {(POST_TYPES[platform] ?? []).map(pt => (
                <option key={pt} value={pt}>{pt.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label" htmlFor="funnel">Funnel Stage</label>
            <select
              id="funnel"
              className="input"
              value={funnel}
              onChange={e => setFunnel(e.target.value)}
              style={{ background: 'var(--bg-input)', cursor: 'pointer' }}
            >
              {FUNNEL_STAGES.map(f => (
                <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tone + Language row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field">
            <label className="label" htmlFor="tone">Brand Tone</label>
            <select
              id="tone"
              className="input"
              value={tone}
              onChange={e => setTone(e.target.value)}
              style={{ background: 'var(--bg-input)', cursor: 'pointer' }}
            >
              {TONES.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label" htmlFor="language">Language</label>
            <select
              id="language"
              className="input"
              value={language}
              onChange={e => setLanguage(e.target.value as 'english'|'nepali'|'both')}
              style={{ background: 'var(--bg-input)', cursor: 'pointer' }}
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Topic */}
        <div className="field">
          <label className="label" htmlFor="topic">What are you promoting?</label>
          <textarea
            id="topic"
            className="input"
            rows={3}
            placeholder="e.g. 30% off Dashain travel packages for Pokhara — book now, travel Oct 12-22"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </div>

        {genError && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 'var(--radius)',
            padding: '10px 14px',
            color: 'var(--red)',
            fontSize: 13,
          }}>
            {genError}
          </div>
        )}

        <button
          id="generate-btn"
          onClick={handleGenerate}
          disabled={generating || !topic.trim()}
          className="btn btn-primary btn-lg"
          style={{ alignSelf: 'flex-start' }}
        >
          {generating ? (
            <><span className="spinner" /> Generating…</>
          ) : (
            '✨ Generate Post'
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="card animate-fade-up" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 17 }}>Generated Post</h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius)',
              padding: '8px 14px',
            }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>MARKA SCORE</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: scoreColor(result.markaScore) }}>
                {result.markaScore}
              </span>
            </div>
          </div>

          {/* Caption */}
          <div className="field">
            <label className="label">Caption</label>
            <textarea
              className="input"
              rows={6}
              value={result.caption}
              onChange={e => setResult({ ...result, caption: e.target.value })}
            />
          </div>

          {result.captionNepali && (
            <div className="field">
              <label className="label">Caption (Nepali)</label>
              <textarea
                className="input"
                rows={5}
                value={result.captionNepali}
                onChange={e => setResult({ ...result, captionNepali: e.target.value })}
              />
            </div>
          )}

          {/* Hashtags */}
          <div className="field">
            <label className="label">Hashtags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {result.hashtags.map(tag => (
                <span key={tag} className="badge badge-accent">#{tag}</span>
              ))}
            </div>
          </div>

          {/* Visual direction */}
          <div className="field">
            <label className="label">Visual Direction</label>
            <p style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '10px 12px',
              fontSize: 13.5,
              color: 'var(--text-dim)',
              lineHeight: 1.6,
            }}>
              {result.visualDirection}
            </p>
          </div>

          {/* Score flags */}
          {result.scoreFlags.length > 0 && (
            <div className="field">
              <label className="label">AI Feedback</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.scoreFlags.map((flag, i) => (
                  <p key={i} style={{ fontSize: 13, color: 'var(--text-dim)', display: 'flex', gap: 8 }}>
                    <span>{i === 0 ? '✅' : '💡'}</span>
                    {flag}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              id="save-post-btn"
              className="btn btn-primary"
            >
              {saved ? '✅ Saved!' : saving ? <><span className="spinner" /> Saving…</> : '💾 Save as Draft'}
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn btn-secondary"
            >
              🔄 Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
