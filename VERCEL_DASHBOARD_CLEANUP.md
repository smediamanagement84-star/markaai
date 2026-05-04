# Vercel Dashboard Cleanup Guide - PATH A

## The Issue
Your MarkaAI project is configured but deployment fails with:
```
Error: Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "next_public_supabase_url", which does not exist.
```

This means there are Preview environment variables still referencing old Vercel Secrets that no longer exist.

## Solution: Clean Up Preview Environment Variables

### Step 1: Access Your Project Settings

1. Open your browser
2. Go to: **https://vercel.com/jarus-projects-079a93e4/markaai-main/settings/environment-variables**
3. Log in if prompted with: `smediamanagement84-9151`

### Step 2: Identify Problem Variables

Look for the **Environment Variables** table. You'll see three columns:
- **NAME**: Variable name
- **VALUE**: Shows "Secret: secret_name" or actual value
- **ENVIRONMENTS**: Shows Production, Preview, Development checkboxes

### Step 3: Find Preview Variables with Secrets

Look for rows that have:
- The **Preview** checkbox is CHECKED
- The **VALUE** column shows something like "Secret: next_public_supabase_url"

These are the problem variables. Common ones include:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_GEMINI_API_KEY`
- `NEXT_PUBLIC_DEV_MODE`
- `NEXT_PUBLIC_APP_URL`

### Step 4: Delete Preview Variables

For each problematic variable:

1. Find the row with the variable name
2. On the right side of that row, click the **three dots (⋮)** menu
3. Select **"Delete"** from the dropdown
4. When the confirmation dialog appears, confirm the deletion
5. The Preview checkbox should now be unchecked for that variable

**IMPORTANT**: Only delete the Preview environment. DO NOT delete Production or Development!

### Step 5: Visual Guide

```
╔═══════════════════════════════════════════════════════════════╗
║  Environment Variables Table                                  ║
╠═══════════════════════════════════════════════════════════════╣
║  NAME                              VALUE         ENVIRONMENTS  ║
║  --------------------------------  ------------  -------------║
║  NEXT_PUBLIC_SUPABASE_URL          Secret: ...   [✓P ✓Pv ✓D] ║
║                                                   ^--- PROBLEM║
║                                                   Click ⋮ → Delete
╚═══════════════════════════════════════════════════════════════╝

Legend:
P = Production (keep this!)
Pv = Preview (delete this!)
D = Development (keep this!)
```

### Step 6: What to Look For

**Before cleanup:**
- Preview checkbox is checked
- Shows "Secret: secret_name"
- Three dots menu on the right

**After cleanup:**
- Preview checkbox is unchecked
- Only Production and Development remain
- No more secret references in Preview

### Step 7: Verify Cleanup

After deleting all Preview variables that reference secrets:

1. Scroll through the entire environment variables list
2. Verify that NO variables have the Preview checkbox checked with secret references
3. Production and Development should still be intact

### Step 8: Deploy

Once cleanup is complete, you can deploy using one of these methods:

#### Option A: Deploy via Dashboard
1. Go to: https://vercel.com/jarus-projects-079a93e4/markaai-main
2. Click the **"Deployments"** tab
3. Click **"Deploy"** button
4. Select the **"Production"** branch
5. Click **"Deploy"**

#### Option B: Deploy via CLI (if available)
Open PowerShell or Command Prompt in your project directory:
```bash
cd "C:\Users\DEll\Downloads\markaai-main"
vercel --prod
```

## Alternative: Complete Environment Reset

If you want to start fresh with Preview variables:

### Option 1: Add New Preview Variables (Without Secrets)

For each variable, add it back for Preview environment:

1. Click **"Add New"** button at the top
2. Enter variable details:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://demo.supabase.co`
   - **Environments**: Check only **Preview**
3. Click **"Save"**

Repeat for all variables:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE`
- `GOOGLE_GEMINI_API_KEY` = `demo-key-for-testing`
- `NEXT_PUBLIC_DEV_MODE` = `true`
- `NEXT_PUBLIC_APP_URL` = (leave empty or use your preview URL)

## Troubleshooting

### Can't Find Environment Variables Page?
- URL: https://vercel.com/jarus-projects-079a93e4/markaai-main/settings/environment-variables
- Or: Dashboard → Your Project → Settings → Environment Variables

### Don't See Preview Checkbox?
- Click on the variable name to expand it
- You'll see the environments it's applied to

### Accidentally Deleted Production Variables?
Don't worry! Re-add them:
1. Click "Add New"
2. Enter the variable name and value
3. Check "Production" and "Development"
4. Click "Save"

### Still Getting Error After Cleanup?
Try:
1. Wait 1-2 minutes for Vercel to sync
2. Refresh the environment variables page
3. Verify all Preview variables are gone
4. Try deploying again

## Expected Results

After successful cleanup and deployment:
- Build completes without errors
- Production URL: **https://markaai-main.vercel.app** or similar
- Site is live and accessible
- All features work in production

## Next Steps After Deployment

See `DEPLOYMENT_COMPLETE.md` for:
- Testing checklist
- Post-deployment verification
- Performance monitoring
- Future deployment workflow

---

**Need help?** Check the `DEPLOYMENT_SUMMARY.md` file or reach out to Vercel support.
