-- Seed data for MarkaAI Dashboard

-- 1. Insert Initial Festival Calendar (Nepali & International)
INSERT INTO public.festival_calendar (name_english, name_nepali, locale, festival_date, year, days_before_alert, campaign_angles, content_samples)
VALUES 
  ('Dashain', 'दशैं', 'np', '2026-10-17', 2026, 30, '{"organic": "Focus on homecoming, blessings, and family. Promote festive offers early.", "paid": "High competition; optimize bidding 15 days prior."}'::jsonb, '{"post": "Happy Dashain to everyone celebrating! May this festival bring peace and prosperity."}'::jsonb),
  ('Tihar', 'तिहार', 'np', '2026-11-08', 2026, 20, '{"organic": "Highlight lights, sweets, and brother-sister bond.", "paid": "Run flash sales on electronics and clothing."}'::jsonb, '{"post": "Wishing you a bright and joyful Tihar!"}'::jsonb),
  ('Teej', 'तीज', 'np', '2026-09-14', 2026, 15, '{"organic": "Celebrate women, red clothing, dancing.", "paid": "Focus on women''s wear, beauty salons, and jewelry."}'::jsonb, '{"post": "Happy Haritalika Teej! Dance, sing, and celebrate."}'::jsonb),
  ('Holi', 'होली', 'np', '2026-03-03', 2026, 10, '{"organic": "Colors, spring arrival, unity.", "paid": "Promote dynamic, colorful products and events."}'::jsonb, '{"post": "May your life be as colorful as the festival of Holi!"}'::jsonb),
  ('New Year 2083', 'नयाँ वर्ष २०८३', 'np', '2026-04-14', 2026, 10, '{"organic": "New beginnings, resolutions, Nepali calendar year.", "paid": "Year-end clearance and New Year kick-off streams."}'::jsonb, '{"post": "Naya Barsha 2083 ko subhakamana!"}'::jsonb)
ON CONFLICT DO NOTHING;

-- 2. Ensure an initial system admin profile exists
-- NOTE: We spoof a UUID since Supabase handles true user objects in auth.users, 
-- but we need one for demonstration purposes in the admin table.
-- INSERT INTO public.admins (user_id)
-- VALUES ('00000000-0000-0000-0000-000000000000') 
-- ON CONFLICT DO NOTHING;

-- Log success
DO $$ BEGIN
  RAISE NOTICE 'Seed 003 complete: Festival calendar populated.';
END $$;
