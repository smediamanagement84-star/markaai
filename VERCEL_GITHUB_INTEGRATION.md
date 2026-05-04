# Vercel GitHub Integration Guide

## Overview
Connect your MarkaAI GitHub repository to Vercel for automatic deployments. Every push to the main branch will automatically deploy to production.

## Prerequisites
- ✅ GitHub repository created (see `GITHUB_SETUP.md`)
- ✅ Code pushed to GitHub
- ✅ Vercel account (you have: `smediamanagement84-9151`)

## Part 1: Import Project to Vercel

### Step 1: Go to Vercel Dashboard

1. Open your browser
2. Go to: **https://vercel.com/new**
3. Log in if prompted

### Step 2: Import Git Repository

You'll see three options:
- Import Git Repository
- Clone Template
- Deploy a sample

**Select: "Import Git Repository"**

### Step 3: Connect GitHub Account (if needed)

If you haven't connected GitHub yet:
1. Click **"Connect GitHub Account"**
2. You'll be redirected to GitHub
3. Click **"Authorize Vercel"**
4. Select which repositories Vercel can access:
   - **All repositories** (easier), or
   - **Only select repositories** → Choose `markaai`
5. Click **"Install & Authorize"**

### Step 4: Import Your Repository

1. You should now see a list of your GitHub repositories
2. Find **"markaai"** in the list
3. Click **"Import"** next to it

### Step 5: Configure Project

Vercel will auto-detect your Next.js project. Configure these settings:

#### Framework Preset
- Should auto-detect: **Next.js**
- Leave as detected

#### Project Name
```
markaai
```
(or `markaai-main` if you want to match existing project)

#### Root Directory
- Leave as: `./` (root)

#### Build and Output Settings
Vercel auto-detects these from your `package.json`:
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

**Do not change these** - Vercel detects them correctly.

## Part 2: Configure Environment Variables

This is the most important step!

### Step 6: Add Environment Variables

Still on the import page, scroll down to **"Environment Variables"** section.

Click **"Add"** for each variable:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://demo.supabase.co
Environments: Production, Preview, Development (check all three)
```

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
Environments: Production, Preview, Development (check all three)
```

#### Variable 3: GOOGLE_GEMINI_API_KEY
```
Name: GOOGLE_GEMINI_API_KEY
Value: demo-key-for-testing
Environments: Production, Preview, Development (check all three)
```

#### Variable 4: NEXT_PUBLIC_DEV_MODE
```
Name: NEXT_PUBLIC_DEV_MODE
Value: true
Environments: Production, Preview, Development (check all three)
```

#### Variable 5: NEXT_PUBLIC_APP_URL
```
Name: NEXT_PUBLIC_APP_URL
Value: (leave empty for now - will auto-populate with your Vercel URL)
Environments: Production, Preview, Development (check all three)
```

### Step 7: Deploy!

1. Review all settings
2. Click the big **"Deploy"** button
3. Vercel will:
   - Clone your repository
   - Install dependencies
   - Build your Next.js app
   - Deploy to their edge network

This takes about 2-5 minutes.

## Part 3: Monitor Deployment

### Step 8: Watch Build Progress

After clicking Deploy, you'll see:
- Build logs streaming in real-time
- Progress indicators
- Any errors or warnings

### What to Look For:
```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
✓ Build completed
```

### Common Build Issues:

#### TypeScript Errors
If you see TypeScript errors:
- These are warnings that can be ignored for now
- Or fix them in your code and push again

#### Missing Environment Variables
If build fails with "Missing environment variable":
- Go to Project Settings → Environment Variables
- Add the missing variable
- Click "Redeploy" from the Deployments tab

#### Out of Memory
If you see "JavaScript heap out of memory":
- This is rare but can happen
- Vercel usually auto-retries
- If persistent, contact Vercel support

## Part 4: Access Your Live Site

### Step 9: Get Your Production URL

After successful deployment:

1. You'll see a success screen with:
   - **Production URL**: `https://markaai.vercel.app` (or similar)
   - Screenshot preview
   - "Visit" button

2. Click **"Visit"** or copy the URL

3. Your site is now LIVE!

### Step 10: Verify Deployment

Test these pages:

- [ ] Homepage: `https://your-url.vercel.app/`
- [ ] Dashboard: `https://your-url.vercel.app/dashboard`
- [ ] Auth: `https://your-url.vercel.app/auth`
- [ ] Reports: `https://your-url.vercel.app/reports`
- [ ] Settings: `https://your-url.vercel.app/settings`

### Step 11: Test PWA Features

1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Service Workers** - should show registered
4. Check **Manifest** - should show app details
5. Test offline mode:
   - Go to **Network** tab
   - Set to **Offline**
   - Reload page - should still work

## Part 5: Set Up Automatic Deployments

### How It Works

Now that GitHub is connected:

**Production Deployments:**
- Every push to `main` branch → Automatic production deployment
- Or merge pull request → Triggers production deployment

**Preview Deployments:**
- Every push to other branches → Creates preview deployment
- Every pull request → Creates unique preview URL
- Comments on PR with preview link

### Step 12: Configure Deployment Settings

1. Go to: **Project Settings → Git**
2. Configure:

**Production Branch:**
```
main
```

**Deploy Hooks:**
- Enable if you want to trigger deployments via API

**Ignored Build Step:**
```
(leave empty to build every time)
```

## Part 6: Custom Domain (Optional)

### Add Your Own Domain

If you have a custom domain:

1. Go to: **Project Settings → Domains**
2. Click **"Add"**
3. Enter your domain: `yourdomain.com`
4. Follow DNS configuration instructions
5. Vercel provides:
   - Automatic HTTPS
   - SSL certificate
   - Global CDN

### Example DNS Settings:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Part 7: Collaboration Features

### Add Team Members

1. Go to: **Project Settings → Team**
2. Click **"Invite"**
3. Enter email addresses
4. Set role: Developer, Viewer, or Owner

### Environment Variable Security

**Production variables:**
- Only visible to team members with access
- Not exposed in preview builds
- Encrypted at rest

**Preview variables:**
- Use demo values
- Safe for public preview links

## Part 8: Monitoring and Analytics

### Built-in Vercel Analytics

1. Go to: **Analytics** tab
2. See:
   - Real-time visitors
   - Page views
   - Top pages
   - Geographic distribution

### Deployment History

1. Go to: **Deployments** tab
2. See all deployments:
   - Production deployments
   - Preview deployments
   - Build times
   - Commit messages

### Build Logs

For any deployment:
1. Click on deployment
2. View **Build Logs**
3. See detailed build output
4. Debug any issues

## Part 9: CI/CD Workflow

### Your New Workflow

```
┌─────────────┐
│  Code on    │
│  Computer   │
└──────┬──────┘
       │ git push
       ↓
┌─────────────┐
│   GitHub    │
│ Repository  │
└──────┬──────┘
       │ webhook
       ↓
┌─────────────┐
│   Vercel    │
│   Builds    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│    Live     │
│    Site     │
└─────────────┘
```

### Example Development Flow

1. **Make changes locally**
```bash
# Edit your code
code app/dashboard/page.tsx
```

2. **Test locally**
```bash
npm run dev
# Test at http://localhost:3000
```

3. **Commit and push**
```bash
git add .
git commit -m "Update dashboard layout"
git push origin main
```

4. **Automatic deployment**
- Vercel detects push
- Builds automatically
- Deploys to production
- You get notification email

5. **Verify live**
- Visit your production URL
- Changes are live!

### Using Preview Deployments

1. **Create feature branch**
```bash
git checkout -b feature/new-feature
```

2. **Make changes and push**
```bash
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

3. **Create pull request on GitHub**
- Go to GitHub
- Click "Compare & pull request"
- Add description
- Create pull request

4. **Automatic preview**
- Vercel comments on PR with preview URL
- Test feature on preview URL
- Share with team for review

5. **Merge to deploy**
- Merge pull request on GitHub
- Vercel deploys to production
- Preview deployments are kept for 30 days

## Part 10: Advanced Configuration

### Custom Build Settings

Edit `vercel.json` for advanced config:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Edge Functions

Your API routes automatically become Edge Functions:
- Run at Vercel Edge locations
- Low latency worldwide
- Automatic scaling

### Serverless Functions

Located in `app/api/`:
- Each route is a serverless function
- Automatic scaling
- Pay only for execution time

## Troubleshooting

### Deployment Failed

1. Check build logs for errors
2. Common fixes:
   - Add missing environment variables
   - Fix TypeScript errors
   - Check package.json scripts

### Environment Variables Not Working

1. Go to Project Settings → Environment Variables
2. Verify values are correct
3. Check which environments are selected
4. Redeploy to apply changes

### Site Not Updating

1. Check Deployments tab
2. Verify latest commit is deployed
3. Clear browser cache
4. Try incognito/private mode

### GitHub Connection Lost

1. Go to Project Settings → Git
2. Reconnect repository
3. Or delete project and re-import

## Success Checklist

After completing this guide:

- [ ] GitHub repository connected to Vercel
- [ ] Project deployed successfully
- [ ] Production URL is accessible
- [ ] All pages load correctly
- [ ] PWA features work (service worker, manifest)
- [ ] Environment variables configured
- [ ] Automatic deployments working (test with a push)
- [ ] Team members invited (if applicable)
- [ ] Custom domain added (if applicable)

## Next Steps

1. **Update Your Environment Variables**
   - Replace demo values with real API keys
   - Add production Supabase credentials
   - Add real Gemini API key

2. **Set Up Real Authentication**
   - Configure Supabase auth
   - Set up OAuth providers
   - Configure email templates

3. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor build times
   - Optimize if needed

4. **Implement CI/CD Best Practices**
   - Use pull requests for all changes
   - Review preview deployments before merging
   - Keep main branch stable

## Resources

- Vercel Docs: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- GitHub Integration: https://vercel.com/docs/git/vercel-for-github
- Environment Variables: https://vercel.com/docs/environment-variables

---

**Congratulations!** You now have a fully automated deployment pipeline for MarkaAI!

Every code change you push to GitHub will automatically deploy to production. 🚀
