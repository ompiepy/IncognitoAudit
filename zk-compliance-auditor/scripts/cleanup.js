#!/usr/bin/env node

/**
 * Cleanup Script for ZK Compliance Auditor
 * 
 * This script kills any remaining processes from the demo
 */

const { exec } = require('child_process');
const path = require('path');

async function cleanup() {
  console.log('🧹 Cleaning up ZK Compliance Auditor processes...\n');
  
  try {
    // Kill Node.js processes running the client
    console.log('🔍 Looking for client processes...');
    await killProcessesByCommand('tsx src/index.ts');
    
    // Kill Next.js processes
    console.log('🔍 Looking for dashboard processes...');
    await killProcessesByCommand('next dev');
    
    // Kill any processes using port 3000
    console.log('🔍 Looking for processes on port 3000...');
    await killProcessesOnPort(3000);
    
    // Kill any processes using port 3001 (if used)
    console.log('🔍 Looking for processes on port 3001...');
    await killProcessesOnPort(3001);
    
    console.log('✅ Cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

function killProcessesByCommand(commandPattern) {
  return new Promise((resolve) => {
    exec(`pgrep -f "${commandPattern}"`, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log(`   ℹ️  No processes found matching "${commandPattern}"`);
        resolve();
        return;
      }
      
      const pids = stdout.trim().split('\n');
      console.log(`   🔍 Found ${pids.length} process(es) matching "${commandPattern}"`);
      
      pids.forEach(pid => {
        exec(`kill -TERM ${pid}`, (killError) => {
          if (killError) {
            console.log(`   ⚠️  Could not kill process ${pid}: ${killError.message}`);
          } else {
            console.log(`   ✅ Killed process ${pid}`);
          }
        });
      });
      
      // Wait a bit for graceful shutdown
      setTimeout(() => {
        pids.forEach(pid => {
          exec(`kill -KILL ${pid} 2>/dev/null`, () => {
            // Ignore errors on force kill
          });
        });
        resolve();
      }, 2000);
    });
  });
}

function killProcessesOnPort(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log(`   ℹ️  No processes found on port ${port}`);
        resolve();
        return;
      }
      
      const pids = stdout.trim().split('\n');
      console.log(`   🔍 Found ${pids.length} process(es) on port ${port}`);
      
      pids.forEach(pid => {
        exec(`kill -TERM ${pid}`, (killError) => {
          if (killError) {
            console.log(`   ⚠️  Could not kill process ${pid}: ${killError.message}`);
          } else {
            console.log(`   ✅ Killed process ${pid} on port ${port}`);
          }
        });
      });
      
      // Wait a bit for graceful shutdown
      setTimeout(() => {
        pids.forEach(pid => {
          exec(`kill -KILL ${pid} 2>/dev/null`, () => {
            // Ignore errors on force kill
          });
        });
        resolve();
      }, 2000);
    });
  });
}

// Run cleanup if this file is executed directly
if (require.main === module) {
  cleanup().then(() => {
    console.log('\n🎉 All processes cleaned up!');
    process.exit(0);
  });
}

module.exports = { cleanup };
