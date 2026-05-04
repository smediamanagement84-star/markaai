'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card animate-fade-up" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <h2 style={{ marginBottom: 8 }}>Check your email</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginBottom: 24 }}>
            We sent a password reset link to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
            Click the link in the email to reset your password.
          </p>
          <Link href="/login" className="btn btn-secondary" style={{ width: '100%' }}>
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-up">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8,
          }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f5ef7, #c084fc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 18,
              color: '#fff',
              boxShadow: '0 0 20px rgba(79,94,247,0.4)',
            }}>M</div>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px' }}>
              Marka<span className="gradient-text">AI</span>
            </span>
          </div>
          <h2 style={{ marginBottom: 8, fontSize: 20 }}>Reset your password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius)',
              padding: '10px 14px',
              color: 'var(--red)',
              fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: 4 }}
          >
            {loading ? <span className="spinner" /> : 'Send Reset Link'}
          </button>
        </form>

        <Link
          href="/login"
          className="btn btn-ghost"
          style={{ width: '100%', marginTop: 16 }}
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
