#!/usr/bin/env node

/**
 * Check all Vercel environment variables via API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Read Vercel config
const configPath = path.join(__dirname, '.vercel', 'project.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const { projectId, orgId } = config;

// Try to read token from different locations
let token = '';
const authPaths = [
  path.join(process.env.APPDATA || process.env.HOME, 'com.vercel.cli', 'auth.json'),
  path.join(process.env.LOCALAPPDATA || process.env.HOME, 'com.vercel.cli', 'auth.json'),
  path.join(process.env.HOME || process.env.USERPROFILE, '.vercel', 'auth.json'),
];

for (const authPath of authPaths) {
  try {
    if (fs.existsSync(authPath)) {
      const authData = JSON.parse(fs.readFileSync(authPath, 'utf8'));
      token = authData.token;
      console.log(`Found auth token at: ${authPath}\n`);
      break;
    }
  } catch (error) {
    // Continue to next path
  }
}

if (!token) {
  console.error('Could not find Vercel auth token');
  console.log('Tried locations:');
  authPaths.forEach(p => console.log(`  - ${p}`));
  process.exit(1);
}

// Function to make API request
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject({ statusCode: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Get all environment variables
async function getAllEnvVars() {
  console.log('Fetching all environment variables...\n');
  console.log(`Project ID: ${projectId}`);
  console.log(`Team ID: ${orgId}\n`);

  const options = {
    hostname: 'api.vercel.com',
    port: 443,
    path: `/v9/projects/${projectId}/env?teamId=${orgId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const result = await makeRequest(options);

    if (result.envs && Array.isArray(result.envs)) {
      console.log(`Found ${result.envs.length} environment variables:\n`);

      result.envs.forEach((env, index) => {
        console.log(`${index + 1}. ${env.key}`);
        console.log(`   ID: ${env.id}`);
        console.log(`   Type: ${env.type}`);
        console.log(`   Target: ${env.target.join(', ')}`);
        console.log(`   Git Branch: ${env.gitBranch || 'all'}`);
        if (env.type === 'secret') {
          console.log(`   Secret ID: ${env.value}`);
        }
        console.log('');
      });
    }
  } catch (error) {
    console.error('Error fetching environment variables:', error);
    process.exit(1);
  }
}

// Run the script
getAllEnvVars();
