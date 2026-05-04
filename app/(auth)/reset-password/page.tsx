'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Check, X } from 'lucide-react'

const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { id: 'lowercase', label: 'One lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { id: 'number', label: 'One number', test: (pw: string) => /\d/.test(pw) },
]

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  // Password validation
  const passwordRulesStatus = PASSWORD_RULES.map(rule => ({
    ...rule,
    passed: rule.test(password),
  }))
  const isPasswordValid = passwordRulesStatus.every(rule => rule.passed)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const showPasswordRequirements = passwordTouched && password && !isPasswordValid

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isPasswordValid) {
      setError('Password does not meet requirements')
      setLoading(false)
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const { error: err } = await supabase.auth.updateUser({
      password: password
    })

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card animate-fade-up" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ marginBottom: 8 }}>Password updated!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginBottom: 24 }}>
            Your password has been successfully reset. Redirecting to dashboard...
          </p>
          <div className="spinner" style={{ margin: '0 auto' }} />
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
          <h2 style={{ marginBottom: 8, fontSize: 20 }}>Create new password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
            Enter a strong password for your account
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
            <label className="label" htmlFor="password">New Password</label>
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

          <div className="field">
            <label className="label" htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="input"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{
                  paddingRight: 40,
                  borderColor: confirmPassword && !passwordsMatch ? 'var(--red)' : undefined,
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading || !isPasswordValid || !passwordsMatch}
            style={{ width: '100%', marginTop: 4 }}
          >
            {loading ? <span className="spinner" /> : 'Reset Password'}
          </button>
        </form>

        <Link
          href="/login"
          className="btn btn-ghost"
          style={{ width: '100%', marginTop: 16, fontSize: 13 }}
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
