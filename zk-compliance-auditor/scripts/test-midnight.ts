#!/usr/bin/env node

/**
 * Midnight Protocol Test Runner
 * 
 * This script runs comprehensive tests for Midnight Protocol integration
 * across different environments and configurations.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { loadConfig, createEnvFile } from '../config/environments';

interface TestConfig {
  environment: string;
  network: 'testnet' | 'mainnet';
  useOfficialSDK: boolean;
  verbose: boolean;
  coverage: boolean;
  timeout: number;
}

class MidnightTestRunner {
  private config: TestConfig;
  private results: any[] = [];

  constructor(config: TestConfig) {
    this.config = config;
  }

  /**
   * Run all Midnight Protocol tests
   */
  async runTests(): Promise<void> {
    console.log('🧪 Starting Midnight Protocol Test Suite...\n');

    try {
      // Set up test environment
      await this.setupTestEnvironment();

      // Run different test categories
      await this.runUnitTests();
      await this.runIntegrationTests();
      await this.runContractTests();
      await this.runPerformanceTests();
      await this.runSecurityTests();

      // Generate test report
      await this.generateTestReport();

      console.log('\n✅ All tests completed successfully!');

    } catch (error) {
      console.error('\n❌ Test suite failed:', error);
      process.exit(1);
    }
  }

  /**
   * Set up test environment
   */
  private async setupTestEnvironment(): Promise<void> {
    console.log('🔧 Setting up test environment...');

    // Create test environment file
    const testEnvPath = path.join(process.cwd(), '.env.test');
    createEnvFile(this.config.environment, testEnvPath);

    // Set environment variables
    process.env.NODE_ENV = this.config.environment;
    process.env.MIDNIGHT_NETWORK = this.config.network;
    process.env.MIDNIGHT_USE_OFFICIAL_SDK = this.config.useOfficialSDK.toString();

    console.log(`📋 Environment: ${this.config.environment}`);
    console.log(`🌐 Network: ${this.config.network}`);
    console.log(`🔧 Official SDK: ${this.config.useOfficialSDK ? 'Yes' : 'No'}`);
    console.log('✅ Test environment ready\n');
  }

  /**
   * Run unit tests
   */
  private async runUnitTests(): Promise<void> {
    console.log('🔬 Running unit tests...');
    
    try {
      const command = this.buildTestCommand('tests/unit/**/*.test.ts');
      const result = this.executeTestCommand(command, 'Unit Tests');
      this.results.push(result);
    } catch (error) {
      console.error('❌ Unit tests failed:', error);
      throw error;
    }
  }

  /**
   * Run integration tests
   */
  private async runIntegrationTests(): Promise<void> {
    console.log('🔗 Running integration tests...');
    
    try {
      const command = this.buildTestCommand('tests/integration/**/*.test.ts');
      const result = this.executeTestCommand(command, 'Integration Tests');
      this.results.push(result);
    } catch (error) {
      console.error('❌ Integration tests failed:', error);
      throw error;
    }
  }

  /**
   * Run contract tests
   */
  private async runContractTests(): Promise<void> {
    console.log('📄 Running contract tests...');
    
    try {
      const command = 'cd contracts && npm test';
      const result = this.executeTestCommand(command, 'Contract Tests');
      this.results.push(result);
    } catch (error) {
      console.error('❌ Contract tests failed:', error);
      throw error;
    }
  }

  /**
   * Run performance tests
   */
  private async runPerformanceTests(): Promise<void> {
    console.log('⚡ Running performance tests...');
    
    try {
      const command = this.buildTestCommand('tests/performance/**/*.test.ts');
      const result = this.executeTestCommand(command, 'Performance Tests');
      this.results.push(result);
    } catch (error) {
      console.error('❌ Performance tests failed:', error);
      throw error;
    }
  }

  /**
   * Run security tests
   */
  private async runSecurityTests(): Promise<void> {
    console.log('🔒 Running security tests...');
    
    try {
      const command = this.buildTestCommand('tests/security/**/*.test.ts');
      const result = this.executeTestCommand(command, 'Security Tests');
      this.results.push(result);
    } catch (error) {
      console.error('❌ Security tests failed:', error);
      throw error;
    }
  }

  /**
   * Build test command
   */
  private buildTestCommand(pattern: string): string {
    const baseCommand = 'npx jest';
    const options = [
      pattern,
      '--verbose',
      '--detectOpenHandles',
      '--forceExit',
      `--testTimeout=${this.config.timeout}`
    ];

    if (this.config.coverage) {
      options.push('--coverage');
    }

    return `${baseCommand} ${options.join(' ')}`;
  }

  /**
   * Execute test command
   */
  private executeTestCommand(command: string, testType: string): any {
    const startTime = Date.now();
    
    try {
      console.log(`  Running: ${command}`);
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: this.config.verbose ? 'inherit' : 'pipe'
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`✅ ${testType} passed (${duration}ms)\n`);

      return {
        type: testType,
        status: 'passed',
        duration,
        output: this.config.verbose ? output : undefined
      };

    } catch (error: any) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`❌ ${testType} failed (${duration}ms)\n`);

      return {
        type: testType,
        status: 'failed',
        duration,
        error: error.message,
        output: error.stdout || error.stderr
      };
    }
  }

  /**
   * Generate test report
   */
  private async generateTestReport(): Promise<void> {
    console.log('📊 Generating test report...');

    const report = {
      timestamp: new Date().toISOString(),
      environment: this.config.environment,
      network: this.config.network,
      useOfficialSDK: this.config.useOfficialSDK,
      results: this.results,
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.status === 'passed').length,
        failed: this.results.filter(r => r.status === 'failed').length,
        totalDuration: this.results.reduce((sum, r) => sum + r.duration, 0)
      }
    };

    // Save report to file
    const reportPath = path.join(process.cwd(), 'test-results', `midnight-test-report-${Date.now()}.json`);
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Print summary
    console.log('\n📋 Test Summary:');
    console.log(`  Total Tests: ${report.summary.total}`);
    console.log(`  Passed: ${report.summary.passed}`);
    console.log(`  Failed: ${report.summary.failed}`);
    console.log(`  Total Duration: ${report.summary.totalDuration}ms`);
    console.log(`  Report saved to: ${reportPath}`);

    if (report.summary.failed > 0) {
      console.log('\n❌ Some tests failed. Check the report for details.');
      process.exit(1);
    }
  }
}

/**
 * Parse command line arguments
 */
function parseArguments(): TestConfig {
  const args = process.argv.slice(2);
  
  const config: TestConfig = {
    environment: 'testnet',
    network: 'testnet',
    useOfficialSDK: false,
    verbose: false,
    coverage: false,
    timeout: 30000
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--environment':
      case '-e':
        config.environment = args[++i] || 'testnet';
        break;
      case '--network':
      case '-n':
        config.network = (args[++i] as 'testnet' | 'mainnet') || 'testnet';
        break;
      case '--official-sdk':
        config.useOfficialSDK = true;
        break;
      case '--verbose':
      case '-v':
        config.verbose = true;
        break;
      case '--coverage':
      case '-c':
        config.coverage = true;
        break;
      case '--timeout':
      case '-t':
        config.timeout = parseInt(args[++i]) || 30000;
        break;
      case '--help':
      case '-h':
        console.log(`
Midnight Protocol Test Runner

Usage: tsx scripts/test-midnight.ts [options]

Options:
  -e, --environment <env>    Test environment (testnet, mainnet) [default: testnet]
  -n, --network <network>    Midnight network (testnet, mainnet) [default: testnet]
  --official-sdk            Use official Midnight Protocol SDK
  -v, --verbose             Verbose output
  -c, --coverage            Generate coverage report
  -t, --timeout <ms>        Test timeout in milliseconds [default: 30000]
  -h, --help                Show this help message

Examples:
  tsx scripts/test-midnight.ts --environment testnet --verbose
  tsx scripts/test-midnight.ts --network mainnet --official-sdk --coverage
        `);
        process.exit(0);
    }
  }

  return config;
}

/**
 * Main function
 */
async function main() {
  const config = parseArguments();
  const runner = new MidnightTestRunner(config);
  
  await runner.runTests();
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { MidnightTestRunner, TestConfig };
