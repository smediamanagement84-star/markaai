import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MarkaAI App',
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

  if (!isDevMode) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="app-content">
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  )
}
