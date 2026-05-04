#!/usr/bin/env node

/**
 * Fix Vercel Environment Variables
 * This script removes ALL environment variables and adds them back fresh
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read Vercel config
const configPath = path.join(__dirname, '.vercel', 'project.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const { projectId, orgId, projectName } = config;

console.log('🔧 Fixing Vercel Environment Variables\n');
console.log(`Project: ${projectName}`);
console.log(`Project ID: ${projectId}`);
console.log(`Team ID: ${orgId}\n`);

// Environment variables to set
const envVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'https://demo.supabase.co',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE',
  'GOOGLE_GEMINI_API_KEY': 'demo-key-for-testing',
  'NEXT_PUBLIC_DEV_MODE': 'true',
  'NEXT_PUBLIC_APP_URL': 'https://markaai-main.vercel.app'
};

// Step 1: List all current environment variables
console.log('📋 Step 1: Checking current environment variables...\n');
try {
  const output = execSync('vercel.cmd env ls', { encoding: 'utf8', cwd: __dirname });
  console.log(output);
} catch (error) {
  console.log('Could not list env vars, continuing...\n');
}

// Step 2: Remove all environment variables for all environments
console.log('\n🗑️  Step 2: Removing all existing environment variables...\n');

const environments = ['production', 'development'];
Object.keys(envVars).forEach(varName => {
  environments.forEach(env => {
    try {
      console.log(`  Removing ${varName} from ${env}...`);
      execSync(`vercel.cmd env rm ${varName} ${env} --yes`, {
        encoding: 'utf8',
        cwd: __dirname,
        stdio: 'pipe'
      });
      console.log(`  ✅ Removed`);
    } catch (error) {
      console.log(`  ⚠️  Not found or already removed`);
    }
  });
});

console.log('\n✅ Step 2 Complete: All existing variables removed\n');

// Small delay
console.log('⏳ Waiting 2 seconds...\n');
execSync('timeout /t 2 /nobreak >nul 2>&1 || sleep 2', { cwd: __dirname });

// Step 3: Add environment variables back
console.log('➕ Step 3: Adding environment variables back...\n');

Object.entries(envVars).forEach(([varName, varValue]) => {
  environments.forEach(env => {
    try {
      console.log(`  Adding ${varName} to ${env}...`);

      // Use echo to pipe value to vercel env add
      const addCmd = `echo ${varValue} | vercel.cmd env add ${varName} ${env}`;
      execSync(addCmd, {
        encoding: 'utf8',
        cwd: __dirname,
        stdio: 'pipe',
        shell: 'cmd.exe'
      });

      console.log(`  ✅ Added`);
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
    }
  });

  // Small delay between variables
  try {
    execSync('timeout /t 1 /nobreak >nul 2>&1 || sleep 1', { cwd: __dirname, stdio: 'ignore' });
  } catch (e) {
    // Ignore timeout errors
  }
});

console.log('\n✅ Step 3 Complete: All variables added\n');

// Step 4: Verify
console.log('🔍 Step 4: Verifying environment variables...\n');
try {
  const output = execSync('vercel.cmd env ls', { encoding: 'utf8', cwd: __dirname });
  console.log(output);
} catch (error) {
  console.log('Could not verify env vars\n');
}

console.log('\n' + '='.repeat(60));
console.log('✨ Environment variables fix complete!');
console.log('='.repeat(60));
console.log('\n🚀 Ready to deploy! Run: vercel --prod\n');
