#!/usr/bin/env node

/**
 * Vercel Environment Variables Setup Script
 * This script uses the Vercel API to set environment variables
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Read Vercel config
const configPath = path.join(__dirname, '.vercel', 'project.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const { projectId, orgId } = config;

// Read Vercel token from auth file
const authPath = path.join(process.env.USERPROFILE || process.env.HOME, '.vercel', 'auth.json');
let token = '';

try {
  const authData = JSON.parse(fs.readFileSync(authPath, 'utf8'));
  token = authData.token;
} catch (error) {
  console.error('Error reading Vercel auth token:', error.message);
  process.exit(1);
}

// Environment variables to set
const envVars = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    value: 'https://demo.supabase.co',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'GOOGLE_GEMINI_API_KEY',
    value: 'demo-key-for-testing',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'NEXT_PUBLIC_DEV_MODE',
    value: 'true',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'NEXT_PUBLIC_APP_URL',
    value: 'https://markaai.vercel.app',
    target: ['production', 'preview', 'development']
  }
];

// Function to make API request
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, body });
        } else {
          reject({ statusCode: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Main function to set environment variables
async function setEnvVars() {
  console.log('🚀 Setting up Vercel environment variables for MarkaAI...\n');
  console.log(`Project ID: ${projectId}`);
  console.log(`Team ID: ${orgId}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const envVar of envVars) {
    console.log(`\n📝 Setting ${envVar.key}...`);

    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: `/v10/projects/${projectId}/env?teamId=${orgId}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const data = {
      key: envVar.key,
      value: envVar.value,
      type: 'encrypted',
      target: envVar.target
    };

    try {
      await makeRequest(options, data);
      console.log(`  ✅ Successfully set ${envVar.key} for ${envVar.target.join(', ')}`);
      successCount++;
    } catch (error) {
      const errorBody = typeof error.body === 'string' ? error.body : JSON.stringify(error);

      // Check if error is due to duplicate key
      if (errorBody.includes('already exists') || errorBody.includes('ENVIRONMENT_VARIABLE_ALREADY_EXISTS')) {
        console.log(`  ⚠️  ${envVar.key} already exists (skipping)`);
      } else {
        console.error(`  ❌ Failed to set ${envVar.key}: ${errorBody}`);
        errorCount++;
      }
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Environment variables setup complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log('='.repeat(50));
  console.log('\n🚀 Ready to deploy! Run: vercel --prod\n');
}

// Run the script
setEnvVars().catch(error => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
