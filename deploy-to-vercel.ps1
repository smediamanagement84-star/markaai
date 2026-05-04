# MarkaAI - Automated Vercel Deployment Script
# This script automates the deployment process to Vercel

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  MarkaAI Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$ProjectDir = "C:\Users\DEll\Downloads\markaai-main"
Set-Location $ProjectDir

Write-Host "[1/5] Checking Prerequisites..." -ForegroundColor Yellow

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "  Node.js Version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Node.js is not installed!" -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "  Vercel CLI Version: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Vercel CLI is not installed!" -ForegroundColor Red
    Write-Host "  Run: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[2/5] Checking Environment Variables..." -ForegroundColor Yellow

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "  .env.local file found" -ForegroundColor Green

    # Read and check required variables
    $envContent = Get-Content ".env.local" -Raw
    $requiredVars = @(
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "GOOGLE_GEMINI_API_KEY"
    )

    foreach ($var in $requiredVars) {
        if ($envContent -match $var) {
            Write-Host "    $var - Found" -ForegroundColor Green
        } else {
            Write-Host "    $var - Missing" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  WARNING: .env.local not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[3/5] Testing Local Build..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes..." -ForegroundColor Gray

try {
    # Run build command
    $buildOutput = npm run build 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Build successful!" -ForegroundColor Green
    } else {
        Write-Host "  Build failed!" -ForegroundColor Red
        Write-Host "  Error output:" -ForegroundColor Red
        Write-Host $buildOutput -ForegroundColor Red

        $continue = Read-Host "  Continue with deployment anyway? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Host "  Deployment cancelled." -ForegroundColor Yellow
            exit 1
        }
    }
} catch {
    Write-Host "  Error during build: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[4/5] Checking Vercel Authentication..." -ForegroundColor Yellow

# Check if user is logged in
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  You are not logged in to Vercel" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Please run: vercel login" -ForegroundColor Yellow
    Write-Host "  Then run this script again" -ForegroundColor Yellow
    Write-Host ""

    $login = Read-Host "  Would you like to login now? (Y/n)"
    if ($login -ne "n" -and $login -ne "N") {
        Write-Host "  Opening Vercel login..." -ForegroundColor Cyan
        vercel login

        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Login successful!" -ForegroundColor Green
        } else {
            Write-Host "  Login failed. Please try again manually." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "  Deployment cancelled." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "  Logged in as: $whoami" -ForegroundColor Green
}

Write-Host ""
Write-Host "[5/5] Deploying to Vercel..." -ForegroundColor Yellow
Write-Host ""

# Ask for deployment type
Write-Host "  Select deployment type:" -ForegroundColor Cyan
Write-Host "    1) Preview (development deployment)" -ForegroundColor White
Write-Host "    2) Production (live deployment)" -ForegroundColor White
Write-Host ""
$deployType = Read-Host "  Enter choice (1 or 2)"

Write-Host ""

if ($deployType -eq "2") {
    Write-Host "  Deploying to PRODUCTION..." -ForegroundColor Yellow
    Write-Host "  This will be your live site!" -ForegroundColor Yellow
    Write-Host ""

    $confirm = Read-Host "  Are you sure? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "  Deployment cancelled." -ForegroundColor Yellow
        exit 0
    }

    Write-Host ""
    Write-Host "  Starting production deployment..." -ForegroundColor Cyan
    vercel --prod
} else {
    Write-Host "  Deploying to PREVIEW..." -ForegroundColor Cyan
    vercel
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Green
    Write-Host "  Deployment Successful!" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Check the deployment URL above" -ForegroundColor White
    Write-Host "  2. Set environment variables in Vercel dashboard" -ForegroundColor White
    Write-Host "  3. Update Supabase redirect URLs" -ForegroundColor White
    Write-Host "  4. Test your deployment" -ForegroundColor White
    Write-Host ""
    Write-Host "For detailed instructions, see:" -ForegroundColor Cyan
    Write-Host "  VERCEL_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Red
    Write-Host "  Deployment Failed!" -ForegroundColor Red
    Write-Host "======================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Check the error message above" -ForegroundColor White
    Write-Host "  2. Ensure you're logged in: vercel login" -ForegroundColor White
    Write-Host "  3. Try running: vercel --debug" -ForegroundColor White
    Write-Host "  4. Check VERCEL_DEPLOYMENT_GUIDE.md" -ForegroundColor White
    Write-Host ""
    exit 1
}
