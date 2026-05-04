-- Migration 004: Functions and Fixes
-- This migration adds the necessary database functions for tracking AI usage and other transactional operations.

-- 1. Create increment_ai_count function
-- This allows atomical increments of the ai_generation_count column without race conditions.
CREATE OR REPLACE FUNCTION public.increment_ai_count(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET ai_generation_count = ai_generation_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Add comment for clarity
COMMENT ON FUNCTION public.increment_ai_count IS 'Increments the AI generation counter for a specific user ID.';

-- 3. (Optional) Any other missing functions or fixes
-- Example: ensure handle_new_user is robust
-- Already exists in 001_schema.sql, but we can make sure it handles existing profiles.
