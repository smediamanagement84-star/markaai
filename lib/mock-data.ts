// Mock data for development and testing without real API keys

export const MOCK_USER = {
  id: 'mock-user-id-001',
  email: 'demo@markaai.com',
  user_metadata: {
    full_name: 'Demo User',
    avatar_url: null,
  },
  created_at: new Date().toISOString(),
}

export const MOCK_BUSINESS_PROFILE = {
  id: 'mock-profile-001',
  user_id: 'mock-user-id-001',
  full_name: 'Demo User',
  business_name: 'Himalayan Coffee House',
  subscription_tier: 'trial',
  subscription_status: 'active',
  trial_ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  preferred_language: 'english',
  timezone: 'Asia/Kathmandu',
  ai_generation_count: 12,
  industry: 'Food & Beverage',
  target_audience: 'Young professionals and tourists in Kathmandu',
  brand_voice: 'Friendly, welcoming, and authentic',
  social_handles: {
    facebook: '@himalayancoffeehouse',
    instagram: '@himalayancoffee',
    tiktok: '@himalayancoffee',
  },
  created_at: new Date().toISOString(),
}

export const MOCK_CAMPAIGNS = [
  {
    id: 'camp-001',
    workspace_id: 'mock-workspace-001',
    name: 'Dashain Special Menu Launch',
    promotion_subject: 'Dashain menu with traditional Nepali sweets fusion',
    promotion_detail: 'Promote our special Dashain menu with traditional Nepali sweets fusion',
    duration_days: 14,
    platforms: ['instagram', 'facebook', 'tiktok'],
    ad_budget_type: 'boosted',
    status: 'active',
    created_at: '2026-09-15T00:00:00Z',
  },
  {
    id: 'camp-002',
    workspace_id: 'mock-workspace-001',
    name: 'New Year Coffee Promo',
    promotion_subject: 'Buy 2 get 1 free on all specialty coffees',
    promotion_detail: 'New Year special: Buy 2 get 1 free on all specialty coffees',
    duration_days: 8,
    platforms: ['instagram', 'facebook'],
    ad_budget_type: 'organic',
    status: 'scheduled',
    created_at: '2026-12-01T00:00:00Z',
  },
  {
    id: 'camp-003',
    workspace_id: 'mock-workspace-001',
    name: 'Summer Cold Brew Series',
    promotion_subject: 'New cold brew flavors for summer',
    promotion_detail: 'Launch new cold brew flavors for summer season',
    duration_days: 30,
    platforms: ['instagram', 'tiktok'],
    ad_budget_type: 'paid',
    status: 'completed',
    created_at: '2026-03-10T00:00:00Z',
  },
]

export const MOCK_POSTS = [
  {
    id: 'post-001',
    workspace_id: 'mock-workspace-001',
    campaign_id: 'camp-001',
    caption: '🎉 Dashain ko subhakamana! This festive season, enjoy our special Sel Roti Latte and traditional sweets with a modern twist. Visit us at Thamel! ☕✨\n\n#Dashain2026 #NepaliFusion #HimalayanCoffee',
    caption_nepali: null,
    hashtags: ['Dashain2026', 'NepaliFusion', 'HimalayanCoffee'],
    visual_direction: 'Warm, festive image featuring traditional Dashain decorations with coffee',
    platform: 'instagram',
    post_type: 'carousel',
    marka_score: 87,
    score_flags: {},
    status: 'published',
    funnel_stage: 'awareness',
    published_at: '2026-10-02T09:00:00Z',
    scheduled_at: null,
    created_at: '2026-10-01T00:00:00Z',
  },
  {
    id: 'post-002',
    workspace_id: 'mock-workspace-001',
    campaign_id: 'camp-001',
    caption: 'दशैंको विशेष! Come taste Nepal in every cup. Our Dashain special menu combines tradition with innovation. Limited time only! 🇳🇵',
    caption_nepali: 'दशैंको विशेष! हाम्रो विशेष मेनु अभी उपलब्ध छ।',
    hashtags: ['Dashain', 'NepalCoffee', 'Festival'],
    visual_direction: 'Traditional Nepali elements with modern coffee presentation',
    platform: 'facebook',
    post_type: 'feed_post',
    marka_score: 82,
    score_flags: {},
    status: 'published',
    funnel_stage: 'engagement',
    published_at: '2026-10-03T14:00:00Z',
    scheduled_at: null,
    created_at: '2026-10-02T00:00:00Z',
  },
  {
    id: 'post-003',
    workspace_id: 'mock-workspace-001',
    campaign_id: 'camp-002',
    caption: 'New Year, New Flavors! ✨ Buy 2 Get 1 FREE on all our specialty coffees. Valid Dec 28 - Jan 5. Start 2027 caffeinated! ☕',
    caption_nepali: null,
    hashtags: ['NewYear2027', 'CoffeePromo', 'Kathmandu'],
    visual_direction: 'Celebratory New Year themed coffee display with sparkle effects',
    platform: 'instagram',
    post_type: 'reel',
    marka_score: 91,
    score_flags: {},
    status: 'scheduled',
    funnel_stage: 'conversion',
    published_at: null,
    scheduled_at: '2026-12-28T08:00:00Z',
    created_at: '2026-12-20T00:00:00Z',
  },
  {
    id: 'post-004',
    workspace_id: 'mock-workspace-001',
    campaign_id: null,
    caption: '☕ Monday morning fuel! Our baristas are brewing your favorites. Come grab your perfect cup before the rush!\n\n#MondayMotivation #CoffeeTime #Kathmandu',
    caption_nepali: null,
    hashtags: ['MondayMotivation', 'CoffeeTime', 'Kathmandu'],
    visual_direction: 'Morning coffee being brewed, steam rising, warm lighting',
    platform: 'instagram',
    post_type: 'story',
    marka_score: 78,
    score_flags: {},
    status: 'draft',
    funnel_stage: 'awareness',
    published_at: null,
    scheduled_at: null,
    created_at: '2026-10-04T00:00:00Z',
  },
]

export const MOCK_LEADS = [
  {
    id: 'lead-001',
    workspace_id: 'mock-workspace-001',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+977-9841234567',
    source_type: 'social_dm',
    source_platform: 'instagram',
    source_url: 'https://instagram.com/p/dashain-post',
    stage: 'contacted',
    urgency_score: 6,
    notes: 'Interested in catering for office Dashain party',
    created_at: '2026-10-03T10:30:00Z',
  },
  {
    id: 'lead-002',
    workspace_id: 'mock-workspace-001',
    name: 'Rajesh Thapa',
    email: 'rajesh@techcorp.com.np',
    phone: '+977-9851234567',
    source_type: 'social_comment',
    source_platform: 'facebook',
    source_url: null,
    stage: 'qualified',
    urgency_score: 8,
    notes: 'Corporate bulk order inquiry for 50+ people',
    created_at: '2026-10-02T15:20:00Z',
  },
  {
    id: 'lead-003',
    workspace_id: 'mock-workspace-001',
    name: 'Anita KC',
    email: null,
    phone: null,
    source_type: 'social_dm',
    source_platform: 'instagram',
    source_url: null,
    stage: 'new',
    urgency_score: 4,
    notes: 'DM about custom birthday cake with coffee theme',
    created_at: '2026-10-04T09:15:00Z',
  },
]

export const MOCK_INBOX_MESSAGES = [
  {
    id: 'msg-001',
    workspace_id: 'mock-workspace-001',
    platform: 'instagram',
    message_type: 'dm',
    sender_name: 'sarita_np',
    message_text: 'Your Dashain menu looks amazing! Do you deliver to Lalitpur?',
    sentiment: 'lead',
    urgency_score: 6,
    is_resolved: false,
    ai_suggested_reply: 'Hi Sarita! Thank you so much! Yes, we deliver to Lalitpur. Our delivery fee is NPR 150. Would you like to place an order? 😊',
    received_at: '2026-10-04T11:30:00Z',
    created_at: '2026-10-04T11:30:00Z',
  },
  {
    id: 'msg-002',
    workspace_id: 'mock-workspace-001',
    platform: 'facebook',
    message_type: 'comment',
    sender_name: 'Bikash Rai',
    message_text: 'What are your opening hours during Dashain?',
    sentiment: 'neutral',
    urgency_score: 3,
    is_resolved: false,
    ai_suggested_reply: 'Hi Bikash! During Dashain, we\'re open 8 AM - 8 PM daily. Looking forward to serving you! ☕',
    received_at: '2026-10-04T10:15:00Z',
    created_at: '2026-10-04T10:15:00Z',
  },
  {
    id: 'msg-003',
    workspace_id: 'mock-workspace-001',
    platform: 'instagram',
    message_type: 'dm',
    sender_name: 'tech_startup_ktm',
    message_text: 'Can you cater for a corporate event? Need coffee for 80 people.',
    sentiment: 'lead',
    urgency_score: 9,
    is_resolved: false,
    ai_suggested_reply: 'Absolutely! We\'d love to cater your event. I\'ll send you a DM with our corporate packages and pricing. When is your event?',
    received_at: '2026-10-04T14:00:00Z',
    created_at: '2026-10-04T14:00:00Z',
  },
]

export const MOCK_ANALYTICS = [
  {
    id: 'snap-001',
    workspace_id: 'mock-workspace-001',
    platform: 'instagram',
    snapshot_date: '2026-10-04',
    followers: 8500,
    following: 320,
    posts_count: 28,
    reach: 45320,
    impressions: 68540,
    engagement_rate: 6.8,
    profile_views: 1240,
    website_clicks: 156,
    created_at: '2026-10-04T00:00:00Z',
  },
  {
    id: 'snap-002',
    workspace_id: 'mock-workspace-001',
    platform: 'facebook',
    snapshot_date: '2026-10-04',
    followers: 3840,
    following: 0,
    posts_count: 15,
    reach: 18940,
    impressions: 32450,
    engagement_rate: 4.2,
    profile_views: 680,
    website_clicks: 94,
    created_at: '2026-10-04T00:00:00Z',
  },
  {
    id: 'snap-003',
    workspace_id: 'mock-workspace-001',
    platform: 'tiktok',
    snapshot_date: '2026-10-04',
    followers: 500,
    following: 45,
    posts_count: 5,
    reach: 8650,
    impressions: 15420,
    engagement_rate: 12.4,
    profile_views: 340,
    website_clicks: 28,
    created_at: '2026-10-04T00:00:00Z',
  },
]

export const MOCK_AI_RESPONSES = [
  {
    prompt: 'instagram post about coffee',
    response: {
      caption: '☕ Start your day right with our signature Himalayan Blend! \n\nCrafted from the finest beans sourced from local Nepali farmers, every cup tells a story of tradition and quality.\n\nVisit us today and taste the difference! 🇳🇵✨\n\n#HimalayanCoffee #NepalCoffee #LocallySourced #CoffeeLovers #Kathmandu',
      marka_score: 85,
      score_breakdown: {
        relevance: 90,
        engagement_potential: 85,
        brand_voice: 80,
        clarity: 85,
      },
      improvements: [
        'Consider adding a specific call-to-action',
        'Include location tag for better local reach',
        'Add user-generated content request',
      ],
      visual_direction: 'Close-up shot of steaming coffee in a traditional Nepali ceramic cup, with mountain view in blurred background. Warm morning lighting.',
    },
  },
]

export function getMockData(type: string, params?: any) {
  switch (type) {
    case 'user':
      return MOCK_USER
    case 'profile':
      return MOCK_BUSINESS_PROFILE
    case 'campaigns':
      return MOCK_CAMPAIGNS
    case 'posts':
      return MOCK_POSTS
    case 'leads':
      return MOCK_LEADS
    case 'messages':
    case 'inbox':
      return MOCK_INBOX_MESSAGES
    case 'analytics':
      return MOCK_ANALYTICS
    case 'ai_response':
      return MOCK_AI_RESPONSES[0]
    default:
      return null
  }
}

// Mock API delay to simulate network requests
export const mockDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms))
