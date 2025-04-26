// Production build script
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Ensure the script is run from the project root
const projectRoot = process.cwd();

// Create the scripts directory if it doesn't exist
if (!fs.existsSync(path.join(projectRoot, 'scripts'))) {
  fs.mkdirSync(path.join(projectRoot, 'scripts'));
}

console.log('🚀 Starting production build process...');

// Check if .env file exists
if (!fs.existsSync(path.join(projectRoot, '.env'))) {
  console.warn('⚠️  No .env file found. Make sure all environment variables are set in your deployment environment.');
}

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync(path.join(projectRoot, 'dist'))) {
    fs.rmSync(path.join(projectRoot, 'dist'), { recursive: true, force: true });
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Run linting
  console.log('🔍 Linting code...');
  execSync('npm run lint', { stdio: 'inherit' });

  // Build for production
  console.log('🏗️  Building for production...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify build
  if (fs.existsSync(path.join(projectRoot, 'dist'))) {
    console.log('✅ Production build completed successfully!');
    console.log('📁 Build output is in the "dist" directory');
  } else {
    throw new Error('Build directory not found after build process');
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
