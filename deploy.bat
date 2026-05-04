@echo off
REM MarkaAI - Quick Vercel Deployment
REM Simple wrapper for PowerShell deployment script

echo.
echo ======================================
echo   MarkaAI Vercel Deployment
echo ======================================
echo.

REM Check if PowerShell script exists
if not exist "deploy-to-vercel.ps1" (
    echo ERROR: deploy-to-vercel.ps1 not found!
    echo Please ensure you're in the project root directory.
    pause
    exit /b 1
)

REM Run PowerShell script
powershell -ExecutionPolicy Bypass -File "deploy-to-vercel.ps1"

pause
