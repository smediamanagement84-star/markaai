# MarkaAI - Quick Deploy Reference Card

## Deploy in 3 Commands

```powershell
cd C:\Users\DEll\Downloads\markaai-main
vercel login
vercel
```

That's it!

---

## What Each Command Does

### 1. `vercel login`
Opens browser, authenticates your Vercel account, saves token.
**Run once per machine.**

### 2. `vercel`
Deploys to preview URL (development).
**Get instant preview link.**

### 3. `vercel --prod` (optional)
Deploys to production domain.
**Your live site.**

---

## After First Deploy

Set environment variables in Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Click your project > Settings > Environment Variables
3. Add these 5 variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GOOGLE_GEMINI_API_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_DEV_MODE
```

4. Redeploy: `vercel --prod`

---

## Automated Deploy (Recommended)

```powershell
.\deploy-to-vercel.ps1
```

This script:
- Checks prerequisites
- Tests build locally
- Verifies authentication
- Deploys to Vercel
- Shows next steps

---

## Helpful Commands

```powershell
vercel                    # Deploy preview
vercel --prod             # Deploy production
vercel ls                 # List deployments
vercel logs [url]         # View logs
vercel whoami             # Check login status
vercel --help             # Show all commands
```

---

## Files Created for You

| File | Purpose |
|------|---------|
| `DEPLOYMENT_SUMMARY.md` | Complete deployment status |
| `VERCEL_DEPLOYMENT_GUIDE.md` | Detailed step-by-step guide |
| `deploy-to-vercel.ps1` | Automated deployment script |
| `deploy.bat` | Windows batch wrapper |
| `vercel.json` | Vercel configuration |
| `.vercelignore` | Deployment optimization |
| `QUICK_DEPLOY.md` | This file - quick reference |

---

## Need Help?

Read these in order:
1. `QUICK_DEPLOY.md` (this file) - Quick start
2. `DEPLOYMENT_SUMMARY.md` - What's done, what's needed
3. `VERCEL_DEPLOYMENT_GUIDE.md` - Detailed instructions

---

## Production Checklist

Before going live:
- [ ] Login to Vercel (`vercel login`)
- [ ] Deploy preview (`vercel`)
- [ ] Set environment variables in Vercel dashboard
- [ ] Test preview deployment
- [ ] Deploy production (`vercel --prod`)
- [ ] Update Supabase redirect URLs
- [ ] Test production deployment
- [ ] Configure custom domain (optional)

---

## Support

- Vercel Docs: https://vercel.com/docs
- Project Setup: `SETUP.md`
- Development: `DEV_GUIDE.md`

---

**Ready? Let's deploy!**

```powershell
vercel login
vercel
```
