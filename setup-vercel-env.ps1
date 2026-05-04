# Vercel Environment Variables Setup Script
# This script sets up all required environment variables for MarkaAI deployment

Write-Host "Setting up Vercel environment variables for MarkaAI..." -ForegroundColor Green

# Define environment variables
$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL" = "https://demo.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE"
    "GOOGLE_GEMINI_API_KEY" = "demo-key-for-testing"
    "NEXT_PUBLIC_DEV_MODE" = "true"
    "NEXT_PUBLIC_APP_URL" = "https://markaai.vercel.app"
}

$environments = @("production", "preview", "development")

foreach ($envName in $envVars.Keys) {
    $envValue = $envVars[$envName]

    foreach ($env in $environments) {
        Write-Host "`nAdding $envName to $env environment..." -ForegroundColor Cyan

        # Use echo to pipe value to vercel env add
        $envValue | vercel.cmd env add $envName $env

        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Successfully added $envName to $env" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Failed to add $envName to $env (may already exist)" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Environment variables setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nYou can now deploy with: vercel --prod" -ForegroundColor Cyan
