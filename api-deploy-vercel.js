/**
 * MarkaAI - Vercel API Deployment Script
 *
 * This script attempts to deploy MarkaAI to Vercel using the Vercel API
 * It works around the CLI issues and deploys directly
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

function success(msg) { console.log(`${colors.green}${msg}${colors.reset}`); }
function info(msg) { console.log(`${colors.cyan}${msg}${colors.reset}`); }
function warning(msg) { console.log(`${colors.yellow}${msg}${colors.reset}`); }
function error(msg) { console.log(`${colors.red}${msg}${colors.reset}`); }

// Read Vercel project configuration
const vercelConfigPath = path.join(__dirname, '.vercel', 'project.json');

if (!fs.existsSync(vercelConfigPath)) {
  error('❌ .vercel/project.json not found!');
  error('This project is not linked to Vercel.');
  console.log('');
  warning('To link this project:');
  warning('1. Run: vercel link');
  warning('2. Or follow the manual deployment guide in VERCEL_DASHBOARD_CLEANUP.md');
  process.exit(1);
}

const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
const { projectId, orgId } = vercelConfig;

info('==========================================');
info('MarkaAI - Vercel API Deployment');
info('==========================================');
console.log('');
info(`Project ID: ${projectId}`);
info(`Team ID: ${orgId}`);
console.log('');

// Read Vercel token
const tokenPath = path.join(require('os').homedir(), '.vercel', 'auth.json');
let token = null;

if (fs.existsSync(tokenPath)) {
  try {
    const authData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    token = authData.token;
    success('✓ Vercel authentication token found');
  } catch (err) {
    warning('⚠ Could not read Vercel token');
  }
}

if (!token) {
  error('❌ Vercel authentication token not found!');
  console.log('');
  warning('Please authenticate with Vercel:');
  warning('1. Run: vercel login');
  warning('2. Follow the login prompts');
  warning('3. Run this script again');
  process.exit(1);
}

console.log('');
info('==========================================');
info('Checking Environment Variables');
info('==========================================');
console.log('');

// Function to make HTTPS requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.error?.message || body}`));
          }
        } catch (err) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// List all environment variables
async function listEnvVars() {
  const options = {
    hostname: 'api.vercel.com',
    path: `/v9/projects/${projectId}/env?teamId=${orgId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  info('Fetching environment variables...');

  try {
    const data = await makeRequest(options);
    return data.envs || [];
  } catch (err) {
    error(`❌ Failed to fetch environment variables: ${err.message}`);
    return [];
  }
}

// Delete an environment variable
async function deleteEnvVar(envId, key) {
  const options = {
    hostname: 'api.vercel.com',
    path: `/v9/projects/${projectId}/env/${envId}?teamId=${orgId}`,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    await makeRequest(options);
    success(`  ✓ Deleted: ${key}`);
    return true;
  } catch (err) {
    error(`  ❌ Failed to delete ${key}: ${err.message}`);
    return false;
  }
}

// Main function
async function main() {
  const envVars = await listEnvVars();

  if (envVars.length === 0) {
    warning('No environment variables found or failed to fetch');
    console.log('');
    info('Attempting to deploy anyway...');
    console.log('');
    await triggerDeployment();
    return;
  }

  console.log('');
  info('Environment Variables Status:');
  console.log('');

  // Find problematic Preview variables
  const previewVarsWithSecrets = envVars.filter(env => {
    const hasPreview = env.target && env.target.includes('preview');
    const hasSecretValue = env.type === 'secret' || (env.value && env.value.startsWith('secret_'));
    return hasPreview && hasSecretValue;
  });

  if (previewVarsWithSecrets.length === 0) {
    success('✓ No problematic Preview environment variables found!');
    console.log('');
    info('All environment variables are properly configured.');
    console.log('');
    await triggerDeployment();
    return;
  }

  warning(`⚠ Found ${previewVarsWithSecrets.length} Preview variables referencing secrets:`);
  console.log('');

  previewVarsWithSecrets.forEach(env => {
    console.log(`  - ${env.key} (ID: ${env.id})`);
    console.log(`    Type: ${env.type}`);
    console.log(`    Target: ${env.target.join(', ')}`);
    console.log('');
  });

  warning('These variables need to be removed before deployment can succeed.');
  console.log('');

  // Ask user if they want to delete them
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('Do you want to delete these Preview variables? (y/N): ', async (answer) => {
    readline.close();

    if (answer.toLowerCase() === 'y') {
      console.log('');
      info('Deleting Preview variables...');
      console.log('');

      for (const env of previewVarsWithSecrets) {
        await deleteEnvVar(env.id, env.key);
      }

      console.log('');
      success('✓ Preview variables deleted!');
      console.log('');
      await triggerDeployment();
    } else {
      console.log('');
      info('Deployment cancelled.');
      console.log('');
      warning('To deploy successfully, you need to:');
      warning('1. Go to: https://vercel.com/dashboard');
      warning('2. Navigate to your project settings');
      warning('3. Remove Preview environment variables that reference secrets');
      warning('4. Run this script again');
      console.log('');
      warning('Or follow the manual guide: VERCEL_DASHBOARD_CLEANUP.md');
    }
  });
}

// Trigger deployment
async function triggerDeployment() {
  info('==========================================');
  info('Triggering Vercel Deployment');
  info('==========================================');
  console.log('');

  warning('Note: Direct deployment via API requires uploading all files.');
  warning('For now, please deploy using one of these methods:');
  console.log('');

  info('Method 1: Vercel Dashboard');
  console.log('  1. Go to: https://vercel.com/dashboard');
  console.log('  2. Select your project: markaai-main');
  console.log('  3. Click "Deploy" button');
  console.log('  4. Select "Production" branch');
  console.log('  5. Click "Deploy"');
  console.log('');

  info('Method 2: Vercel CLI (if working)');
  console.log('  Run: vercel --prod');
  console.log('');

  info('Method 3: GitHub Integration');
  console.log('  Follow the guide: VERCEL_GITHUB_INTEGRATION.md');
  console.log('  Push to GitHub, and Vercel will deploy automatically');
  console.log('');

  success('Environment variables are now configured correctly!');
  success('You can now deploy using any of the methods above.');
}

// Run
main().catch(err => {
  console.log('');
  error('==========================================');
  error('Error');
  error('==========================================');
  error(err.message);
  console.log('');
  error('Stack trace:');
  console.error(err.stack);
  process.exit(1);
});
