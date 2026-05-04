import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import type { Post } from '@/lib/types/database'
import { getMockData } from '@/lib/mock-data'

export const metadata: Metadata = { title: 'Content Studio' }

const STATUS_COLORS: Record<string, string> = {
  draft:             'badge-gray',
  awaiting_approval: 'badge-gold',
  approved:          'badge-accent',
  scheduled:         'badge-accent',
  published:         'badge-green',
  failed:            'badge-red',
  paused:            'badge-gray',
  cancelled:         'badge-gray',
}

const PLATFORM_EMOJI: Record<string, string> = {
  facebook:         '📘',
  instagram:        '📸',
  tiktok:           '🎵',
  youtube:          '▶️',
  google_business:  '🔍',
  story:            '⭕',
}

function scoreColor(s: number | null) {
  if (!s) return 'var(--text-muted)'
  if (s >= 75) return 'var(--green)'
  if (s >= 50) return 'var(--gold)'
  return 'var(--red)'
}

export default async function ContentPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  let posts: any[] | null = null

  if (isDevMode) {
    // Use mock data in dev mode
    posts = getMockData('posts')
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

    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('workspace_id', ws.id)
      .order('created_at', { ascending: false })
      .limit(50)

    posts = postsData
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Content Studio</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
            {posts?.length ?? 0} posts · AI-generated captions, Marka Scores, scheduling
          </p>
        </div>
        <a href="/content/new" id="new-post-btn" className="btn btn-primary">
          ✍️ &nbsp;New Post
        </a>
      </div>

      {/* Posts */}
      {!posts || posts.length === 0 ? (
        <div className="card" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          gap: 14,
        }}>
          <div style={{ fontSize: 48 }}>✍️</div>
          <h2 style={{ fontSize: 18 }}>Start creating content</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center', maxWidth: 380 }}>
            Generate your first AI-powered post. MarkaAI scores each caption with a Marka Score to predict performance.
          </p>
          <a href="/content/new" className="btn btn-primary" style={{ marginTop: 4 }}>
            ✨ Generate First Post
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(posts as Post[]).map((post, i) => (
            <div
              key={post.id}
              className="card"
              style={{
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                animationDelay: `${i * 40}ms`,
              }}
            >
              {/* Platform icon */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--bg-input)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}>
                {PLATFORM_EMOJI[post.platform] ?? '📱'}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {post.platform.replace('_', ' ')} · {post.post_type?.replace('_', ' ')}
                  </span>
                  <span className={`badge ${STATUS_COLORS[post.status] ?? 'badge-gray'}`}>
                    {post.status.replace('_', ' ')}
                  </span>
                  {post.funnel_stage && (
                    <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                      {post.funnel_stage}
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: 13.5,
                  color: 'var(--text)',
                  lineHeight: 1.55,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {post.caption}
                </p>
                {post.scheduled_at && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                    📅 Scheduled: {new Date(post.scheduled_at).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Marka Score */}
              {post.marka_score !== null && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: scoreColor(post.marka_score),
                  }}>
                    {post.marka_score}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    score
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
