# MarkaAI - Developer Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 24+ installed
- npm or yarn package manager
- Basic knowledge of Next.js and React

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:3000
```

---

## 🔑 Demo Mode (Current Setup)

The app is currently configured for **demo mode** - no real API keys or database required!

### What Works in Demo Mode:
- ✅ Full navigation and UI
- ✅ Authentication pages (visual only, no real auth)
- ✅ AI content generation (mock responses)
- ✅ Dashboard with realistic data
- ✅ Content studio with sample posts
- ✅ All pages accessible

### Demo Mode Configuration
In `.env.local`:
```bash
NEXT_PUBLIC_DEV_MODE=true
```

When `true`:
- Bypasses Supabase authentication
- Uses mock data from `lib/mock-data.ts`
- AI generation returns contextual dummy content
- All pages render with sample data

---

## 🔐 Authentication System

### Available Routes

| Route | Description | Features |
|-------|-------------|----------|
| `/login` | Sign in page | Email/password, remember me, show/hide password |
| `/signup` | Registration | Password validation, real-time feedback |
| `/forgot-password` | Password reset request | Email-based reset flow |
| `/reset-password` | New password setup | Secure password update |
| `/auth/callback` | OAuth callback handler | Token exchange |

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Authentication Flow

```
User Signs Up → Email Confirmation → Login → Dashboard
```

In demo mode, you can access `/dashboard` directly without authentication.

---

## 📁 Project Structure

```
markaai-main/
├── app/
│   ├── (app)/              # Protected app pages
│   │   ├── dashboard/      # Main dashboard
│   │   ├── content/        # Content studio
│   │   │   └── new/        # AI post generation
│   │   ├── campaigns/      # Campaign management
│   │   ├── inbox/          # Message inbox
│   │   ├── leads/          # Lead tracking
│   │   ├── analytics/      # Performance analytics
│   │   ├── settings/       # User settings
│   │   └── billing/        # Subscription management
│   ├── (auth)/             # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api/                # API routes
│   │   └── ai/             # AI generation endpoints
│   ├── auth/               # Auth callbacks
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   └── layout/
│       └── Sidebar.tsx     # App navigation
├── lib/
│   ├── supabase/           # Supabase client setup
│   ├── ai/                 # AI generation logic
│   ├── mock-data.ts        # Demo mode data
│   └── types/              # TypeScript types
├── .env.local              # Environment variables
└── package.json
```

---

## 🎨 Styling System

### Design Tokens (from `globals.css`)

```css
/* Colors */
--bg:           #0a0b0f     /* Dark background */
--bg-card:      #111318     /* Card background */
--text:         #f0f1f5     /* Primary text */
--text-muted:   #6b7280     /* Secondary text */
--accent:       #4f5ef7     /* Primary brand color */
--green:        #10b981     /* Success */
--red:          #ef4444     /* Error */
--gold:         #f59e0b     /* Warning/Premium */
```

### Component Classes

```css
.card           /* Elevated card component */
.btn            /* Base button */
.btn-primary    /* Primary action button */
.btn-secondary  /* Secondary button */
.btn-ghost      /* Minimal button */
.input          /* Text input field */
.label          /* Form label */
.badge          /* Status badge */
.spinner        /* Loading spinner */
```

### Usage Example

```tsx
<div className="card" style={{ padding: 24 }}>
  <h2>Title</h2>
  <button className="btn btn-primary">
    Click Me
  </button>
</div>
```

---

## 🤖 AI Content Generation

### How It Works

1. **With Real API Key**: Uses Google Gemini AI
2. **Without API Key (Demo)**: Returns contextual mock content

### Mock Generation Example

```typescript
// In demo mode, this generates realistic dummy content
const result = await fetch('/api/ai/generate-post', {
  method: 'POST',
  body: JSON.stringify({
    businessType: 'Coffee Shop',
    platform: 'instagram',
    topic: 'New menu launch',
    language: 'english'
  })
})
```

### Mock Response
```json
{
  "caption": "Exciting news! Our new menu is here...",
  "hashtags": ["CoffeeShop", "Nepal", "Kathmandu"],
  "visualDirection": "High-quality feed_post showing...",
  "markaScore": 87,
  "scoreFlags": ["Strong hook...", "Consider adding urgency"]
}
```

---

## 📊 Mock Data

All mock data is in `lib/mock-data.ts`:

- **MOCK_USER**: Demo user profile
- **MOCK_CAMPAIGNS**: 3 sample campaigns
- **MOCK_POSTS**: 4 sample social media posts
- **MOCK_LEADS**: 3 sales leads
- **MOCK_INBOX_MESSAGES**: 3 DMs with AI replies
- **MOCK_ANALYTICS**: Platform statistics

### Using Mock Data

```typescript
import { getMockData } from '@/lib/mock-data'

const posts = getMockData('posts')
const leads = getMockData('leads')
const analytics = getMockData('analytics')
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Supabase (currently using demo values)
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-key...

# AI Generation (currently using demo value)
GOOGLE_GEMINI_API_KEY=demo-key-for-testing

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_MODE=true  # Set to false for production

# Optional
RESEND_API_KEY=  # For transactional emails
```

### To Use Real Services

1. **Supabase Setup**:
   ```bash
   # Create project at https://supabase.com
   # Copy your project URL and anon key
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   ```

2. **Google AI Setup**:
   ```bash
   # Get API key from https://makersuite.google.com
   GOOGLE_GEMINI_API_KEY=your-api-key
   ```

3. **Disable Demo Mode**:
   ```bash
   NEXT_PUBLIC_DEV_MODE=false
   ```

---

## 🧪 Testing Features

### Test Authentication Flow
1. Go to `/signup`
2. Fill form (any email in demo mode)
3. See password validation in real-time
4. Submit → See success screen
5. Go to `/login`
6. Check "Remember me"
7. Enter credentials
8. See dashboard

### Test AI Generation
1. Go to `/content/new`
2. Select platform (Instagram)
3. Enter topic: "Coffee special offer"
4. Click "Generate Post"
5. Wait ~800ms (simulated delay)
6. See generated caption with Marka Score
7. Click "Save as Draft"
8. Navigate to `/content` to see saved post

### Test Navigation
- Click sidebar items
- All routes load without errors
- Back button works correctly
- Logout redirects to login

---

## 🐛 Debugging

### Check Dev Mode Status
```typescript
console.log('Dev Mode:', process.env.NEXT_PUBLIC_DEV_MODE)
```

### Common Issues

**Issue**: "Unauthorized" error
- **Solution**: Ensure `NEXT_PUBLIC_DEV_MODE=true` in `.env.local`

**Issue**: AI generation fails
- **Solution**: Check if API key is valid or use demo mode

**Issue**: Pages show no data
- **Solution**: Verify mock data is being loaded in dev mode

**Issue**: Build errors
- **Solution**: Run `npm install` to ensure all dependencies are installed

---

## 📦 Build & Deploy

### Local Build
```bash
npm run build
npm run start
```

### Production Checklist
- [ ] Set real Supabase credentials
- [ ] Add real Gemini API key
- [ ] Set `NEXT_PUBLIC_DEV_MODE=false`
- [ ] Run `npm run build` successfully
- [ ] Test auth with real email
- [ ] Configure email templates
- [ ] Set up monitoring

### Deployment Platforms
- **Vercel** (recommended): One-click deploy
- **Netlify**: Supports Next.js
- **AWS**: Full control
- **Railway**: Simple deployment

---

## 🔐 Security Notes

### Current Status
- ✅ Password validation implemented
- ✅ Secure session management (Supabase)
- ✅ Environment variables protected
- ✅ Auth middleware active
- ⚠️ NPM audit shows 97 vulnerabilities (mostly dev deps)

### Before Production
1. Run `npm audit fix`
2. Add rate limiting on auth routes
3. Configure CSRF protection
4. Set up Content Security Policy
5. Enable Supabase RLS policies
6. Add error monitoring (Sentry)

---

## 💡 Tips & Tricks

### Hot Reload
Next.js automatically reloads on file changes. If it stops:
```bash
# Restart dev server
npm run dev
```

### Clear Cache
```bash
# Remove build artifacts
rm -rf .next
npm run dev
```

### Check TypeScript Errors
```bash
npx tsc --noEmit
```

### Format Code
```bash
# Using Prettier (if installed)
npx prettier --write .
```

---

## 📚 Key Libraries

| Library | Purpose | Docs |
|---------|---------|------|
| Next.js 16 | React framework | [docs](https://nextjs.org/docs) |
| React 19 | UI library | [docs](https://react.dev) |
| TypeScript | Type safety | [docs](https://typescriptlang.org) |
| Tailwind CSS | Styling | [docs](https://tailwindcss.com) |
| Supabase | Backend/Auth | [docs](https://supabase.com/docs) |
| Lucide React | Icons | [docs](https://lucide.dev) |
| Google AI | AI generation | [docs](https://ai.google.dev) |

---

## 🤝 Contributing

### Code Style
- Use TypeScript for new files
- Follow existing naming conventions
- Add comments for complex logic
- Keep components small and focused

### File Naming
- Pages: `page.tsx`
- Components: `ComponentName.tsx`
- Utils: `kebab-case.ts`
- Types: `database.ts`, `types.ts`

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push and create PR
git push origin feature/your-feature
```

---

## 📞 Need Help?

### Resources
- **Documentation**: See `TESTING_REPORT.md` for detailed changes
- **Issues**: Check existing issues or create new one
- **Code**: Well-commented, read inline documentation

### Common Questions

**Q: How do I add a new page?**
A: Create `app/(app)/your-page/page.tsx` and add to sidebar navigation

**Q: How do I customize colors?**
A: Edit CSS variables in `app/globals.css`

**Q: How do I add new mock data?**
A: Edit `lib/mock-data.ts` and add to `getMockData()` function

**Q: Can I use this in production?**
A: Yes, but follow the production checklist above first

---

**Version**: 1.0.0
**Last Updated**: May 4, 2026
**Maintained by**: RIRI Development Team
