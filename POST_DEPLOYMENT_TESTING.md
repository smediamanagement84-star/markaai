# MarkaAI - Post-Deployment Testing Checklist

**Use this checklist after deploying to verify everything works correctly.**

---

## 🔗 Production URL
Record your live URL here: ___________________________________

---

## 1. Basic Site Access ✓

### Homepage
- [ ] Site loads without errors
- [ ] Logo displays correctly
- [ ] Navigation menu works
- [ ] Hero section displays
- [ ] CTA buttons functional
- [ ] Footer displays
- [ ] No console errors (press F12 → Console)

**Test URL:** `https://your-url.vercel.app/`

---

## 2. Authentication Flow ✓

### Sign Up Page
- [ ] Page loads: `/auth?view=sign-up`
- [ ] Form displays correctly
- [ ] Can enter email and password
- [ ] Validation messages appear
- [ ] "Sign Up" button works
- [ ] Link to sign-in works

### Sign In Page
- [ ] Page loads: `/auth?view=sign-in`
- [ ] Form displays correctly
- [ ] Can enter credentials
- [ ] "Sign In" button works
- [ ] "Forgot password" link works
- [ ] Link to sign-up works

### Demo Mode
- [ ] "Try Demo" button visible
- [ ] Clicking loads dashboard with demo data
- [ ] Demo banner appears (showing it's demo mode)

**Test URLs:**
- Sign Up: `https://your-url.vercel.app/auth?view=sign-up`
- Sign In: `https://your-url.vercel.app/auth?view=sign-in`

---

## 3. Dashboard ✓

### Layout
- [ ] Dashboard loads: `/dashboard`
- [ ] Sidebar navigation visible
- [ ] Top navigation bar present
- [ ] Main content area displays
- [ ] User menu accessible

### Widgets
- [ ] Overview cards display (metrics)
- [ ] Recent activity section loads
- [ ] Quick actions menu works
- [ ] Charts render (if demo mode)
- [ ] Data displays correctly

### Navigation
- [ ] Can click sidebar menu items
- [ ] Pages transition smoothly
- [ ] Active page highlighted
- [ ] Mobile menu works (test on mobile)

**Test URL:** `https://your-url.vercel.app/dashboard`

---

## 4. Campaign Management ✓

### Campaigns Page
- [ ] Page loads: `/dashboard/campaigns`
- [ ] Campaign list displays
- [ ] "Create Campaign" button works
- [ ] Can view campaign details
- [ ] Campaign cards render correctly
- [ ] Filters work (if implemented)

### Create Campaign
- [ ] Modal/page opens
- [ ] Form fields display
- [ ] Can enter campaign details
- [ ] Validation works
- [ ] Submit button functional
- [ ] Success message appears

**Test URL:** `https://your-url.vercel.app/dashboard/campaigns`

---

## 5. Content Generation ✓

### Content Page
- [ ] Page loads: `/dashboard/content`
- [ ] AI content form displays
- [ ] Can select content type
- [ ] Language selector works (English/Nepali)
- [ ] Tone selector works
- [ ] "Generate" button functional
- [ ] Loading state shows
- [ ] Generated content displays

### Content History
- [ ] Previous content shows
- [ ] Can edit content
- [ ] Can delete content
- [ ] Can copy to clipboard
- [ ] Pagination works (if many items)

**Test URL:** `https://your-url.vercel.app/dashboard/content`

---

## 6. Lead Management ✓

### Leads Page
- [ ] Page loads: `/dashboard/leads`
- [ ] Lead list displays
- [ ] Lead cards render
- [ ] Contact information shows
- [ ] "Add Lead" button works
- [ ] Search/filter functional

### Lead Details
- [ ] Can click on a lead
- [ ] Detail view opens
- [ ] All information displays
- [ ] Notes section works
- [ ] Can edit lead
- [ ] Can delete lead

**Test URL:** `https://your-url.vercel.app/dashboard/leads`

---

## 7. Inbox ✓

### Messages View
- [ ] Page loads: `/dashboard/inbox`
- [ ] Message list displays
- [ ] Unread count shows
- [ ] Conversation threads visible
- [ ] Sentiment indicators work (if demo)
- [ ] Platform icons display

### Message Details
- [ ] Can open a conversation
- [ ] Message thread displays
- [ ] Timestamps visible
- [ ] Reply box functional
- [ ] Can mark as read/unread
- [ ] Can archive/delete

**Test URL:** `https://your-url.vercel.app/dashboard/inbox`

---

## 8. Analytics & Reports ✓

### Analytics Dashboard
- [ ] Page loads: `/dashboard/analytics`
- [ ] Charts render correctly
- [ ] Data displays (even if demo)
- [ ] Date range selector works
- [ ] Metrics cards show data
- [ ] Export buttons functional

### Reports
- [ ] Can generate reports
- [ ] Report types available
- [ ] Preview displays correctly
- [ ] Download works (PDF/CSV)
- [ ] Email report option (if enabled)

**Test URL:** `https://your-url.vercel.app/dashboard/analytics`

---

## 9. Settings ✓

### Profile Settings
- [ ] Page loads: `/dashboard/settings`
- [ ] Profile form displays
- [ ] Can edit name/email
- [ ] Avatar upload works
- [ ] Save changes button functional
- [ ] Success notification appears

### Account Settings
- [ ] Password change form works
- [ ] Email notifications toggle
- [ ] Preferences save correctly
- [ ] Language selection works
- [ ] Timezone selection works

### Business Settings
- [ ] Business info form displays
- [ ] Can update business details
- [ ] Logo upload works
- [ ] Social media links save
- [ ] API keys section (if needed)

**Test URL:** `https://your-url.vercel.app/dashboard/settings`

---

## 10. PWA Features ✓

### Service Worker
- [ ] Open DevTools (F12)
- [ ] Go to Application tab
- [ ] Service Workers section shows registered worker
- [ ] Status: "Activated and running"
- [ ] No errors in console

### Manifest
- [ ] Still in Application tab
- [ ] Go to Manifest section
- [ ] App name displays: "MarkaAI"
- [ ] Icons load correctly
- [ ] Theme color set
- [ ] Start URL correct

### Installability
- [ ] Install prompt appears (in browser address bar)
- [ ] Can click "Install" button
- [ ] App installs successfully
- [ ] Desktop/mobile icon created
- [ ] Opens in standalone window
- [ ] Looks like native app

### Offline Mode
- [ ] Open DevTools → Network tab
- [ ] Select "Offline" from dropdown
- [ ] Reload page
- [ ] Page loads from cache
- [ ] Basic functionality works
- [ ] Offline indicator appears (if implemented)

---

## 11. Performance Testing ✓

### Lighthouse Audit
- [ ] Open DevTools (F12)
- [ ] Go to Lighthouse tab
- [ ] Select all categories
- [ ] Device: Mobile & Desktop
- [ ] Run audit

**Target Scores:**
- **Performance:** > 80
- **Accessibility:** > 90
- **Best Practices:** > 90
- **SEO:** > 80
- **PWA:** > 90

### Load Times
- [ ] Homepage loads < 3 seconds
- [ ] Dashboard loads < 3 seconds
- [ ] Navigation between pages < 1 second
- [ ] Images load progressively
- [ ] No layout shift (CLS)

### Network Throttling
- [ ] DevTools → Network → Fast 3G
- [ ] Page still loads reasonably
- [ ] Loading indicators show
- [ ] No timeouts
- [ ] Graceful degradation

---

## 12. Mobile Responsiveness ✓

### Mobile View (< 768px)
- [ ] Open DevTools → Toggle device toolbar
- [ ] Select mobile device (iPhone/Android)
- [ ] Homepage displays correctly
- [ ] Navigation collapses to menu
- [ ] Content stacks vertically
- [ ] Buttons are tappable
- [ ] Forms are usable
- [ ] No horizontal scroll

### Tablet View (768px - 1024px)
- [ ] Switch to tablet size
- [ ] Layout adapts appropriately
- [ ] Sidebar behavior correct
- [ ] Content readable
- [ ] Touch targets adequate

### Desktop View (> 1024px)
- [ ] Full desktop size
- [ ] Sidebar expanded
- [ ] Multi-column layouts work
- [ ] Charts display properly
- [ ] No wasted space

---

## 13. Cross-Browser Testing ✓

### Chrome/Edge (Chromium)
- [ ] Site loads correctly
- [ ] All features work
- [ ] PWA installable
- [ ] No console errors

### Firefox
- [ ] Site loads correctly
- [ ] Layout consistent
- [ ] Features functional
- [ ] PWA works

### Safari (if accessible)
- [ ] Site loads correctly
- [ ] iOS compatibility
- [ ] Add to Home Screen works
- [ ] No webkit-specific issues

---

## 14. Security Checks ✓

### HTTPS
- [ ] Site uses HTTPS (padlock icon)
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] Secure connection established

### Headers
- [ ] Open DevTools → Network
- [ ] Click any request
- [ ] Check Response Headers
- [ ] Verify these are present:
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-XSS-Protection: 1; mode=block`
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`

### Authentication
- [ ] Can't access dashboard without login
- [ ] Auth redirects work
- [ ] Session persists correctly
- [ ] Logout works
- [ ] Tokens not exposed in URLs

---

## 15. API Routes Testing ✓

### Content Generation API
- [ ] Test: Generate content via UI
- [ ] Response received
- [ ] Correct format
- [ ] Error handling works
- [ ] Rate limiting (if implemented)

### Analytics API
- [ ] Test: Load analytics page
- [ ] Data fetched successfully
- [ ] Correct JSON format
- [ ] Date range filters work
- [ ] Aggregations correct

### Test via DevTools
- [ ] Open Network tab
- [ ] Trigger API calls
- [ ] Check response status (200 OK)
- [ ] Verify response data
- [ ] Check for errors

---

## 16. Error Handling ✓

### 404 Page
- [ ] Visit non-existent page
- [ ] Custom 404 page displays
- [ ] "Go home" button works
- [ ] Design consistent with site

### Error Boundaries
- [ ] Errors don't crash entire app
- [ ] Error message displays
- [ ] Can recover gracefully
- [ ] Contact info shown (if implemented)

### Network Errors
- [ ] Disconnect network
- [ ] Try to perform actions
- [ ] Appropriate error messages
- [ ] Retry mechanisms work
- [ ] Offline mode activates

---

## 17. Demo Mode Testing ✓

### Demo Data
- [ ] Click "Try Demo" on homepage
- [ ] Dashboard loads with demo data
- [ ] Sample campaigns visible
- [ ] Demo leads present
- [ ] Mock messages in inbox
- [ ] Analytics shows dummy data

### Demo Limitations
- [ ] Demo banner/indicator visible
- [ ] Can't save real data
- [ ] Actions simulate results
- [ ] Clear indication it's demo
- [ ] Easy to exit demo mode

---

## 18. Integration Points ✓

### Supabase
- [ ] Auth flow works (if using real credentials)
- [ ] Database queries execute (if connected)
- [ ] No connection errors
- [ ] Proper error messages if demo

### Google Gemini AI
- [ ] Content generation works (if using real key)
- [ ] Proper API responses
- [ ] Rate limiting handled
- [ ] Fallbacks if demo mode

### Email (Resend)
- [ ] Email notifications (if configured)
- [ ] Welcome emails (if enabled)
- [ ] Password reset (if configured)
- [ ] Proper fallbacks if not set up

---

## 19. Vercel-Specific Checks ✓

### Deployment
- [ ] Visit Vercel dashboard
- [ ] Check deployment status: "Ready"
- [ ] Build logs show success
- [ ] No build warnings (or minimal)
- [ ] Deployment time reasonable

### Environment Variables
- [ ] Go to Project Settings → Environment Variables
- [ ] All required variables present
- [ ] Production variables set
- [ ] Preview variables (if PATH B)
- [ ] Development variables

### Domains
- [ ] Default Vercel domain works
- [ ] Custom domain (if configured)
- [ ] SSL active for all domains
- [ ] Redirects working

---

## 20. Final Checks ✓

### Documentation
- [ ] README.md displays on GitHub (if PATH B)
- [ ] Setup instructions clear
- [ ] API documentation accessible
- [ ] Change log updated (if versioned)

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Real-time visitors showing
- [ ] Error tracking (if Sentry configured)
- [ ] Performance metrics

### Backups
- [ ] Code on GitHub (if PATH B)
- [ ] Environment variables documented
- [ ] Database backup strategy (if real DB)
- [ ] Vercel keeps deployment history

---

## Test Results Summary

**Date Tested:** ___________________
**Tester:** ___________________
**Environment:** Production / Staging
**URL:** ___________________________________

### Overall Results

| Category | Status | Notes |
|----------|--------|-------|
| Basic Access | ⬜ Pass / ⬜ Fail | |
| Authentication | ⬜ Pass / ⬜ Fail | |
| Dashboard | ⬜ Pass / ⬜ Fail | |
| Campaigns | ⬜ Pass / ⬜ Fail | |
| Content Gen | ⬜ Pass / ⬜ Fail | |
| Leads | ⬜ Pass / ⬜ Fail | |
| Inbox | ⬜ Pass / ⬜ Fail | |
| Analytics | ⬜ Pass / ⬜ Fail | |
| Settings | ⬜ Pass / ⬜ Fail | |
| PWA Features | ⬜ Pass / ⬜ Fail | |
| Performance | ⬜ Pass / ⬜ Fail | |
| Mobile | ⬜ Pass / ⬜ Fail | |
| Security | ⬜ Pass / ⬜ Fail | |

### Issues Found
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Critical Issues
⬜ None
⬜ Found (list above)

### Recommendation
⬜ Ready for production use
⬜ Needs minor fixes
⬜ Needs major fixes

---

## Quick Test (5 Minutes)

If you're short on time, test these essentials:

1. **Homepage loads** ✓
2. **Can sign in / use demo** ✓
3. **Dashboard displays** ✓
4. **Navigation works** ✓
5. **No console errors** ✓
6. **Mobile view looks OK** ✓
7. **PWA installable** ✓
8. **HTTPS enabled** ✓

If all 8 pass, you're good to go! 🚀

---

## Need Help?

If tests fail:
1. Check browser console for errors
2. Review Vercel deployment logs
3. Verify environment variables
4. Check network tab for failed requests
5. Review relevant documentation
6. Contact support if needed

---

**Happy Testing! 🧪**
