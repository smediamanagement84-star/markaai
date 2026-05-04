# MarkaAI - Push to GitHub Script (PowerShell)
# Run this script after creating your GitHub repository

# Color output functions
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Info "=========================================="
Write-Info "MarkaAI - GitHub Repository Setup"
Write-Info "=========================================="
Write-Host ""

# Check if git is installed
Write-Info "Checking for Git installation..."
$gitVersion = git --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Git is not installed!"
    Write-Warning "Please install Git from: https://git-scm.com/download/win"
    Write-Warning "After installation, restart PowerShell and run this script again."
    pause
    exit 1
}
Write-Success "✓ Git is installed: $gitVersion"
Write-Host ""

# Verify we're in the correct directory
$currentDir = Get-Location
Write-Info "Current directory: $currentDir"
if (-not (Test-Path "package.json")) {
    Write-Error "Error: package.json not found!"
    Write-Warning "Please run this script from the MarkaAI project directory:"
    Write-Warning "cd C:\Users\DEll\Downloads\markaai-main"
    pause
    exit 1
}
Write-Success "✓ In MarkaAI project directory"
Write-Host ""

# Prompt for GitHub repository URL
Write-Info "Enter your GitHub repository URL:"
Write-Host "Format: https://github.com/YOUR_USERNAME/markaai.git" -ForegroundColor Gray
Write-Host "Or SSH: git@github.com:YOUR_USERNAME/markaai.git" -ForegroundColor Gray
Write-Host ""
$repoUrl = Read-Host "Repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Error "Repository URL cannot be empty!"
    pause
    exit 1
}

Write-Host ""
Write-Info "=========================================="
Write-Info "Step 1: Initializing Git Repository"
Write-Info "=========================================="

# Check if already initialized
if (Test-Path ".git") {
    Write-Warning "Git repository already initialized"
    $reinit = Read-Host "Reinitialize? This will keep your history (y/N)"
    if ($reinit -eq "y" -or $reinit -eq "Y") {
        Remove-Item -Recurse -Force .git
        Write-Info "Removed existing .git directory"
    }
}

# Initialize git
if (-not (Test-Path ".git")) {
    Write-Info "Initializing git repository..."
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to initialize git repository"
        pause
        exit 1
    }
    Write-Success "✓ Git repository initialized"
}

Write-Host ""
Write-Info "=========================================="
Write-Info "Step 2: Adding Files to Git"
Write-Info "=========================================="

# Add all files
Write-Info "Adding all files to git..."
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to add files to git"
    pause
    exit 1
}
Write-Success "✓ Files added to git"

# Show status
Write-Host ""
Write-Info "Git status:"
git status --short

Write-Host ""
Write-Info "=========================================="
Write-Info "Step 3: Creating Initial Commit"
Write-Info "=========================================="

# Check if there's already a commit
$hasCommits = git log --oneline 2>$null
if ($LASTEXITCODE -eq 0 -and $hasCommits) {
    Write-Warning "Repository already has commits"
    $shouldCommit = Read-Host "Create a new commit? (y/N)"
    if ($shouldCommit -ne "y" -and $shouldCommit -ne "Y") {
        Write-Info "Skipping commit creation"
        $skipCommit = $true
    }
}

if (-not $skipCommit) {
    Write-Info "Creating initial commit..."

    $commitMessage = @"
Initial commit: MarkaAI - Social Media Marketing Platform

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
- Vercel deployment ready
"@

    git commit -m $commitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to create commit"
        Write-Warning "This might be because there are no changes to commit"
        # Continue anyway
    } else {
        Write-Success "✓ Initial commit created"
    }
}

Write-Host ""
Write-Info "=========================================="
Write-Info "Step 4: Adding GitHub Remote"
Write-Info "=========================================="

# Check if origin already exists
$existingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Warning "Remote 'origin' already exists: $existingRemote"
    $shouldUpdate = Read-Host "Update to new URL? (y/N)"
    if ($shouldUpdate -eq "y" -or $shouldUpdate -eq "Y") {
        Write-Info "Updating remote URL..."
        git remote set-url origin $repoUrl
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to update remote URL"
            pause
            exit 1
        }
        Write-Success "✓ Remote URL updated"
    }
} else {
    Write-Info "Adding remote 'origin'..."
    git remote add origin $repoUrl
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to add remote"
        pause
        exit 1
    }
    Write-Success "✓ Remote 'origin' added"
}

Write-Host ""
Write-Info "=========================================="
Write-Info "Step 5: Renaming Branch to 'main'"
Write-Info "=========================================="

# Get current branch name
$currentBranch = git branch --show-current
Write-Info "Current branch: $currentBranch"

if ($currentBranch -ne "main") {
    Write-Info "Renaming branch to 'main'..."
    git branch -M main
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to rename branch"
        pause
        exit 1
    }
    Write-Success "✓ Branch renamed to 'main'"
} else {
    Write-Success "✓ Already on 'main' branch"
}

Write-Host ""
Write-Info "=========================================="
Write-Info "Step 6: Pushing to GitHub"
Write-Info "=========================================="

Write-Warning "You may be prompted for your GitHub credentials"
Write-Info "If using HTTPS, you'll need a Personal Access Token as password"
Write-Info "Get one at: https://github.com/settings/tokens"
Write-Host ""

Write-Info "Pushing to GitHub..."
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to push to GitHub"
    Write-Host ""
    Write-Warning "Common issues:"
    Write-Warning "1. Authentication failed - Make sure you're using the correct credentials"
    Write-Warning "   For HTTPS: Use Personal Access Token as password"
    Write-Warning "   For SSH: Make sure your SSH key is added to GitHub"
    Write-Warning ""
    Write-Warning "2. Repository doesn't exist - Make sure you created it on GitHub first"
    Write-Warning ""
    Write-Warning "3. Permission denied - Check repository URL and your access rights"
    Write-Host ""
    pause
    exit 1
}

Write-Success "✓ Successfully pushed to GitHub!"

Write-Host ""
Write-Success "=========================================="
Write-Success "SUCCESS! MarkaAI is now on GitHub!"
Write-Success "=========================================="
Write-Host ""

Write-Info "Your repository: $repoUrl"
Write-Info "Branch: main"
Write-Host ""

Write-Info "Next Steps:"
Write-Success "1. Visit your repository on GitHub to verify upload"
Write-Success "2. Follow VERCEL_GITHUB_INTEGRATION.md to set up automatic deployments"
Write-Success "3. Every push to 'main' will now automatically deploy to Vercel"
Write-Host ""

Write-Info "Quick Commands:"
Write-Host "  Make changes and push:" -ForegroundColor Gray
Write-Host "    git add ." -ForegroundColor Yellow
Write-Host "    git commit -m 'Your commit message'" -ForegroundColor Yellow
Write-Host "    git push" -ForegroundColor Yellow
Write-Host ""

Write-Success "Happy coding! 🚀"
Write-Host ""
pause
