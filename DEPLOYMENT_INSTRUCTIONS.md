# MarkaAI - Vercel Deployment Instructions

## Current Status

### What We've Accomplished
✅ Vercel CLI authenticated successfully
✅ New project created: `markaai-main`
✅ All Production environment variables configured
✅ All Development environment variables configured

### The Remaining Issue

The deployment is failing with this error:
```
Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "next_public_supabase_url", which does not exist.
```

This indicates that there are **Preview** environment variables configured with old secret references that cannot be removed via the CLI.

## Solution: Manual Cleanup via Vercel Dashboard

###  Step 1: Access the Project Settings

1. Open your browser and go to: **https://vercel.com/jarus-projects-079a93e4/markaai-main/settings/environment-variables**

2. Login if needed with your Vercel account

### Step 2: Identify and Remove Problem Variables

Look for environment variables that:
- Have target "Preview"
- Show values like "Secret: next_public_supabase_url" or similar
- Are grayed out or show as referencing non-existent secrets

**Remove these variables:**
1. Click the three dots (...) next to each problematic variable
2. Select "Delete"
3. Confirm the deletion

Specifically look for and delete any **Preview** entries for:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_GEMINI_API_KEY`
- `NEXT_PUBLIC_DEV_MODE`
- `NEXT_PUBLIC_APP_URL`

### Step 3: Add Preview Variables (Optional)

If you want Preview deployments to work, add these variables for **Preview** environment:

| Variable Name | Value | Target |
|--------------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://demo.supabase.co` | Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE` | Preview |
| `GOOGLE_GEMINI_API_KEY` | `demo-key-for-testing` | Preview |
| `NEXT_PUBLIC_DEV_MODE` | `true` | Preview |
| `NEXT_PUBLIC_APP_URL` | *(leave empty - Vercel will auto-fill)* | Preview |

### Step 4: Deploy from CLI

After cleaning up the Preview variables, return to your terminal and run:

```bash
cd "C:\Users\DEll\Downloads\markaai-main"
vercel --prod
```

This will:
- Build the Next.js application
- Upload to Vercel's edge network
- Deploy to production
- Provide you with a live URL

## Alternative: Deploy via Vercel Dashboard

If CLI deployment continues to have issues:

### Option A: Git Integration (Recommended)

1. Initialize git in the project:
   ```bash
   cd "C:\Users\DEll\Downloads\markaai-main"
   git init
   git add .
   git commit -m "Initial commit for MarkaAI PWA"
   ```

2. Push to GitHub:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. In Vercel Dashboard:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and deploy

### Option B: Manual Upload

1. Create a production build locally:
   ```bash
   cd "C:\Users\DEll\Downloads\markaai-main"
   npm run build
   ```

2. Go to https://vercel.com/new

3. Drag and drop the entire project folder

## Expected Production URL

Your MarkaAI PWA will be live at:
**https://markaai-main.vercel.app**

Or possibly:
**https://markaai-main-<team-slug>.vercel.app**

## Post-Deployment Verification

Once deployed, test these features:

### 1. Basic Functionality
- [ ] Homepage loads without errors
- [ ] Navigation works across all pages
- [ ] No console errors in browser DevTools

### 2. PWA Features
- [ ] Service worker registers (Check DevTools > Application > Service Workers)
- [ ] App is installable (look for install prompt in browser address bar)
- [ ] Offline mode works:
  1. Open the app
  2. Open DevTools > Network tab
  3. Set to "Offline"
  4. Refresh page
  5. App should still work with cached content

### 3. Authentication
- [ ] Can view login page
- [ ] Demo mode works (since using demo Supabase credentials)

### 4. Dashboard
- [ ] Dashboard loads
- [ ] Demo data displays correctly
- [ ] All dashboard widgets functional

### 5. Performance
Run Lighthouse audit (DevTools > Lighthouse):
- [ ] Performance score > 80
- [ ] Accessibility score > 90
- [ ] Best Practices score > 80
- [ ] SEO score > 80
- [ ] PWA score = 100

## Troubleshooting

### If Build Fails

Check the build logs in Vercel dashboard for specific errors. Common issues:

1. **TypeScript errors**: May need to add `// @ts-ignore` comments or fix types
2. **Missing dependencies**: Ensure all packages are in `package.json`
3. **Environment variables**: Double-check all required vars are set

### If App Loads But Has Errors

1. Check browser console for JavaScript errors
2. Check Network tab for failed API calls
3. Verify environment variables are accessible (should see them in Network responses for `/api/` calls)

### If Service Worker Fails

1. Ensure HTTPS is enabled (Vercel does this automatically)
2. Check `public/sw.js` exists
3. Check `public/manifest.json` is valid JSON
4. Clear browser cache and reload

## Environment Variables Summary

### Currently Configured

**Production Environment:**
```
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...Bu4GE (demo token)
GOOGLE_GEMINI_API_KEY=demo-key-for-testing
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_APP_URL=https://markaai-main.vercel.app
```

**Development Environment:**
```
(Currently none - add same as Production if needed for local development)
```

**Preview Environment:**
```
(Needs cleanup - this is the issue!)
```

## Support Resources

- Vercel Dashboard: https://vercel.com/dashboard
- Project Settings: https://vercel.com/jarus-projects-079a93e4/markaai-main/settings
- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

## Scripts Created

1. `setup-vercel-env.ps1` - PowerShell script for Windows
2. `setup-vercel-env.js` - Node.js script using Vercel API
3. `check-vercel-env.js` - Script to inspect all environment variables
4. `fix-vercel-env.js` - Script to remove and re-add all variables
5. `DEPLOYMENT_STATUS.md` - Detailed deployment status
6. **`DEPLOYMENT_INSTRUCTIONS.md`** - This file (complete deployment guide)

## Next Steps

1. ⚠️  **Fix Preview environment variables via Vercel Dashboard** (Required)
2. 🚀 Run `vercel --prod` to deploy
3. ✅ Verify the live deployment
4. 🎉 Share the live URL!

---

**Project:** markaai-main
**Team:** jarus-projects-079a93e4
**Project ID:** prj_H0r40LNeyOXUShNsZtZR0084pjE1
**Expected URL:** https://markaai-main.vercel.app

Good luck! 🚀
