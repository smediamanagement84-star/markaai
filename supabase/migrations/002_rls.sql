-- MarkaAI RLS Policies
-- Enable RLS on all tables

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE festival_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_templates ENABLE ROW LEVEL SECURITY;

-- Own data policies
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_subscriptions" ON subscriptions FOR ALL USING (auth.uid() = user_id);

-- Workspace ownership
CREATE POLICY "workspace_owner" ON workspaces FOR ALL USING (owner_id = auth.uid());

-- Workspace member access helper function
CREATE OR REPLACE FUNCTION user_workspace_ids()
RETURNS SETOF UUID AS $$
  SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Member access policies
CREATE POLICY "member_access_members" ON workspace_members FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_business_profiles" ON business_profiles FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_campaigns" ON campaigns FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_posts" ON posts FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_post_analytics" ON post_analytics FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_analytics_snapshots" ON analytics_snapshots FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_weekly_reports" ON weekly_reports FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_inbox" ON inbox_messages FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_leads" ON leads FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_lead_forms" ON lead_forms FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_automation_flows" ON automation_flows FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_influencers" ON influencer_discoveries FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);
CREATE POLICY "member_access_templates" ON post_templates FOR ALL USING (
  workspace_id IN (SELECT user_workspace_ids())
);

-- Owner-only for sensitive settings
CREATE POLICY "owner_only_connected_accounts" ON connected_accounts FOR ALL USING (
  workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
);

-- Public read for festival calendar and strategy briefs
CREATE POLICY "public_festivals" ON festival_calendar FOR SELECT USING (true);
CREATE POLICY "public_strategy_briefs" ON strategy_briefs FOR SELECT USING (true);

-- Admins
CREATE POLICY "admin_own" ON admins FOR ALL USING (auth.uid() = user_id);
