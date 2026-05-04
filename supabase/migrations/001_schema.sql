-- MarkaAI Database Schema
-- Run in Supabase SQL Editor in order

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLE 1: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name            TEXT,
  avatar_url           TEXT,
  subscription_tier    TEXT DEFAULT 'trial' CHECK (subscription_tier IN ('trial','starter','professional','agency')),
  subscription_status  TEXT DEFAULT 'active' CHECK (subscription_status IN ('active','expired','cancelled','paused')),
  trial_ends_at        TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  preferred_language   TEXT DEFAULT 'english' CHECK (preferred_language IN ('nepali','english','both')),
  timezone             TEXT DEFAULT 'Asia/Kathmandu',
  ai_generation_count  INTEGER DEFAULT 0,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- TABLE 2: workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  slug                 TEXT UNIQUE NOT NULL,
  logo_url             TEXT,
  brand_colors         JSONB DEFAULT '{"primary":"#1E3A5F","secondary":"#E8A020"}',
  white_label_enabled  BOOLEAN DEFAULT FALSE,
  agency_branding      JSONB,
  visa_arc_enabled     BOOLEAN DEFAULT FALSE,
  visa_arc_webhook_url TEXT,
  visa_arc_error_count INTEGER DEFAULT 0,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 3: workspace_members
CREATE TABLE IF NOT EXISTS workspace_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role         TEXT NOT NULL CHECK (role IN ('owner','editor','viewer','external_reviewer')),
  invited_by   UUID REFERENCES profiles(id),
  joined_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- TABLE 4: business_profiles
CREATE TABLE IF NOT EXISTS business_profiles (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id         UUID UNIQUE NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  business_type        TEXT NOT NULL,
  business_description TEXT,
  target_audience      JSONB NOT NULL DEFAULT '{"age_min":18,"age_max":45,"locations":[],"interests":[]}',
  brand_tone           TEXT CHECK (brand_tone IN ('professional','casual','fun','luxury','community')),
  content_language     TEXT DEFAULT 'english' CHECK (content_language IN ('nepali','english','both')),
  active_platforms     TEXT[] DEFAULT '{facebook,instagram}',
  competitor_pages     JSONB DEFAULT '[]',
  business_goals       TEXT[],
  lead_destination     TEXT CHECK (lead_destination IN ('whatsapp','form','dm','website')),
  lead_monthly_target  INTEGER DEFAULT 50,
  ai_context_prompt    TEXT,
  aesthetic_prefs      JSONB DEFAULT '{}',
  account_memory       JSONB DEFAULT '{}',
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 5: connected_accounts (tokens AES-256-GCM encrypted)
CREATE TABLE IF NOT EXISTS connected_accounts (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id            UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  platform                TEXT NOT NULL CHECK (platform IN ('facebook','instagram','tiktok','youtube','google_business','whatsapp','viber')),
  platform_account_id     TEXT NOT NULL,
  account_name            TEXT,
  account_handle          TEXT,
  access_token            TEXT NOT NULL,
  refresh_token           TEXT,
  token_expires_at        TIMESTAMPTZ,
  page_id                 TEXT,
  instagram_dm_permission BOOLEAN DEFAULT FALSE,
  is_active               BOOLEAN DEFAULT TRUE,
  last_sync_at            TIMESTAMPTZ,
  UNIQUE(workspace_id, platform)
);

-- TABLE 6: campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id         UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  promotion_subject    TEXT NOT NULL,
  promotion_detail     TEXT,
  duration_days        INTEGER NOT NULL,
  start_date           DATE,
  platforms            TEXT[] NOT NULL,
  ad_budget_type       TEXT DEFAULT 'organic' CHECK (ad_budget_type IN ('organic','boosted','paid')),
  funnel_strategy      JSONB,
  status               TEXT DEFAULT 'research' CHECK (status IN ('research','planning','skeleton','awaiting_approval','producing','scheduled','active','completed','paused')),
  strategy_brief       JSONB,
  campaign_plan        JSONB,
  skeleton             JSONB,
  skeleton_approved_at TIMESTAMPTZ,
  skeleton_approved_by UUID REFERENCES profiles(id),
  produced_at          TIMESTAMPTZ,
  performance_card     JSONB,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 7: posts
CREATE TABLE IF NOT EXISTS posts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  campaign_id       UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  platform          TEXT NOT NULL CHECK (platform IN ('facebook','instagram','tiktok','youtube','google_business','story')),
  post_type         TEXT CHECK (post_type IN ('feed_post','reel','carousel','story','short','gbp_post','broadcast')),
  funnel_stage      TEXT CHECK (funnel_stage IN ('awareness','engagement','conversion','social_proof')),
  caption           TEXT NOT NULL,
  caption_nepali    TEXT,
  caption_variant_b TEXT,
  active_variant    TEXT DEFAULT 'a' CHECK (active_variant IN ('a','b')),
  hashtags          TEXT[],
  visual_direction  TEXT,
  script            JSONB,
  carousel_slides   JSONB,
  media_urls        TEXT[],
  marka_score       INTEGER,
  score_flags       JSONB,
  scheduled_at      TIMESTAMPTZ,
  published_at      TIMESTAMPTZ,
  platform_post_id  TEXT,
  status            TEXT DEFAULT 'draft' CHECK (status IN ('draft','awaiting_approval','approved','scheduled','published','failed','paused','cancelled')),
  failure_reason    TEXT,
  approved_by       UUID REFERENCES profiles(id),
  approved_at       TIMESTAMPTZ,
  ab_result         TEXT CHECK (ab_result IN ('a_won','b_won','inconclusive')),
  ab_decided_at     TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 8: post_analytics
CREATE TABLE IF NOT EXISTS post_analytics (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id               UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  likes                 INTEGER DEFAULT 0,
  comments              INTEGER DEFAULT 0,
  shares                INTEGER DEFAULT 0,
  saves                 INTEGER DEFAULT 0,
  reach                 INTEGER DEFAULT 0,
  impressions           INTEGER DEFAULT 0,
  clicks                INTEGER DEFAULT 0,
  video_views           INTEGER,
  video_completion_rate DECIMAL(5,2),
  early_velocity        INTEGER DEFAULT 0,
  conversion_rate       DECIMAL(5,2),
  recorded_at           TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 9: analytics_snapshots
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL,
  snapshot_date   DATE NOT NULL,
  followers       INTEGER,
  following       INTEGER,
  reach           INTEGER,
  impressions     INTEGER,
  engagement_rate DECIMAL(5,2),
  new_followers   INTEGER,
  posts_published INTEGER,
  avg_marka_score DECIMAL(5,2),
  raw_data        JSONB,
  UNIQUE(workspace_id, platform, snapshot_date)
);

-- TABLE 10: weekly_reports
CREATE TABLE IF NOT EXISTS weekly_reports (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  week_start   DATE NOT NULL,
  week_end     DATE NOT NULL,
  report_json  JSONB NOT NULL,
  pdf_url      TEXT,
  delivered_at TIMESTAMPTZ,
  UNIQUE(workspace_id, week_start)
);

-- TABLE 11: inbox_messages
CREATE TABLE IF NOT EXISTS inbox_messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  platform            TEXT NOT NULL,
  message_type        TEXT CHECK (message_type IN ('comment','dm','mention','review')),
  sender_name         TEXT,
  sender_platform_id  TEXT,
  message_text        TEXT,
  sentiment           TEXT CHECK (sentiment IN ('lead','negative','neutral','spam')),
  urgency_score       INTEGER CHECK (urgency_score BETWEEN 1 AND 10),
  source_post_id      UUID REFERENCES posts(id) ON DELETE SET NULL,
  ai_suggested_reply  TEXT,
  replied_at          TIMESTAMPTZ,
  replied_by          UUID REFERENCES profiles(id),
  is_resolved         BOOLEAN DEFAULT FALSE,
  lead_created        BOOLEAN DEFAULT FALSE,
  platform_message_id TEXT UNIQUE,
  received_at         TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 12: leads
CREATE TABLE IF NOT EXISTS leads (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id       UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name               TEXT,
  phone              TEXT,
  email              TEXT,
  message            TEXT,
  urgency_score      INTEGER CHECK (urgency_score BETWEEN 1 AND 10),
  stage              TEXT DEFAULT 'new' CHECK (stage IN ('new','contacted','qualified','converted','lost')),
  source_type        TEXT CHECK (source_type IN ('organic_post','paid_post','dm_keyword','bio_link','form','manual')),
  source_post_id     UUID REFERENCES posts(id) ON DELETE SET NULL,
  source_campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  source_platform    TEXT,
  inbox_message_id   UUID REFERENCES inbox_messages(id) ON DELETE SET NULL,
  visa_arc_synced    BOOLEAN DEFAULT FALSE,
  visa_arc_lead_id   TEXT,
  tags               TEXT[],
  notes              TEXT,
  contacted_at       TIMESTAMPTZ,
  converted_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 13: lead_forms (no FK to automation_flows yet)
CREATE TABLE IF NOT EXISTS lead_forms (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  fields           JSONB NOT NULL DEFAULT '[]',
  submission_count INTEGER DEFAULT 0,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 14: automation_flows
CREATE TABLE IF NOT EXISTS automation_flows (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  trigger_type     TEXT CHECK (trigger_type IN ('lead_capture','dm_keyword','manual','schedule')),
  channel          TEXT CHECK (channel IN ('whatsapp','viber','email')),
  steps            JSONB NOT NULL DEFAULT '[]',
  keyword_triggers TEXT[],
  is_active        BOOLEAN DEFAULT FALSE,
  total_triggered  INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from lead_forms to automation_flows
ALTER TABLE lead_forms
ADD COLUMN IF NOT EXISTS automation_flow_id UUID REFERENCES automation_flows(id) ON DELETE SET NULL;

-- TABLE 15: influencer_discoveries
CREATE TABLE IF NOT EXISTS influencer_discoveries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  search_query    TEXT,
  platform        TEXT,
  creator_handle  TEXT,
  creator_name    TEXT,
  follower_count  INTEGER,
  engagement_rate DECIMAL(5,2),
  brand_fit_score INTEGER CHECK (brand_fit_score BETWEEN 1 AND 100),
  topics          TEXT[],
  location        TEXT,
  outreach_status TEXT DEFAULT 'discovered' CHECK (outreach_status IN ('discovered','messaged','responded','agreed','declined')),
  outreach_message TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 16: subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier              TEXT NOT NULL CHECK (tier IN ('starter','professional','agency')),
  billing_cycle     TEXT CHECK (billing_cycle IN ('monthly','annual')),
  amount_npr        INTEGER NOT NULL,
  payment_method    TEXT CHECK (payment_method IN ('esewa','khalti','bank_transfer')),
  payment_reference TEXT UNIQUE,
  payment_verified  BOOLEAN DEFAULT FALSE,
  starts_at         TIMESTAMPTZ NOT NULL,
  ends_at           TIMESTAMPTZ NOT NULL,
  auto_renew        BOOLEAN DEFAULT TRUE,
  status            TEXT DEFAULT 'active' CHECK (status IN ('active','expired','refunded','cancelled')),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 17: festival_calendar
CREATE TABLE IF NOT EXISTS festival_calendar (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_english      TEXT NOT NULL,
  name_nepali       TEXT,
  locale            TEXT DEFAULT 'np',
  festival_date     DATE NOT NULL,
  year              INTEGER NOT NULL,
  days_before_alert INTEGER DEFAULT 21,
  campaign_angles   JSONB DEFAULT '[]',
  content_samples   JSONB DEFAULT '[]'
);

-- TABLE 18: strategy_briefs
CREATE TABLE IF NOT EXISTS strategy_briefs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start      DATE NOT NULL,
  industry        TEXT,
  locale          TEXT DEFAULT 'np',
  top_formats     JSONB DEFAULT '[]',
  algorithm_notes JSONB DEFAULT '[]',
  trending_topics JSONB DEFAULT '[]',
  avoid_topics    JSONB DEFAULT '[]',
  content_ratio   JSONB DEFAULT '{}',
  raw_research    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(week_start, industry, locale)
);

-- TABLE 19: admins
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id)
);

-- TABLE 20: post_templates
CREATE TABLE IF NOT EXISTS post_templates (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id       UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  platform           TEXT,
  post_type          TEXT,
  caption_structure  TEXT,
  carousel_structure JSONB,
  script_structure   JSONB,
  usage_count        INTEGER DEFAULT 0,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_workspace ON posts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace ON campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_inbox_workspace ON inbox_messages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_inbox_sentiment ON inbox_messages(sentiment);
CREATE INDEX IF NOT EXISTS idx_leads_workspace ON leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_visa_arc ON leads(visa_arc_synced);
CREATE INDEX IF NOT EXISTS idx_analytics_workspace_date ON analytics_snapshots(workspace_id, snapshot_date);
CREATE INDEX IF NOT EXISTS idx_post_analytics_post ON post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_workspace ON connected_accounts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_ends ON subscriptions(ends_at);
