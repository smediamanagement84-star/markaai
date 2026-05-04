'use client'

interface QuickActionProps {
  href: string
  icon: string
  label: string
  desc: string
}

export function QuickActionCard({ href, icon, label, desc }: QuickActionProps) {
  return (
    <a
      href={href}
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 18px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'border-color 0.15s, transform 0.15s',
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(79,94,247,0.4)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
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
        {icon}
      </div>
      <div>
        <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 2, color: 'var(--text)' }}>{label}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</p>
      </div>
    </a>
  )
}
