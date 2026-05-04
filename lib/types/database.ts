export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'trial' | 'starter' | 'professional' | 'agency'
          subscription_status: 'active' | 'expired' | 'cancelled' | 'paused'
          trial_ends_at: string | null
          preferred_language: 'nepali' | 'english' | 'both'
          timezone: string
          ai_generation_count: number
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'trial' | 'starter' | 'professional' | 'agency'
          subscription_status?: 'active' | 'expired' | 'cancelled' | 'paused'
          trial_ends_at?: string | null
          preferred_language?: 'nepali' | 'english' | 'both'
          timezone?: string
          ai_generation_count?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      workspaces: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          logo_url: string | null
          brand_colors: Json
          white_label_enabled: boolean
          agency_branding: Json | null
          visa_arc_enabled: boolean
          visa_arc_webhook_url: string | null
          visa_arc_error_count: number
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          logo_url?: string | null
          brand_colors?: Json
          white_label_enabled?: boolean
          agency_branding?: Json | null
          visa_arc_enabled?: boolean
          visa_arc_webhook_url?: string | null
          visa_arc_error_count?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['workspaces']['Insert']>
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer' | 'external_reviewer'
          invited_by: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer' | 'external_reviewer'
          invited_by?: string | null
          joined_at?: string
        }
        Update: Partial<Database['public']['Tables']['workspace_members']['Insert']>
      }
      business_profiles: {
        Row: {
          id: string
          workspace_id: string
          business_type: string
          business_description: string | null
          target_audience: Json
          brand_tone: 'professional' | 'casual' | 'fun' | 'luxury' | 'community' | null
          content_language: 'nepali' | 'english' | 'both'
          active_platforms: string[]
          competitor_pages: Json
          business_goals: string[] | null
          lead_destination: 'whatsapp' | 'form' | 'dm' | 'website' | null
          lead_monthly_target: number
          ai_context_prompt: string | null
          aesthetic_prefs: Json
          account_memory: Json
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          business_type: string
          business_description?: string | null
          target_audience?: Json
          brand_tone?: 'professional' | 'casual' | 'fun' | 'luxury' | 'community' | null
          content_language?: 'nepali' | 'english' | 'both'
          active_platforms?: string[]
          competitor_pages?: Json
          business_goals?: string[] | null
          lead_destination?: 'whatsapp' | 'form' | 'dm' | 'website' | null
          lead_monthly_target?: number
          ai_context_prompt?: string | null
          aesthetic_prefs?: Json
          account_memory?: Json
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['business_profiles']['Insert']>
      }
      connected_accounts: {
        Row: {
          id: string
          workspace_id: string
          platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'google_business' | 'whatsapp' | 'viber'
          platform_account_id: string
          account_name: string | null
          account_handle: string | null
          access_token: string
          refresh_token: string | null
          token_expires_at: string | null
          page_id: string | null
          instagram_dm_permission: boolean
          is_active: boolean
          last_sync_at: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'google_business' | 'whatsapp' | 'viber'
          platform_account_id: string
          account_name?: string | null
          account_handle?: string | null
          access_token: string
          refresh_token?: string | null
          token_expires_at?: string | null
          page_id?: string | null
          instagram_dm_permission?: boolean
          is_active?: boolean
          last_sync_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['connected_accounts']['Insert']>
      }
      campaigns: {
        Row: {
          id: string
          workspace_id: string
          name: string
          promotion_subject: string
          promotion_detail: string | null
          duration_days: number
          start_date: string | null
          platforms: string[]
          ad_budget_type: 'organic' | 'boosted' | 'paid'
          funnel_strategy: Json | null
          status: 'research' | 'planning' | 'skeleton' | 'awaiting_approval' | 'producing' | 'scheduled' | 'active' | 'completed' | 'paused'
          strategy_brief: Json | null
          campaign_plan: Json | null
          skeleton: Json | null
          skeleton_approved_at: string | null
          skeleton_approved_by: string | null
          produced_at: string | null
          performance_card: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          promotion_subject: string
          promotion_detail?: string | null
          duration_days: number
          start_date?: string | null
          platforms: string[]
          ad_budget_type?: 'organic' | 'boosted' | 'paid'
          funnel_strategy?: Json | null
          status?: 'research' | 'planning' | 'skeleton' | 'awaiting_approval' | 'producing' | 'scheduled' | 'active' | 'completed' | 'paused'
          strategy_brief?: Json | null
          campaign_plan?: Json | null
          skeleton?: Json | null
          skeleton_approved_at?: string | null
          skeleton_approved_by?: string | null
          produced_at?: string | null
          performance_card?: Json | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>
      }
      posts: {
        Row: {
          id: string
          workspace_id: string
          campaign_id: string | null
          platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'google_business' | 'story'
          post_type: 'feed_post' | 'reel' | 'carousel' | 'story' | 'short' | 'gbp_post' | 'broadcast' | null
          funnel_stage: 'awareness' | 'engagement' | 'conversion' | 'social_proof' | null
          caption: string
          caption_nepali: string | null
          caption_variant_b: string | null
          active_variant: 'a' | 'b'
          hashtags: string[] | null
          visual_direction: string | null
          script: Json | null
          carousel_slides: Json | null
          media_urls: string[] | null
          marka_score: number | null
          score_flags: Json | null
          scheduled_at: string | null
          published_at: string | null
          platform_post_id: string | null
          status: 'draft' | 'awaiting_approval' | 'approved' | 'scheduled' | 'published' | 'failed' | 'paused' | 'cancelled'
          failure_reason: string | null
          approved_by: string | null
          approved_at: string | null
          ab_result: 'a_won' | 'b_won' | 'inconclusive' | null
          ab_decided_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          campaign_id?: string | null
          platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'google_business' | 'story'
          post_type?: 'feed_post' | 'reel' | 'carousel' | 'story' | 'short' | 'gbp_post' | 'broadcast' | null
          funnel_stage?: 'awareness' | 'engagement' | 'conversion' | 'social_proof' | null
          caption: string
          caption_nepali?: string | null
          caption_variant_b?: string | null
          active_variant?: 'a' | 'b'
          hashtags?: string[] | null
          visual_direction?: string | null
          script?: Json | null
          carousel_slides?: Json | null
          media_urls?: string[] | null
          marka_score?: number | null
          score_flags?: Json | null
          scheduled_at?: string | null
          published_at?: string | null
          platform_post_id?: string | null
          status?: 'draft' | 'awaiting_approval' | 'approved' | 'scheduled' | 'published' | 'failed' | 'paused' | 'cancelled'
          failure_reason?: string | null
          approved_by?: string | null
          approved_at?: string | null
          ab_result?: 'a_won' | 'b_won' | 'inconclusive' | null
          ab_decided_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
      post_analytics: {
        Row: {
          id: string
          post_id: string
          workspace_id: string
          likes: number
          comments: number
          shares: number
          saves: number
          reach: number
          impressions: number
          clicks: number
          video_views: number | null
          video_completion_rate: number | null
          early_velocity: number
          conversion_rate: number | null
          recorded_at: string
        }
        Insert: {
          id?: string
          post_id: string
          workspace_id: string
          likes?: number
          comments?: number
          shares?: number
          saves?: number
          reach?: number
          impressions?: number
          clicks?: number
          video_views?: number | null
          video_completion_rate?: number | null
          early_velocity?: number
          conversion_rate?: number | null
          recorded_at?: string
        }
        Update: Partial<Database['public']['Tables']['post_analytics']['Insert']>
      }
      analytics_snapshots: {
        Row: {
          id: string
          workspace_id: string
          platform: string
          snapshot_date: string
          followers: number | null
          following: number | null
          reach: number | null
          impressions: number | null
          engagement_rate: number | null
          new_followers: number | null
          posts_published: number | null
          avg_marka_score: number | null
          raw_data: Json | null
        }
        Insert: {
          id?: string
          workspace_id: string
          platform: string
          snapshot_date: string
          followers?: number | null
          following?: number | null
          reach?: number | null
          impressions?: number | null
          engagement_rate?: number | null
          new_followers?: number | null
          posts_published?: number | null
          avg_marka_score?: number | null
          raw_data?: Json | null
        }
        Update: Partial<Database['public']['Tables']['analytics_snapshots']['Insert']>
      }
      weekly_reports: {
        Row: {
          id: string
          workspace_id: string
          week_start: string
          week_end: string
          report_json: Json
          pdf_url: string | null
          delivered_at: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          week_start: string
          week_end: string
          report_json: Json
          pdf_url?: string | null
          delivered_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['weekly_reports']['Insert']>
      }
      inbox_messages: {
        Row: {
          id: string
          workspace_id: string
          platform: string
          message_type: 'comment' | 'dm' | 'mention' | 'review' | null
          sender_name: string | null
          sender_platform_id: string | null
          message_text: string | null
          sentiment: 'lead' | 'negative' | 'neutral' | 'spam' | null
          urgency_score: number | null
          source_post_id: string | null
          ai_suggested_reply: string | null
          replied_at: string | null
          replied_by: string | null
          is_resolved: boolean
          lead_created: boolean
          platform_message_id: string | null
          received_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          platform: string
          message_type?: 'comment' | 'dm' | 'mention' | 'review' | null
          sender_name?: string | null
          sender_platform_id?: string | null
          message_text?: string | null
          sentiment?: 'lead' | 'negative' | 'neutral' | 'spam' | null
          urgency_score?: number | null
          source_post_id?: string | null
          ai_suggested_reply?: string | null
          replied_at?: string | null
          replied_by?: string | null
          is_resolved?: boolean
          lead_created?: boolean
          platform_message_id?: string | null
          received_at?: string
        }
        Update: Partial<Database['public']['Tables']['inbox_messages']['Insert']>
      }
      leads: {
        Row: {
          id: string
          workspace_id: string
          name: string | null
          phone: string | null
          email: string | null
          message: string | null
          urgency_score: number | null
          stage: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          source_type: 'organic_post' | 'paid_post' | 'dm_keyword' | 'bio_link' | 'form' | 'manual' | null
          source_post_id: string | null
          source_campaign_id: string | null
          source_platform: string | null
          inbox_message_id: string | null
          visa_arc_synced: boolean
          visa_arc_lead_id: string | null
          tags: string[] | null
          notes: string | null
          contacted_at: string | null
          converted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name?: string | null
          phone?: string | null
          email?: string | null
          message?: string | null
          urgency_score?: number | null
          stage?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          source_type?: 'organic_post' | 'paid_post' | 'dm_keyword' | 'bio_link' | 'form' | 'manual' | null
          source_post_id?: string | null
          source_campaign_id?: string | null
          source_platform?: string | null
          inbox_message_id?: string | null
          visa_arc_synced?: boolean
          visa_arc_lead_id?: string | null
          tags?: string[] | null
          notes?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      lead_forms: {
        Row: {
          id: string
          workspace_id: string
          name: string
          fields: Json
          submission_count: number
          is_active: boolean
          automation_flow_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          fields?: Json
          submission_count?: number
          is_active?: boolean
          automation_flow_id?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['lead_forms']['Insert']>
      }
      automation_flows: {
        Row: {
          id: string
          workspace_id: string
          name: string
          trigger_type: 'lead_capture' | 'dm_keyword' | 'manual' | 'schedule' | null
          channel: 'whatsapp' | 'viber' | 'email' | null
          steps: Json
          keyword_triggers: string[] | null
          is_active: boolean
          total_triggered: number
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          trigger_type?: 'lead_capture' | 'dm_keyword' | 'manual' | 'schedule' | null
          channel?: 'whatsapp' | 'viber' | 'email' | null
          steps?: Json
          keyword_triggers?: string[] | null
          is_active?: boolean
          total_triggered?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['automation_flows']['Insert']>
      }
      influencer_discoveries: {
        Row: {
          id: string
          workspace_id: string
          search_query: string | null
          platform: string | null
          creator_handle: string | null
          creator_name: string | null
          follower_count: number | null
          engagement_rate: number | null
          brand_fit_score: number | null
          topics: string[] | null
          location: string | null
          outreach_status: 'discovered' | 'messaged' | 'responded' | 'agreed' | 'declined'
          outreach_message: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          search_query?: string | null
          platform?: string | null
          creator_handle?: string | null
          creator_name?: string | null
          follower_count?: number | null
          engagement_rate?: number | null
          brand_fit_score?: number | null
          topics?: string[] | null
          location?: string | null
          outreach_status?: 'discovered' | 'messaged' | 'responded' | 'agreed' | 'declined'
          outreach_message?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['influencer_discoveries']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: 'starter' | 'professional' | 'agency'
          billing_cycle: 'monthly' | 'annual' | null
          amount_npr: number
          payment_method: 'esewa' | 'khalti' | 'bank_transfer' | null
          payment_reference: string | null
          payment_verified: boolean
          starts_at: string
          ends_at: string
          auto_renew: boolean
          status: 'active' | 'expired' | 'refunded' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: 'starter' | 'professional' | 'agency'
          billing_cycle?: 'monthly' | 'annual' | null
          amount_npr: number
          payment_method?: 'esewa' | 'khalti' | 'bank_transfer' | null
          payment_reference?: string | null
          payment_verified?: boolean
          starts_at: string
          ends_at: string
          auto_renew?: boolean
          status?: 'active' | 'expired' | 'refunded' | 'cancelled'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
      festival_calendar: {
        Row: {
          id: string
          name_english: string
          name_nepali: string | null
          locale: string
          festival_date: string
          year: number
          days_before_alert: number
          campaign_angles: Json
          content_samples: Json
        }
        Insert: {
          id?: string
          name_english: string
          name_nepali?: string | null
          locale?: string
          festival_date: string
          year: number
          days_before_alert?: number
          campaign_angles?: Json
          content_samples?: Json
        }
        Update: Partial<Database['public']['Tables']['festival_calendar']['Insert']>
      }
      strategy_briefs: {
        Row: {
          id: string
          week_start: string
          industry: string | null
          locale: string
          top_formats: Json
          algorithm_notes: Json
          trending_topics: Json
          avoid_topics: Json
          content_ratio: Json
          raw_research: string | null
          created_at: string
        }
        Insert: {
          id?: string
          week_start: string
          industry?: string | null
          locale?: string
          top_formats?: Json
          algorithm_notes?: Json
          trending_topics?: Json
          avoid_topics?: Json
          content_ratio?: Json
          raw_research?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['strategy_briefs']['Insert']>
      }
      admins: {
        Row: { user_id: string }
        Insert: { user_id: string }
        Update: { user_id?: string }
      }
      post_templates: {
        Row: {
          id: string
          workspace_id: string
          name: string
          platform: string | null
          post_type: string | null
          caption_structure: string | null
          carousel_structure: Json | null
          script_structure: Json | null
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          platform?: string | null
          post_type?: string | null
          caption_structure?: string | null
          carousel_structure?: Json | null
          script_structure?: Json | null
          usage_count?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['post_templates']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_workspace_ids: {
        Args: {
          [_ in never]: never
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Workspace = Database['public']['Tables']['workspaces']['Row']
export type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row']
export type BusinessProfile = Database['public']['Tables']['business_profiles']['Row']
export type ConnectedAccount = Database['public']['Tables']['connected_accounts']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostAnalytics = Database['public']['Tables']['post_analytics']['Row']
export type AnalyticsSnapshot = Database['public']['Tables']['analytics_snapshots']['Row']
export type WeeklyReport = Database['public']['Tables']['weekly_reports']['Row']
export type InboxMessage = Database['public']['Tables']['inbox_messages']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type LeadForm = Database['public']['Tables']['lead_forms']['Row']
export type AutomationFlow = Database['public']['Tables']['automation_flows']['Row']
export type InfluencerDiscovery = Database['public']['Tables']['influencer_discoveries']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type FestivalCalendar = Database['public']['Tables']['festival_calendar']['Row']
export type StrategyBrief = Database['public']['Tables']['strategy_briefs']['Row']
export type PostTemplate = Database['public']['Tables']['post_templates']['Row']
