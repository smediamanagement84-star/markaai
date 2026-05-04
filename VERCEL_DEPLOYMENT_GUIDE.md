# MarkaAI - Vercel Deployment Guide

## Current Status

Vercel CLI has been successfully installed (v53.1.0). The project is ready for deployment, but authentication is required.

## Deployment Steps

### Step 1: Login to Vercel

Run this command to authenticate with Vercel:

```bash
cd C:\Users\DEll\Downloads\markaai-main
vercel login
```

This will:
- Open your browser
- Ask you to confirm the login
- Save authentication token locally

### Step 2: Deploy to Vercel (Development)

After login, run:

```bash
vercel
```

This will:
- Auto-detect Next.js framework
- Use default build settings
- Create a new project (or link to existing)
- Deploy to a preview URL
- Display the deployment URL

### Step 3: Configure Environment Variables

**CRITICAL**: You must set these environment variables in Vercel:

Go to your Vercel project dashboard > Settings > Environment Variables

Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
GOOGLE_GEMINI_API_KEY=demo-key-for-testing
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_DEV_MODE=true
```

**Note**: Replace `NEXT_PUBLIC_APP_URL` with your actual Vercel deployment URL after first deployment.

#### Using CLI to Set Environment Variables (Alternative)

```bash
# Set environment variables via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add GOOGLE_GEMINI_API_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_DEV_MODE production
```

### Step 4: Deploy to Production

Once environment variables are set and you've tested the preview deployment:

```bash
vercel --prod
```

This will deploy to your production domain.

## Project Configuration

### Next.js Configuration (next.config.js)
Already configured with:
- React Strict Mode enabled
- Server Actions with 2MB body limit
- Image optimization for Supabase domains

### Build Settings (Auto-detected by Vercel)
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 18.x or higher

### Environment Files
- `.env.local` is excluded from deployment (in .gitignore)
- Environment variables must be set in Vercel dashboard

## Deployment Architecture

```
MarkaAI Architecture
├── Frontend (Next.js 16 + React 19)
│   ├── App Router (SSR + RSC)
│   ├── Client Components (Interactive UI)
│   └── Server Actions (API logic)
├── Backend (Supabase)
│   ├── PostgreSQL Database
│   ├── Authentication (Email/Password)
│   └── Row Level Security (RLS)
├── AI Integration
│   └── Google Gemini 2.0 API
└── Deployment
    └── Vercel (Edge Network + CDN)
```

## Post-Deployment Checklist

After deployment completes:

### 1. Update Supabase Redirect URLs
Add your Vercel deployment URL to Supabase:
- Go to Supabase Dashboard > Authentication > URL Configuration
- Add to "Site URL": `https://your-app.vercel.app`
- Add to "Redirect URLs": `https://your-app.vercel.app/auth/callback`

### 2. Update Environment Variables
Update `NEXT_PUBLIC_APP_URL` in Vercel to match your deployment URL:
```bash
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://your-actual-deployment-url.vercel.app
```

### 3. Test the Deployment
Visit your deployment URL and test:
- [ ] Homepage loads correctly
- [ ] Dashboard route works
- [ ] Authentication flow (if using real Supabase)
- [ ] AI content generation (if using real Gemini key)
- [ ] Responsive design on mobile
- [ ] No console errors

### 4. Configure Custom Domain (Optional)
```bash
vercel domains add your-domain.com
```

Then add DNS records as instructed by Vercel.

## Quick Commands Reference

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-name]

# Link to existing project
vercel link

# Check which project you're linked to
vercel whoami
```

## Troubleshooting

### Build Failures

**Issue**: Build fails with module not found
**Solution**: Ensure all dependencies are in package.json
```bash
npm install
npm run build  # Test locally first
```

**Issue**: TypeScript errors during build
**Solution**: Check tsconfig.json and fix type errors
```bash
npx tsc --noEmit  # Check for type errors
```

### Environment Variable Issues

**Issue**: App can't connect to Supabase
**Solution**: Verify environment variables are set in Vercel dashboard
```bash
vercel env ls  # List all environment variables
```

**Issue**: Changes to env vars not reflected
**Solution**: Redeploy after changing environment variables
```bash
vercel --prod --force
```

### Performance Issues

**Issue**: Slow page loads
**Solution**:
- Enable Edge Runtime for API routes
- Optimize images (already configured)
- Check bundle size: `npm run build` and review output

### Authentication Issues

**Issue**: Authentication redirects fail
**Solution**: Verify Supabase redirect URLs include your Vercel domain

## Monitoring and Analytics

### Vercel Analytics (Built-in)
- Automatically tracks Web Vitals
- View in Vercel Dashboard > Analytics

### Vercel Logs
```bash
# Real-time logs
vercel logs --follow

# Specific deployment logs
vercel logs [deployment-url]
```

### Performance Monitoring
Check Lighthouse scores:
- Go to deployment URL
- Open Chrome DevTools
- Run Lighthouse audit
- Target scores: 90+ for all categories

## Cost Considerations

### Vercel Free Tier Includes:
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function execution
- Automatic HTTPS
- Global CDN

### Vercel Pro ($20/month) Adds:
- Custom domains
- More bandwidth
- Priority support
- Team collaboration

## Security Checklist

- [ ] Environment variables set in Vercel (not committed to git)
- [ ] .env files in .gitignore
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Supabase RLS policies enabled
- [ ] API keys secured in environment variables
- [ ] No sensitive data in client-side code

## Next Steps After Successful Deployment

1. Replace demo credentials with real services:
   - Set up real Supabase project
   - Get real Google Gemini API key
   - Configure proper authentication

2. Set up monitoring:
   - Enable Vercel Analytics
   - Set up error tracking (Sentry)
   - Configure uptime monitoring

3. Optimize for production:
   - Review and optimize bundle size
   - Enable caching strategies
   - Set up CDN for static assets

4. Marketing and Launch:
   - Configure SEO metadata
   - Set up social media preview images
   - Enable Google Analytics

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel CLI Reference: https://vercel.com/docs/cli

## Expected Deployment Output

When deployment succeeds, you'll see:

```
Vercel CLI 53.1.0
> Deploying markaai to production...
> Build started
> Building Next.js application
> Build completed in 2m 34s
> Deployment completed
> https://markaai-abc123.vercel.app

Production: https://markaai.vercel.app
```

---

## Ready to Deploy?

Run these commands in order:

```bash
cd C:\Users\DEll\Downloads\markaai-main
vercel login
vercel
```

Then follow the prompts. The CLI will guide you through project setup.

Good luck with your deployment!
