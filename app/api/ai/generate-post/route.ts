import { createClient } from '@/lib/supabase/server'
import { generatePost } from '@/lib/ai/generate-post'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

    if (!isDevMode) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = await generatePost(body)

    // Increment ai_generation_count via RPC (skip in dev mode)
    if (!isDevMode) {
      const supabase = await createClient()
      await supabase.rpc('increment_ai_count', { row_id: (await supabase.auth.getUser()).data.user?.id })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[AI generate-post]', err)
    return NextResponse.json(
      { error: 'AI generation failed' },
      { status: 500 }
    )
  }
}
