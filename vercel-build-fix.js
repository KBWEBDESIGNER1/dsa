const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to recursively set execute permissions on all files in node_modules/.bin
function setExecutePermissions(dirPath) {
  try {
    // Check if the directory exists
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory ${dirPath} does not exist.`);
      return;
    }

    console.log(`Setting execute permissions for files in ${dirPath}`);
    
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      try {
        fs.chmodSync(filePath, '755');
        console.log(`Set permissions for ${filePath}`);
      } catch (err) {
        console.error(`Error setting permissions for ${filePath}:`, err);
      }
    }
    
    console.log('All permissions set successfully');
  } catch (err) {
    console.error('Error setting permissions:', err);
  }
}

// Main function to run build process
function buildProject() {
  try {
    console.log('Starting Vercel build process...');
    
    // Set execute permissions on all binaries in node_modules/.bin
    const binPath = path.join(__dirname, 'node_modules', '.bin');
    setExecutePermissions(binPath);
    
    // Run the build command
    console.log('Running build command...');
    execSync('CI=false npm run build', { stdio: 'inherit' });
    
    console.log('Build completed successfully');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

// Run the build
buildProject(); 