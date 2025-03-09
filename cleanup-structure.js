// This script helps clean up the directory structure
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Function to copy file (Windows-friendly)
function copyFile(source, destination) {
  try {
    const content = fs.readFileSync(source);
    fs.writeFileSync(destination, content);
    console.log(`Copied: ${source} to ${destination}`);
  } catch (err) {
    console.error(`Error copying ${source} to ${destination}:`, err);
  }
}

// Function to remove directory and all its contents (Windows-friendly)
function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Removed directory: ${dir}`);
  }
}

// Main function to reorganize directory structure
function reorganize() {
  const srcDir = path.join(__dirname, 'src');
  const nestedSrcDir = path.join(srcDir, 'src');
  const nestedPublicDir = path.join(srcDir, 'public');
  
  // Check if nested directories exist
  const nestedSrcExists = fs.existsSync(nestedSrcDir);
  const nestedPublicExists = fs.existsSync(nestedPublicDir);
  
  if (nestedSrcExists) {
    console.log('Found nested src directory, reorganizing...');
    
    // Read all files in nested src directory
    const files = fs.readdirSync(nestedSrcDir, { withFileTypes: true });
    
    // Process each file/directory
    files.forEach(file => {
      const srcPath = path.join(nestedSrcDir, file.name);
      const destPath = path.join(srcDir, file.name);
      
      if (file.isDirectory()) {
        // It's a directory, merge contents
        ensureDirectoryExists(destPath);
        const subFiles = fs.readdirSync(srcPath, { withFileTypes: true });
        
        subFiles.forEach(subFile => {
          const subSrcPath = path.join(srcPath, subFile.name);
          const subDestPath = path.join(destPath, subFile.name);
          
          // If the file doesn't exist in the destination or is newer, copy it
          if (!fs.existsSync(subDestPath) || 
              fs.statSync(subSrcPath).mtime > fs.statSync(subDestPath).mtime) {
            if (subFile.isDirectory()) {
              ensureDirectoryExists(subDestPath);
              // Recursively copy directories
              const deepFiles = fs.readdirSync(subSrcPath);
              deepFiles.forEach(deepFile => {
                copyFile(
                  path.join(subSrcPath, deepFile),
                  path.join(subDestPath, deepFile)
                );
              });
            } else {
              copyFile(subSrcPath, subDestPath);
            }
          }
        });
      } else {
        // It's a file, copy if doesn't exist or is newer
        if (!fs.existsSync(destPath) || 
            fs.statSync(srcPath).mtime > fs.statSync(destPath).mtime) {
          copyFile(srcPath, destPath);
        }
      }
    });
    
    // Remove nested src directory
    removeDirectory(nestedSrcDir);
  } else {
    console.log('No nested src directory found.');
  }
  
  // Handle nested public directory if it exists
  if (nestedPublicExists) {
    console.log('Found nested public directory in src, reorganizing...');
    const publicDir = path.join(__dirname, 'public');
    ensureDirectoryExists(publicDir);
    
    // Copy files from nested public to root public
    const publicFiles = fs.readdirSync(nestedPublicDir, { withFileTypes: true });
    publicFiles.forEach(file => {
      const srcPath = path.join(nestedPublicDir, file.name);
      const destPath = path.join(publicDir, file.name);
      
      if (!fs.existsSync(destPath) || 
          fs.statSync(srcPath).mtime > fs.statSync(destPath).mtime) {
        copyFile(srcPath, destPath);
      }
    });
    
    // Remove nested public directory
    removeDirectory(nestedPublicDir);
  } else {
    console.log('No nested public directory found in src.');
  }
  
  console.log('Directory structure cleanup complete!');
}

// Run the reorganization
reorganize(); 