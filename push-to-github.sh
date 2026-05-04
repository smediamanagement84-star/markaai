#!/bin/bash
# MarkaAI - Push to GitHub Script (Bash)
# Run this script after creating your GitHub repository

# Color output functions
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

success() { echo -e "${GREEN}$1${NC}"; }
info() { echo -e "${CYAN}$1${NC}"; }
warning() { echo -e "${YELLOW}$1${NC}"; }
error() { echo -e "${RED}$1${NC}"; }

info "=========================================="
info "MarkaAI - GitHub Repository Setup"
info "=========================================="
echo ""

# Check if git is installed
info "Checking for Git installation..."
if ! command -v git &> /dev/null; then
    error "Git is not installed!"
    warning "Please install Git:"
    warning "  Ubuntu/Debian: sudo apt-get install git"
    warning "  macOS: brew install git"
    warning "  Windows: Download from https://git-scm.com/download/win"
    exit 1
fi
success "✓ Git is installed: $(git --version)"
echo ""

# Verify we're in the correct directory
info "Current directory: $(pwd)"
if [ ! -f "package.json" ]; then
    error "Error: package.json not found!"
    warning "Please run this script from the MarkaAI project directory:"
    warning "cd /path/to/markaai-main"
    exit 1
fi
success "✓ In MarkaAI project directory"
echo ""

# Prompt for GitHub repository URL
info "Enter your GitHub repository URL:"
echo -e "${GRAY}Format: https://github.com/YOUR_USERNAME/markaai.git${NC}"
echo -e "${GRAY}Or SSH: git@github.com:YOUR_USERNAME/markaai.git${NC}"
echo ""
read -p "Repository URL: " repo_url

if [ -z "$repo_url" ]; then
    error "Repository URL cannot be empty!"
    exit 1
fi

echo ""
info "=========================================="
info "Step 1: Initializing Git Repository"
info "=========================================="

# Check if already initialized
if [ -d ".git" ]; then
    warning "Git repository already initialized"
    read -p "Reinitialize? This will keep your history (y/N): " reinit
    if [ "$reinit" = "y" ] || [ "$reinit" = "Y" ]; then
        rm -rf .git
        info "Removed existing .git directory"
    fi
fi

# Initialize git
if [ ! -d ".git" ]; then
    info "Initializing git repository..."
    git init
    if [ $? -ne 0 ]; then
        error "Failed to initialize git repository"
        exit 1
    fi
    success "✓ Git repository initialized"
fi

echo ""
info "=========================================="
info "Step 2: Adding Files to Git"
info "=========================================="

# Add all files
info "Adding all files to git..."
git add .
if [ $? -ne 0 ]; then
    error "Failed to add files to git"
    exit 1
fi
success "✓ Files added to git"

# Show status
echo ""
info "Git status:"
git status --short

echo ""
info "=========================================="
info "Step 3: Creating Initial Commit"
info "=========================================="

# Check if there's already a commit
if git log --oneline &> /dev/null; then
    warning "Repository already has commits"
    read -p "Create a new commit? (y/N): " should_commit
    if [ "$should_commit" != "y" ] && [ "$should_commit" != "Y" ]; then
        info "Skipping commit creation"
        skip_commit=true
    fi
fi

if [ "$skip_commit" != "true" ]; then
    info "Creating initial commit..."

    commit_message="Initial commit: MarkaAI - Social Media Marketing Platform

Features:
- AI-powered content generation (English/Nepali)
- Campaign management with funnel planning
- Lead capture & CRM integration
- Smart inbox with sentiment analysis
- Analytics dashboard
- Demo mode for testing without credentials
- PWA support with offline capabilities
- Complete authentication flow

Tech Stack:
- Next.js 16 + React 19 + TypeScript
- Supabase (Auth + Database)
- Google Gemini AI
- Tailwind CSS + Radix UI
- Vercel deployment ready"

    git commit -m "$commit_message"
    if [ $? -ne 0 ]; then
        warning "Failed to create commit (might be no changes)"
        # Continue anyway
    else
        success "✓ Initial commit created"
    fi
fi

echo ""
info "=========================================="
info "Step 4: Adding GitHub Remote"
info "=========================================="

# Check if origin already exists
existing_remote=$(git remote get-url origin 2>/dev/null)
if [ $? -eq 0 ]; then
    warning "Remote 'origin' already exists: $existing_remote"
    read -p "Update to new URL? (y/N): " should_update
    if [ "$should_update" = "y" ] || [ "$should_update" = "Y" ]; then
        info "Updating remote URL..."
        git remote set-url origin "$repo_url"
        if [ $? -ne 0 ]; then
            error "Failed to update remote URL"
            exit 1
        fi
        success "✓ Remote URL updated"
    fi
else
    info "Adding remote 'origin'..."
    git remote add origin "$repo_url"
    if [ $? -ne 0 ]; then
        error "Failed to add remote"
        exit 1
    fi
    success "✓ Remote 'origin' added"
fi

echo ""
info "=========================================="
info "Step 5: Renaming Branch to 'main'"
info "=========================================="

# Get current branch name
current_branch=$(git branch --show-current)
info "Current branch: $current_branch"

if [ "$current_branch" != "main" ]; then
    info "Renaming branch to 'main'..."
    git branch -M main
    if [ $? -ne 0 ]; then
        error "Failed to rename branch"
        exit 1
    fi
    success "✓ Branch renamed to 'main'"
else
    success "✓ Already on 'main' branch"
fi

echo ""
info "=========================================="
info "Step 6: Pushing to GitHub"
info "=========================================="

warning "You may be prompted for your GitHub credentials"
info "If using HTTPS, you'll need a Personal Access Token as password"
info "Get one at: https://github.com/settings/tokens"
echo ""

info "Pushing to GitHub..."
git push -u origin main
if [ $? -ne 0 ]; then
    error "Failed to push to GitHub"
    echo ""
    warning "Common issues:"
    warning "1. Authentication failed - Make sure you're using the correct credentials"
    warning "   For HTTPS: Use Personal Access Token as password"
    warning "   For SSH: Make sure your SSH key is added to GitHub"
    warning ""
    warning "2. Repository doesn't exist - Make sure you created it on GitHub first"
    warning ""
    warning "3. Permission denied - Check repository URL and your access rights"
    echo ""
    exit 1
fi

success "✓ Successfully pushed to GitHub!"

echo ""
success "=========================================="
success "SUCCESS! MarkaAI is now on GitHub!"
success "=========================================="
echo ""

info "Your repository: $repo_url"
info "Branch: main"
echo ""

info "Next Steps:"
success "1. Visit your repository on GitHub to verify upload"
success "2. Follow VERCEL_GITHUB_INTEGRATION.md to set up automatic deployments"
success "3. Every push to 'main' will now automatically deploy to Vercel"
echo ""

info "Quick Commands:"
echo -e "${GRAY}  Make changes and push:${NC}"
echo -e "${YELLOW}    git add .${NC}"
echo -e "${YELLOW}    git commit -m 'Your commit message'${NC}"
echo -e "${YELLOW}    git push${NC}"
echo ""

success "Happy coding! 🚀"
echo ""
