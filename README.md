# MarkaAI - Social Media Marketing Platform for Nepali Businesses

AI-powered social media management platform designed specifically for Nepali businesses. Generate bilingual content, manage campaigns, capture leads, and track performance across multiple platforms.

## 🚀 Key Features

- **AI Content Studio** - Generate posts in English/Nepali with Marka Score quality ratings
- **Campaign Management** - Plan and execute multi-platform marketing funnels
- **Lead Capture & CRM** - Track leads from awareness to conversion
- **Smart Inbox** - Unified inbox with AI-powered sentiment analysis
- **Analytics Dashboard** - Cross-platform performance tracking
- **Nepal-Specific Tools** - Festival calendar, NPR pricing, local integrations

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Google Gemini 2.0
- **UI Components**: Radix UI, Recharts
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account
- Google Gemini API key

## 🏁 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local` and fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_GEMINI_API_KEY=your-gemini-key
```

### 3. Set Up Database

Run the migrations in Supabase SQL Editor (in order):
- `supabase/migrations/001_schema.sql`
- `supabase/migrations/002_rls.sql`
- `supabase/migrations/003_seed.sql`
- `supabase/migrations/004_functions_and_fix.sql`

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 🚢 Deployment

Deploy to Vercel:

```bash
vercel
```

Don't forget to add environment variables in Vercel dashboard and update Supabase callback URLs.

## 📁 Project Structure

```
├── app/              # Next.js App Router
├── components/       # React components
├── lib/             # Utilities & types
├── supabase/        # Database migrations
└── public/          # Static assets
```

## 🤝 Support

For setup help, check [SETUP.md](./SETUP.md) troubleshooting section.
