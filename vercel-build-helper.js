// This script helps ensure the build process runs correctly on Vercel
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Vercel build helper...');

try {
  // Ensure node_modules/.bin has correct permissions
  const binPath = path.join(process.cwd(), 'node_modules', '.bin');
  if (fs.existsSync(binPath)) {
    console.log(`Setting permissions for ${binPath}`);
    execSync(`chmod -R 755 ${binPath}`, { stdio: 'inherit' });
  }

  // Run the build process
  console.log('Running build command...');
  execSync('CI=false npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build helper failed:', error);
  process.exit(1);
} 