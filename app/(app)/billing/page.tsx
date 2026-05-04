import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Billing' }

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 1500,
    priceAnnual: 14400,
    features: [
      '1 workspace',
      '100 AI generations / month',
      'Facebook + Instagram',
      'Basic analytics',
      'Lead capture',
    ],
    color: 'var(--accent)',
    glow: 'rgba(79,94,247,0.2)',
  },
  {
    id: 'professional',
    name: 'Professional',
    priceMonthly: 3500,
    priceAnnual: 33600,
    features: [
      '3 workspaces',
      'Unlimited AI generations',
      'All platforms',
      'Full analytics + reports',
      'Automations & flows',
      'Influencer discovery',
      'White-label reports',
    ],
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.2)',
    highlight: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    priceMonthly: 8000,
    priceAnnual: 76800,
    features: [
      'Unlimited workspaces',
      'Unlimited AI generations',
      'All platforms',
      'Full analytics',
      'Full white-labeling',
      'Agency dashboard',
      'Priority support',
      'VisaARC integration',
    ],
    color: 'var(--gold)',
    glow: 'rgba(245,158,11,0.2)',
  },
]

export default async function BillingPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  let profile: any
  let subs: any[] | null = null

  if (isDevMode) {
    // Use mock data in dev mode
    const mockUser = { id: 'mock-user-001', email: 'demo@markaai.com' }
    profile = {
      subscription_tier: 'trial',
      subscription_status: 'active',
      trial_ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    }
    subs = []
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profileData } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, trial_ends_at')
      .eq('id', user.id)
      .single()
    profile = profileData

    const { data: subsData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    subs = subsData
  }

  const currentTier   = profile?.subscription_tier ?? 'trial'
  const isTrialing    = currentTier === 'trial'
  const trialEnds     = profile?.trial_ends_at
  const trialDaysLeft = trialEnds
    ? Math.max(0, Math.ceil((new Date(trialEnds).getTime() - Date.now()) / 86_400_000))
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Billing & Plans</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
          {isTrialing
            ? `You are on a free trial — ${trialDaysLeft} days remaining`
            : `Current plan: ${currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}`}
        </p>
      </div>

      {/* Trial banner */}
      {isTrialing && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(79,94,247,0.12), rgba(192,132,252,0.08))',
          border: '1px solid rgba(79,94,247,0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
        }}>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            ⏳ Free Trial — {trialDaysLeft} days left
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
            Upgrade now to keep access to AI generations, automations, and analytics.
          </p>
        </div>
      )}

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className="card"
            style={{
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              position: 'relative',
              border: plan.highlight
                ? '1px solid rgba(192,132,252,0.4)'
                : currentTier === plan.id
                  ? '1px solid rgba(79,94,247,0.4)'
                  : 'var(--border)',
              boxShadow: plan.highlight ? `0 0 32px ${plan.glow}` : undefined,
            }}
          >
            {plan.highlight && (
              <div style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #4f5ef7, #c084fc)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 12px',
                borderRadius: 999,
                letterSpacing: '0.05em',
              }}>
                MOST POPULAR
              </div>
            )}

            <div>
              <p style={{
                fontWeight: 800,
                fontSize: 20,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: plan.color,
              }}>
                {plan.name}
              </p>
              <div style={{ marginTop: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800 }}>
                  NPR {plan.priceMonthly.toLocaleString()}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>/month</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                NPR {plan.priceAnnual.toLocaleString()} billed annually (20% off)
              </p>
            </div>

            <div className="divider" />

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 0, listStyle: 'none' }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-dim)' }}>
                  <span style={{ color: plan.color, fontSize: 14 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              className="btn"
              disabled={currentTier === plan.id}
              style={{
                marginTop: 'auto',
                background: currentTier === plan.id
                  ? 'var(--bg-input)'
                  : `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`,
                color: currentTier === plan.id ? 'var(--text-muted)' : '#fff',
                border: 'none',
                boxShadow: currentTier === plan.id ? 'none' : `0 0 16px ${plan.glow}`,
              }}
            >
              {currentTier === plan.id ? '✓ Current Plan' : `Upgrade to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Payment note */}
      <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 24 }}>🇳🇵</span>
        <div>
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 2 }}>Pay with eSewa or Khalti</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            After clicking upgrade, you&apos;ll be guided through payment via eSewa or Khalti. Bank transfer available on Agency plan.
          </p>
        </div>
      </div>

      {/* Billing history */}
      {subs && subs.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Billing History</h2>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Period</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subs.map(sub => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{sub.tier}</td>
                    <td>NPR {sub.amount_npr.toLocaleString()}</td>
                    <td style={{ textTransform: 'capitalize' }}>{sub.payment_method ?? '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(sub.starts_at).toLocaleDateString()} → {new Date(sub.ends_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${sub.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
