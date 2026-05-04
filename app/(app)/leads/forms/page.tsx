'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { LeadForm } from '@/lib/types/database'

export default function LeadFormsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [forms, setForms] = useState<LeadForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadForms() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: ws } = await supabase
          .from('workspaces')
          .select('id')
          .eq('owner_id', user.id)
          .single()

        if (!ws) {
          router.push('/onboarding')
          return
        }

        const { data: leadForms, error: formsErr } = await supabase
          .from('lead_forms')
          .select('*')
          .eq('workspace_id', ws.id)
          .order('created_at', { ascending: false })

        if (formsErr) throw formsErr
        setForms(leadForms || [])
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    loadForms()
  }, [supabase, router])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm">← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <div>
            <h1 style={{ fontSize: 24 }}>Lead Forms</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>Capture high-intent leads directly into MarkaAI.</p>
          </div>
          <button className="btn btn-primary">➕ Create New Form</button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div>
      ) : error ? (
        <div className="card" style={{ padding: 20, color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>
      ) : forms.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 40 }}>📋</div>
          <h2 style={{ fontSize: 18 }}>No lead forms yet</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 400 }}>Create forms to embed on your bio link, website, or use for WhatsApp / Messenger ads.</p>
          <button className="btn btn-primary" style={{ marginTop: 8 }}>Create Your First Form</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {forms.map(form => (
            <div key={form.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16 }}>{form.name}</h3>
                <span className={`badge ${form.is_active ? 'badge-green' : 'badge-gray'}`}>
                  {form.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                <span>🎯 {form.submission_count} submissions</span>
                <span>📅 {new Date(form.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Edit</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Copy Link</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
