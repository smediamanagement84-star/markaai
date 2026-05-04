# GitHub Repository Setup Guide - PATH B

## Overview
This guide walks you through creating a GitHub repository for MarkaAI and setting up automatic deployments via Vercel's GitHub integration.

## Prerequisites
- GitHub account (free or paid)
- Git installed on your system
- MarkaAI project at: `C:\Users\DEll\Downloads\markaai-main`

## Part 1: Create GitHub Repository

### Step 1: Go to GitHub

1. Open your browser
2. Go to: **https://github.com/new**
3. Log in if prompted

### Step 2: Configure Repository

Fill in the repository details:

**Repository Name:**
```
markaai
```

**Description:**
```
MarkaAI - Social Media Marketing Platform for Nepali Businesses. AI-powered content generation, campaign management, lead capture, and analytics.
```

**Visibility:**
- Choose **Private** (recommended for business projects)
- Or **Public** (if you want it open source)

**Initialize this repository:**
- **DO NOT** check "Add a README file"
- **DO NOT** check "Add .gitignore"
- **DO NOT** select a license

(Your project already has these files)

### Step 3: Create Repository

1. Click the green **"Create repository"** button
2. You'll see a page with setup instructions
3. **Copy the repository URL** - it will look like:
   - HTTPS: `https://github.com/YOUR_USERNAME/markaai.git`
   - SSH: `git@github.com:YOUR_USERNAME/markaai.git`

## Part 2: Initialize Git and Push to GitHub

### Option A: Using PowerShell (Windows)

Open PowerShell and run:

```powershell
# Navigate to project directory
cd "C:\Users\DEll\Downloads\markaai-main"

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: MarkaAI - Social Media Marketing Platform

Features:
- AI-powered content generation (English/Nepali)
- Campaign management with funnel planning
- Lead capture & CRM integration
- Smart inbox with sentiment analysis
- Analytics dashboard
- Demo mode for testing
- PWA support with offline capabilities
- Complete authentication flow

Tech Stack:
- Next.js 16 + React 19 + TypeScript
- Supabase (Auth + Database)
- Google Gemini AI
- Tailwind CSS + Radix UI
- Vercel deployment ready"

# Add GitHub remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/markaai.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Option B: Using Git Bash or Command Prompt

```bash
# Navigate to project directory
cd "C:\Users\DEll\Downloads\markaai-main"

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: MarkaAI - Social Media Marketing Platform for Nepali Businesses"

# Add GitHub remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/markaai.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/markaai`
2. You should see all your files uploaded
3. Check that these files are present:
   - `package.json`
   - `next.config.js`
   - `vercel.json`
   - `.env.example`
   - `app/` directory
   - `components/` directory

## Part 3: Common Git Issues and Solutions

### Issue: "git: command not found"

**Solution:** Install Git
1. Download from: https://git-scm.com/download/win
2. Run installer with default settings
3. Restart PowerShell/Command Prompt
4. Try again

### Issue: "Permission denied (publickey)"

**Solution:** Use HTTPS instead of SSH
- Use URL format: `https://github.com/YOUR_USERNAME/markaai.git`
- Git will prompt for username and password

### Issue: "Authentication failed"

**Solution:** Use Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "MarkaAI Deployment"
4. Check scopes: `repo` (full control)
5. Click "Generate token"
6. Copy the token
7. Use the token as your password when pushing

### Issue: Files in .gitignore are being tracked

**Solution:** Clear cache and re-add
```bash
git rm -r --cached .
git add .
git commit -m "Fix gitignore"
git push
```

## Part 4: Verify Your Repository

After pushing, verify these items:

- [ ] Repository exists on GitHub
- [ ] All project files are visible
- [ ] `.env.local` is NOT visible (it should be ignored)
- [ ] `node_modules/` is NOT visible (it should be ignored)
- [ ] `.vercel/` is NOT visible (it should be ignored)
- [ ] README.md is displayed on the repository homepage
- [ ] Repository shows correct language (TypeScript/JavaScript)

## Part 5: Future Git Workflow

After initial setup, use these commands for updates:

### Making Changes and Committing
```bash
# Check status of changes
git status

# Add specific files
git add path/to/file.ts

# Or add all changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

### Pulling Latest Changes
```bash
# Get latest changes from GitHub
git pull origin main
```

### Creating Branches
```bash
# Create and switch to new branch
git checkout -b feature-name

# Push branch to GitHub
git push -u origin feature-name
```

## Next Steps

Once your code is on GitHub:

1. **Set up Vercel GitHub Integration** - See `VERCEL_GITHUB_INTEGRATION.md`
2. **Configure automatic deployments** - Every push deploys automatically
3. **Set up branch protection** - Protect your main branch
4. **Add collaborators** - Invite team members if needed

## Additional Resources

### GitHub Documentation
- Getting Started: https://docs.github.com/en/get-started
- Git Basics: https://git-scm.com/book/en/v2/Getting-Started-Git-Basics

### Git Cheat Sheet
```bash
git status              # Check status
git add <file>          # Stage file
git commit -m "msg"     # Commit changes
git push                # Push to remote
git pull                # Pull from remote
git branch              # List branches
git checkout -b <name>  # Create new branch
git merge <branch>      # Merge branch
git log                 # View commit history
```

### Common Git Patterns

**Feature Development:**
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push -u origin feature/new-feature
# Create pull request on GitHub
```

**Bug Fix:**
```bash
git checkout -b fix/bug-description
# Fix the bug
git add .
git commit -m "Fix: bug description"
git push -u origin fix/bug-description
# Create pull request on GitHub
```

**Update from Main:**
```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

## Troubleshooting

### Large Files Error
If you get "file too large" error:
1. Check for large files: `git ls-files -z | xargs -0 du -h | sort -h`
2. Remove from git: `git rm --cached large-file`
3. Add to .gitignore
4. Commit and push again

### Wrong Remote URL
To fix the remote URL:
```bash
git remote -v  # Check current URL
git remote set-url origin https://github.com/YOUR_USERNAME/markaai.git
git remote -v  # Verify change
```

### Undo Last Commit (Not Pushed)
```bash
git reset --soft HEAD~1  # Undo commit, keep changes
# or
git reset --hard HEAD~1  # Undo commit, discard changes
```

---

**Repository created?** Move on to `VERCEL_GITHUB_INTEGRATION.md` for automatic deployments!
