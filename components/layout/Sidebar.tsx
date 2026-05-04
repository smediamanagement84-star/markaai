'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  {
    group: 'Main',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: '⚡' },
      { href: '/content',   label: 'Content Studio', icon: '✍️' },
      { href: '/campaigns', label: 'Campaigns', icon: '🚀' },
      { href: '/inbox',     label: 'Inbox', icon: '💬' },
      { href: '/leads',     label: 'Leads', icon: '🎯' },
    ],
  },
  {
    group: 'Insights',
    items: [
      { href: '/analytics',  label: 'Analytics', icon: '📊' },
      { href: '/influencers',label: 'Influencers', icon: '⭐' },
      { href: '/automations',label: 'Automations', icon: '⚙️' },
    ],
  },
  {
    group: 'Workspace',
    items: [
      { href: '/settings',   label: 'Settings', icon: '🔧' },
      { href: '/billing',    label: 'Billing', icon: '💳' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 12px 20px' }}>
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
          flexShrink: 0,
          boxShadow: '0 0 14px rgba(79,94,247,0.35)',
        }}>M</div>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: 17,
          letterSpacing: '-0.4px',
        }}>
          Marka<span style={{
            background: 'linear-gradient(135deg, #818cf8, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>AI</span>
        </span>
      </div>

      {/* Nav groups */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto' }}>
        {NAV.map(group => (
          <div key={group.group}>
            <p style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              padding: '0 12px',
              marginBottom: 4,
            }}>
              {group.group}
            </p>
            {group.items.map(item => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={handleLogout}
        className="nav-item"
        style={{ marginTop: 8, color: 'var(--text-muted)' }}
      >
        <span style={{ fontSize: 15 }}>🚪</span>
        Sign Out
      </button>
    </nav>
  )
}
