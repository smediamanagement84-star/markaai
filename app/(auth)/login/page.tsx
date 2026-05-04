import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading...</div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
