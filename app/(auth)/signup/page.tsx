'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Check, X } from 'lucide-react'

// Password validation rules
const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { id: 'lowercase', label: 'One lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { id: 'number', label: 'One number', test: (pw: string) => /\d/.test(pw) },
]

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  // Demo mode detection
  const isDemoMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

  // Email validation - accepts ALL valid email formats (personal and business)
  // Validates format: user@domain.com (Gmail, Yahoo, Outlook, etc. are all allowed)
  const isEmailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const showEmailError = emailTouched && email && !isEmailValid

  // Password validation
  const passwordRulesStatus = PASSWORD_RULES.map(rule => ({
    ...rule,
    passed: rule.test(password),
  }))
  const isPasswordValid = passwordRulesStatus.every(rule => rule.passed)
  const showPasswordRequirements = passwordTouched && password && !isPasswordValid

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Final validation
    if (!fullName.trim()) {
      setError('Please enter your full name')
      setLoading(false)
      return
    }

    if (!isEmailValid) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError('Password does not meet requirements')
      setLoading(false)
      return
    }

    // Demo mode: simulate signup
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setDone(true)
      setLoading(false)
      return
    }

    // Production mode: real Supabase signup
    try {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })

      if (err) {
        setError(err.message)
        setLoading(false)
      } else {
        setDone(true)
      }
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Demo mode: Authentication not configured. Navigate to /dashboard to see demo data.')
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card animate-fade-up" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{isDemoMode ? '🎉' : '✉️'}</div>
          <h2 style={{ marginBottom: 8 }}>
            {isDemoMode ? 'Demo Account Created!' : 'Check your inbox'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginBottom: 24 }}>
            {isDemoMode ? (
              <>
                In production, you would receive a verification email. For demo purposes, you can now explore the dashboard with sample data.
              </>
            ) : (
              <>
                We sent a confirmation link to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
                Click it to activate your MarkaAI account.
              </>
            )}
          </p>
          {isDemoMode ? (
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn btn-secondary" style={{ width: '100%' }}>
              Back to Sign In
            </Link>
          )}
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
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
            Start your 7-day free trial — no card required
          </p>
        </div>

        {isDemoMode && (
          <div style={{
            padding: 12,
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
          }}>
            <strong>Demo Mode:</strong> Authentication is simulated. In production, real user accounts will be created.
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            <label className="label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              className="input"
              placeholder="Aarav Sharma"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              required
              autoComplete="email"
              style={{
                borderColor: showEmailError ? 'var(--red)' : undefined,
              }}
            />
            {showEmailError && (
              <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>
                Please enter a valid email address
              </p>
            )}
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Create a strong password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                required
                autoComplete="new-password"
                style={{
                  paddingRight: 40,
                  borderColor: showPasswordRequirements ? 'var(--red)' : undefined,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {passwordTouched && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {passwordRulesStatus.map(rule => (
                  <div
                    key={rule.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: rule.passed ? 'var(--green)' : 'var(--text-muted)',
                    }}
                  >
                    {rule.passed ? <Check size={14} /> : <X size={14} />}
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            id="signup-btn"
            className="btn btn-primary btn-lg"
            disabled={loading || !fullName || !isEmailValid || !isPasswordValid}
            style={{ width: '100%', marginTop: 4 }}
          >
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#818cf8', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
