#!/usr/bin/env node

/**
 * Build Script for ZK Compliance Auditor
 * 
 * Builds all components of the project in the correct order
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '..');

class ProjectBuilder {
  constructor() {
    this.buildSteps = [
      // Mock Data System removed - using real DataService
      {
        name: 'ZK Contracts',
        path: 'contracts', 
        command: 'npm',
        args: ['run', 'build'],
        required: false
      },
      {
        name: 'Client Prover',
        path: 'client',
        command: 'npm',
        args: ['run', 'build'],
        required: true
      },
      {
        name: 'React Dashboard',
        path: 'dashboard',
        command: 'npm',
        args: ['run', 'build'],
        required: true
      }
    ];
  }

  async buildAll() {
    console.log('🔨 Starting ZK Compliance Auditor Build Process...\n');
    
    try {
      // First, install all dependencies
      await this.installDependencies();
      
      // Then build each component
      for (const step of this.buildSteps) {
        await this.buildComponent(step);
      }
      
      console.log('\n✅ Build completed successfully!');
      console.log('\n🚀 To run the demo:');
      console.log('   npm run demo');
      console.log('\n🖥️  To start the dashboard:');
      console.log('   cd dashboard && npm run dev');
      console.log('\n🔐 To run the client prover:');
      console.log('   cd client && npm run dev');
      
    } catch (error) {
      console.error('\n❌ Build failed:', error);
      process.exit(1);
    }
  }

  async installDependencies() {
    console.log('📦 Installing dependencies...\n');
    
    const components = ['', 'contracts', 'client', 'dashboard'];
    
    for (const component of components) {
      const componentPath = component ? path.join(PROJECT_ROOT, component) : PROJECT_ROOT;
      const packageJsonPath = path.join(componentPath, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        console.log(`Installing ${component || 'root'} dependencies...`);
        await this.runCommand('npm', ['install'], componentPath);
      }
    }
  }

  async buildComponent(step) {
    const componentPath = path.join(PROJECT_ROOT, step.path);
    
    console.log(`🔨 Building ${step.name}...`);
    
    if (!fs.existsSync(componentPath)) {
      console.log(`⚠️  ${step.name} directory not found, skipping...`);
      return;
    }

    const packageJsonPath = path.join(componentPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`⚠️  ${step.name} package.json not found, skipping...`);
      return;
    }

    try {
      await this.runCommand(step.command, step.args, componentPath);
      console.log(`✅ ${step.name} built successfully`);
    } catch (error) {
      if (step.required) {
        throw new Error(`Failed to build ${step.name}: ${error.message}`);
      } else {
        console.log(`⚠️  ${step.name} build failed (non-critical): ${error.message}`);
      }
    }
  }

  runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, {
        cwd,
        stdio: 'pipe',
        shell: true
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
        // Only show important output to avoid spam
        const output = data.toString().trim();
        if (output.includes('error') || output.includes('Error') || output.includes('success') || output.includes('built')) {
          console.log(`  ${output}`);
        }
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
        const output = data.toString().trim();
        if (!output.includes('deprecated') && !output.includes('npm WARN')) {
          console.log(`  ${output}`);
        }
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }
}

// Run the build
if (require.main === module) {
  const builder = new ProjectBuilder();
  builder.buildAll().catch(console.error);
}

module.exports = ProjectBuilder;