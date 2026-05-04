# MarkaAI Setup Guide

## Prerequisites

- Node.js 18+ (you have v24.14.0 ✓)
- npm or yarn package manager
- Supabase account (https://supabase.com)
- Google AI API key (https://aistudio.google.com/apikey)

## Step 1: Install Dependencies

```bash
cd C:\Users\DEll\Downloads\markaai-main
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: MarkaAI
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
5. Wait for project to be created (~2 minutes)

### 2.2 Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 2.3 Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Run each migration file in order:
   - Copy contents of `supabase/migrations/001_schema.sql` and run
   - Copy contents of `supabase/migrations/002_rls.sql` and run
   - Copy contents of `supabase/migrations/003_seed.sql` and run
   - Copy contents of `supabase/migrations/004_functions_and_fix.sql` and run

## Step 3: Get Google Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Select "Create API key in new project" or choose existing project
4. Copy the generated API key

## Step 4: Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Fill in your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google Gemini AI API Key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see the MarkaAI landing page.

## Step 6: Create Your First Account

1. Click "Start Free Trial" or "Sign In"
2. Click "Sign Up" to create a new account
3. Enter your email and password
4. Check your email for verification (if Supabase email is enabled)
5. Log in and you'll be redirected to the onboarding page

## Step 7: Complete Onboarding

Follow the onboarding steps to:
1. Set up your business profile
2. Connect social media accounts (optional for now)
3. Set preferences

## Project Structure

```
markaai-main/
├── app/                    # Next.js 16 App Router
│   ├── (app)/             # Protected app routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── content/       # AI content studio
│   │   ├── campaigns/     # Campaign management
│   │   ├── inbox/         # Social inbox
│   │   ├── leads/         # Lead management
│   │   ├── analytics/     # Analytics dashboard
│   │   └── settings/      # App settings
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── api/               # API routes
│   │   └── ai/            # AI endpoints
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utilities
│   ├── supabase/         # Supabase client/server
│   ├── ai/               # AI generation logic
│   └── types/            # TypeScript types
├── supabase/             # Database migrations
└── public/               # Static assets
```

## Key Features

### 1. AI Content Studio (`/content`)
- Generate social media posts in English/Nepali
- Get Marka Score for content quality
- Visual direction suggestions
- Multi-platform support

### 2. Campaign Management (`/campaigns`)
- Create multi-platform campaigns
- Funnel strategy planning
- Campaign analytics

### 3. Lead Management (`/leads`)
- Capture leads from social media
- Lead scoring and stages
- CRM integration (Visa Arc)

### 4. Smart Inbox (`/inbox`)
- Unified social media messages
- AI-powered sentiment analysis
- Suggested replies

### 5. Analytics (`/analytics`)
- Cross-platform performance metrics
- Engagement tracking
- Weekly reports

## Troubleshooting

### Issue: "Invalid API key" error
**Solution**: Double-check your Google Gemini API key in `.env.local`

### Issue: Supabase connection errors
**Solution**:
- Verify your Supabase URL and anon key
- Check that migrations have been run
- Ensure RLS policies are enabled

### Issue: Build errors
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Issue: Authentication not working
**Solution**:
- Check Supabase Auth settings
- Verify callback URL is configured: `http://localhost:3000/auth/callback`
- Enable Email auth provider in Supabase dashboard

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
6. Click "Deploy"

### Update Supabase Callback URLs

After deployment, add your production URL to Supabase:
1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your Vercel URL to "Site URL"
3. Add `https://your-app.vercel.app/auth/callback` to "Redirect URLs"

## Next Steps

1. ✅ Set up your business profile
2. ✅ Connect social media accounts
3. ✅ Create your first campaign
4. ✅ Generate AI content
5. ✅ Track performance in Analytics

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Supabase logs for database errors
- Check browser console for frontend errors

## License

Private project - All rights reserved
