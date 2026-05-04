import { GoogleGenerativeAI } from '@google/generative-ai'
import { mockDelay } from '@/lib/mock-data'

const genAI = process.env.GOOGLE_GEMINI_API_KEY && process.env.GOOGLE_GEMINI_API_KEY !== 'demo-key-for-testing'
  ? new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
  : null

export interface GeneratePostInput {
  businessType: string
  businessDescription?: string
  platform: string
  postType: string
  funnelStage: string
  topic: string
  tone: string
  language: 'english' | 'nepali' | 'both'
  hashtags?: boolean
  visualDirection?: boolean
}

export interface GeneratedPost {
  caption: string
  captionNepali?: string
  hashtags: string[]
  visualDirection: string
  markaScore: number
  scoreFlags: string[]
}

export async function generatePost(input: GeneratePostInput): Promise<GeneratedPost> {
  // Use mock data in dev mode or when API key is not configured
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true' || !genAI

  if (isDevMode) {
    // Simulate network delay
    await mockDelay(800)

    // Generate contextual mock response based on input
    const mockCaption = generateMockCaption(input)
    const mockHashtags = generateMockHashtags(input)

    return {
      caption: mockCaption,
      captionNepali: input.language === 'both' || input.language === 'nepali'
        ? 'यो एक डेमो पोस्ट हो। वास्तविक AI उत्पादनको लागि Gemini API key कन्फिगर गर्नुहोस्।'
        : undefined,
      hashtags: mockHashtags,
      visualDirection: `High-quality ${input.postType} showing ${input.topic}. Professional lighting, engaging composition. Focus on ${input.businessType} aesthetic.`,
      markaScore: Math.floor(Math.random() * 15) + 80, // 80-95
      scoreFlags: [
        'Strong hook with emotional appeal',
        'Clear call-to-action included',
        'Optimized for ' + input.platform,
        'Consider adding urgency element',
      ],
    }
  }

  const model = genAI!.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const langInstruction = input.language === 'nepali'
    ? 'Write the caption ONLY in Nepali (Devanagari script).'
    : input.language === 'both'
    ? 'Write the caption in English and also provide a Nepali (Devanagari) translation.'
    : 'Write the caption in English.'

  const prompt = `You are MarkaAI, an expert social media strategist for Nepali businesses.

Business Type: ${input.businessType}
${input.businessDescription ? `Business Description: ${input.businessDescription}` : ''}
Platform: ${input.platform}
Post Type: ${input.postType}
Funnel Stage: ${input.funnelStage}
Topic / Promotion: ${input.topic}
Brand Tone: ${input.tone}

${langInstruction}

Generate a high-performing ${input.platform} ${input.postType} caption for the above topic.

For the Marka Score (1-100), evaluate based on:
- Hook strength (first line grab)
- CTA clarity
- Emotional resonance
- Platform-specific optimization
- Hashtag relevance

Return ONLY this JSON (no markdown, no explanation):
{
  "caption": "...",
  ${input.language === 'both' ? '"captionNepali": "...",': ''}
  "hashtags": ["tag1", "tag2", ...],
  "visualDirection": "Brief description of ideal image/video for this post",
  "markaScore": 75,
  "scoreFlags": ["strength 1", "improvement suggestion 1"]
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
  const parsed = JSON.parse(cleaned) as GeneratedPost

  return parsed
}

// Mock caption generator for demo mode
function generateMockCaption(input: GeneratePostInput): string {
  const emojis = ['✨', '🚀', '💫', '🎯', '🌟', '💪', '🔥', '⚡']
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

  const captions = [
    `${randomEmoji} Exciting news for ${input.businessType} lovers! ${input.topic}\n\nDon't miss out on this amazing opportunity. Visit us today and experience the difference!\n\n📍 Find us in Kathmandu\n💬 DM us for more info`,
    `Transform your experience with our latest offering! ${input.topic}\n\nWhy choose us?\n✓ Quality guaranteed\n✓ Customer satisfaction\n✓ Authentic Nepali service\n\nTag a friend who needs to see this! ${randomEmoji}`,
    `${input.topic} ${randomEmoji}\n\nAt our ${input.businessType}, we believe in delivering excellence. Our ${input.tone} approach ensures you get the best experience every time.\n\nVisit us today and see the difference!\n\n🇳🇵 Proudly serving Nepal`,
  ]

  return captions[Math.floor(Math.random() * captions.length)]
}

// Mock hashtag generator
function generateMockHashtags(input: GeneratePostInput): string[] {
  const platformHashtags = {
    instagram: ['InstaGood', 'Trending', 'DailyPost'],
    facebook: ['Nepal', 'LocalBusiness', 'Community'],
    tiktok: ['ForYou', 'Viral', 'TrendingNow'],
    linkedin: ['Business', 'Professional', 'Growth'],
  }

  const businessTags = [
    input.businessType.replace(/\s+/g, ''),
    'Nepal',
    'Kathmandu',
    'NepaliBusiness',
    'MadeInNepal',
  ]

  const platform = input.platform.toLowerCase()
  const platformSpecific = platformHashtags[platform as keyof typeof platformHashtags] || []

  return [...businessTags.slice(0, 3), ...platformSpecific].slice(0, 8)
}
