#!/usr/bin/env node

/**
 * Quick Setup Script for ZK Compliance Auditor Demo
 * 
 * Sets up the project for a 2-minute demo presentation
 */

const { spawn } = require('child_process');
const path = require('path');

console.log(`
🌟 ZK Compliance Auditor - Quick Demo Setup
===========================================

This script will:
1. Install all dependencies
2. Build the project components  
3. Start the demo environment
4. Open the dashboard in your browser

Press Ctrl+C at any time to stop the demo.
`);

async function quickSetup() {
  try {
    console.log('⚡ Starting quick setup...\n');
    
    // Run build script
    console.log('🔨 Building project...');
    await runCommand('node', ['scripts/build-all.js']);
    
    console.log('\n🚀 Starting demo environment...');
    
    // Start the demo
    await runCommand('node', ['scripts/demo-flow.js']);
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    console.log('\n📋 Manual setup instructions:');
    console.log('1. npm install');
    console.log('2. cd dashboard && npm install && npm run dev');
    console.log('3. Open http://localhost:3000');
  }
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

if (require.main === module) {
  quickSetup();
}