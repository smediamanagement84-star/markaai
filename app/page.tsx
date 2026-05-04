import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MarkaAI — Nepal\'s AI Social Media Partner',
  description: 'Generate campaigns, captions, and leads with AI built for Nepali businesses. Try free for 7 days.',
}

const FEATURES = [
  {
    emoji: '✍️',
    title: 'AI Content Studio',
    desc: 'Generate platform-specific captions, Reels scripts, and carousel copy in English or Nepali — scored by our Marka Score engine.',
  },
  {
    emoji: '🚀',
    title: 'Campaign Planner',
    desc: 'Describe your promotion and get a full multi-platform funnel: awareness → engagement → conversion posts in minutes.',
  },
  {
    emoji: '🎯',
    title: 'Lead Capture & CRM',
    desc: 'Spot leads in comments and DMs automatically. Track them through contacted, qualified, and converted stages.',
  },
  {
    emoji: '📊',
    title: 'Analytics Dashboard',
    desc: 'Track followers, reach, engagement, and Marka Scores across all platforms from one dashboard.',
  },
  {
    emoji: '💬',
    title: 'Smart Inbox',
    desc: 'AI classifies every comment and DM by sentiment, urgency, and lead potential — and suggests a reply.',
  },
  {
    emoji: '🇳🇵',
    title: 'Built for Nepal',
    desc: 'Festival calendar, Nepali/English bilingual content, eSewa & Khalti payments, and Dashain strategies built-in.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Bishal Thapa',
    biz: 'Himalayan Travel Co.',
    quote: 'We 3× our Instagram leads in the first month using MarkaAI campaigns. The Dashain strategy was ¡incredible!',
    avatar: 'B',
  },
  {
    name: 'Sunita Rai',
    biz: 'Café Kathmandu',
    quote: 'Finally an AI that writes in Nepali AND English and actually sounds like us. The Marka Score tells us what will perform before we post.',
    avatar: 'S',
  },
  {
    name: 'Rohan KC',
    biz: 'PropertiesNP',
    quote: 'Our team saves 20+ hours a week on content. The inbox AI catches leads we used to miss in the comments.',
    avatar: 'R',
  },
]

const PLANS = [
  { name: 'Starter',      price: '1,500', color: 'var(--accent)' },
  { name: 'Professional', price: '3,500', color: '#c084fc', popular: true },
  { name: 'Agency',       price: '8,000', color: 'var(--gold)' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(10,11,15,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 40px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #4f5ef7, #c084fc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 15,
            color: '#fff',
          }}>M</div>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px' }}>
            Marka<span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/login" className="btn btn-ghost">Sign In</Link>
          <Link href="/signup" className="btn btn-primary">Start Free Trial</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '100px 24px 80px',
        background: `
          radial-gradient(ellipse 900px 600px at 50% -50px, rgba(79,94,247,0.2) 0%, transparent 65%),
          radial-gradient(ellipse 600px 400px at 80% 50%, rgba(192,132,252,0.1) 0%, transparent 60%)
        `,
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(79,94,247,0.12)',
          border: '1px solid rgba(79,94,247,0.3)',
          borderRadius: 999,
          padding: '5px 14px',
          fontSize: 12.5,
          fontWeight: 600,
          color: '#818cf8',
          marginBottom: 28,
          letterSpacing: '0.02em',
        }}>
          🇳🇵 Built for Nepali Businesses · 7-Day Free Trial
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
          Your AI Social Media<br />
          <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Partner for Nepal
          </span>
        </h1>

        <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: 'var(--text-muted)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Generate campaigns, captions, Reels scripts, and leads in English and Nepali.
          Powered by AI that understands the Nepali market.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/signup"
            className="btn btn-primary btn-lg"
            style={{ fontSize: 16, padding: '0 32px', height: 52 }}
          >
            Start Free — 7 Days
          </Link>
          <Link
            href="#features"
            className="btn btn-secondary btn-lg"
            style={{ fontSize: 16, padding: '0 32px', height: 52 }}
          >
            See Features ↓
          </Link>
        </div>

        {/* Social proof numbers */}
        <div style={{
          display: 'flex',
          gap: 40,
          justifyContent: 'center',
          marginTop: 64,
          flexWrap: 'wrap',
        }}>
          {[
            { v: '500+', l: 'Businesses' },
            { v: '50K+', l: 'Posts Generated' },
            { v: '3.2×', l: 'Avg. Lead Growth' },
            { v: '🇳🇵', l: '100% Made in Nepal' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text)', marginBottom: 4 }}>
                {s.v}
              </p>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', marginBottom: 12 }}>
            Everything in one platform
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            No more juggling 5 tools. MarkaAI handles content, scheduling, leads, and analytics.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="card feature-card"
              style={{ padding: '24px 28px', transition: 'border-color 0.2s, transform 0.2s' }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(79,94,247,0.04) 100%)',
        padding: '80px 40px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', textAlign: 'center', marginBottom: 48 }}>
            Loved by Nepali businesses
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding: '24px 28px' }}>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-dim)', marginBottom: 20, fontStyle: 'italic' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f5ef7, #c084fc)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 16,
                    color: '#fff',
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.biz}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 40px', maxWidth: 900, margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', marginBottom: 12 }}>
          Simple NPR pricing
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 48 }}>
          Pay with eSewa or Khalti. No international card needed.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className="card"
              style={{
                padding: '28px 32px',
                minWidth: 220,
                border: plan.popular ? '1px solid rgba(192,132,252,0.4)' : '1px solid var(--border)',
                boxShadow: plan.popular ? '0 0 32px rgba(192,132,252,0.15)' : 'none',
                position: 'relative',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #4f5ef7, #c084fc)',
                  color: '#fff', fontSize: 10.5, fontWeight: 700,
                  padding: '3px 12px', borderRadius: 999,
                }}>
                  POPULAR
                </div>
              )}
              <p style={{ fontWeight: 800, fontSize: 20, fontFamily: "'Plus Jakarta Sans', sans-serif", color: plan.color, marginBottom: 8 }}>
                {plan.name}
              </p>
              <p style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>
                NPR {plan.price}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>/month</p>
              <Link href="/signup" className="btn btn-primary" style={{ width: '100%', background: plan.popular ? undefined : plan.color }}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(79,94,247,0.12) 0%, rgba(192,132,252,0.08) 100%)',
        borderTop: '1px solid var(--border)',
      }}>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', marginBottom: 16 }}>
          Ready to grow faster?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 36 }}>
          Join 500+ Nepali businesses using MarkaAI. Free for 7 days.
        </p>
        <Link
          href="/signup"
          className="btn btn-primary btn-lg"
          style={{ fontSize: 17, padding: '0 40px', height: 56, boxShadow: '0 0 32px rgba(79,94,247,0.4)' }}
        >
          🚀 &nbsp;Start Free Trial
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>
          Marka<span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
        </span>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          © {new Date().getFullYear()} MarkaAI. Built in 🇳🇵 Nepal.
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="#" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Privacy</a>
          <a href="#" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Terms</a>
          <a href="mailto:hello@markaai.com" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Contact</a>
        </div>
      </footer>
    </div>
  )
}
