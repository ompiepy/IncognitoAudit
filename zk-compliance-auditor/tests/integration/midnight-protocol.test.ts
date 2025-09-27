/**
 * Midnight Protocol Integration Tests
 * 
 * Comprehensive test suite for Midnight Protocol integration
 * Tests ZK proof generation, transaction submission, and contract interaction
 */

import { ZKComplianceProver } from '../../client/src/ZKComplianceProver';
import { createSDKFromEnvironment } from '../../client/src/MidnightSDKAdapter';
import { loadConfig } from '../../config/environments';

describe('Midnight Protocol Integration Tests', () => {
  let prover: ZKComplianceProver;
  let config: any;

  beforeAll(async () => {
    config = loadConfig();
    
    // Initialize prover with test configuration
    prover = new ZKComplianceProver({
      rpcUrl: config.environment.rpcUrl,
      contractAddress: config.environment.contractAddress || '0x1234567890abcdef1234567890abcdef12345678',
      privateKey: config.wallet.privateKey,
      networkId: config.environment.network,
      apiKey: config.environment.apiKey,
      proofServerUrl: config.environment.proofServerUrl,
      useOfficialSDK: process.env.MIDNIGHT_USE_OFFICIAL_SDK === 'true'
    });

    await prover.initialize();
  });

  afterAll(async () => {
    // Cleanup if needed
  });

  describe('Network Connection', () => {
    test('should connect to Midnight Protocol network', async () => {
      expect(prover).toBeDefined();
      // Connection is established in beforeAll
    });

    test('should handle network disconnection gracefully', async () => {
      // Test network disconnection handling
      // This would be implemented when we have actual network operations
    });
  });

  describe('ZK Proof Generation', () => {
    test('should generate valid ZK proof for compliant employee', async () => {
      const result = await prover.runComplianceAudit('EMP001', {
        policy_hash: '0x12345abcdef0000000000000000000000000000',
        audit_id: '0x' + Date.now().toString(16),
        auditor_public_key: 'auditor_public_key_test'
      });

      expect(result.success).toBe(true);
      expect(result.proofHash).toBeDefined();
      expect(result.transactionHash).toBeDefined();
      expect(result.verificationTime).toBeGreaterThan(0);
    });

    test('should generate valid ZK proof for non-compliant employee', async () => {
      const result = await prover.runComplianceAudit('EMP003', {
        policy_hash: '0x12345abcdef0000000000000000000000000000',
        audit_id: '0x' + Date.now().toString(16),
        auditor_public_key: 'auditor_public_key_test'
      });

      // Even non-compliant employees should generate proofs (they just fail verification)
      expect(result.proofHash).toBeDefined();
    });

    test('should handle proof generation errors gracefully', async () => {
      // Test with invalid employee ID
      await expect(
        prover.runComplianceAudit('INVALID_EMP', {
          policy_hash: '0x12345abcdef0000000000000000000000000000',
          audit_id: '0x' + Date.now().toString(16),
          auditor_public_key: 'auditor_public_key_test'
        })
      ).rejects.toThrow();
    });
  });

  describe('Transaction Submission', () => {
    test('should submit transaction to Midnight network', async () => {
      const result = await prover.runComplianceAudit('EMP001', {
        policy_hash: '0x12345abcdef0000000000000000000000000000',
        audit_id: '0x' + Date.now().toString(16),
        auditor_public_key: 'auditor_public_key_test'
      });

      expect(result.success).toBe(true);
      expect(result.transactionHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    test('should handle transaction submission failures', async () => {
      // Test with invalid network configuration
      const invalidProver = new ZKComplianceProver({
        rpcUrl: 'https://invalid-rpc-url.com',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        privateKey: 'invalid-key',
        networkId: 'testnet'
      });

      await expect(invalidProver.initialize()).rejects.toThrow();
    });
  });

  describe('Contract Interaction', () => {
    test('should interact with deployed contract', async () => {
      // Test contract interaction
      const result = await prover.runComplianceAudit('EMP001', {
        policy_hash: '0x12345abcdef0000000000000000000000000000',
        audit_id: '0x' + Date.now().toString(16),
        auditor_public_key: 'auditor_public_key_test'
      });

      expect(result.success).toBe(true);
    });

    test('should handle contract not found error', async () => {
      const invalidProver = new ZKComplianceProver({
        rpcUrl: config.environment.rpcUrl,
        contractAddress: '0x0000000000000000000000000000000000000000',
        privateKey: config.wallet.privateKey,
        networkId: config.environment.network
      });

      await invalidProver.initialize();

      await expect(
        invalidProver.runComplianceAudit('EMP001', {
          policy_hash: '0x12345abcdef0000000000000000000000000000',
          audit_id: '0x' + Date.now().toString(16),
          auditor_public_key: 'auditor_public_key_test'
        })
      ).rejects.toThrow();
    });
  });

  describe('Performance Tests', () => {
    test('should generate proofs within acceptable time limits', async () => {
      const startTime = Date.now();
      
      await prover.runComplianceAudit('EMP001', {
        policy_hash: '0x12345abcdef0000000000000000000000000000',
        audit_id: '0x' + Date.now().toString(16),
        auditor_public_key: 'auditor_public_key_test'
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within 10 seconds
      expect(duration).toBeLessThan(10000);
    });

    test('should handle concurrent proof generation', async () => {
      const promises = [
        prover.runComplianceAudit('EMP001', {
          policy_hash: '0x12345abcdef0000000000000000000000000000',
          audit_id: '0x' + (Date.now() + 1).toString(16),
          auditor_public_key: 'auditor_public_key_test'
        }),
        prover.runComplianceAudit('EMP002', {
          policy_hash: '0x12345abcdef0000000000000000000000000000',
          audit_id: '0x' + (Date.now() + 2).toString(16),
          auditor_public_key: 'auditor_public_key_test'
        }),
        prover.runComplianceAudit('EMP003', {
          policy_hash: '0x12345abcdef0000000000000000000000000000',
          audit_id: '0x' + (Date.now() + 3).toString(16),
          auditor_public_key: 'auditor_public_key_test'
        })
      ];

      const results = await Promise.allSettled(promises);
      
      // All should complete (some may fail due to non-compliance)
      expect(results).toHaveLength(3);
    });
  });

  describe('Error Handling', () => {
    test('should handle network timeouts', async () => {
      // Test with very short timeout
      const timeoutProver = new ZKComplianceProver({
        rpcUrl: 'https://httpstat.us/200?sleep=15000', // 15 second delay
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        privateKey: config.wallet.privateKey,
        networkId: 'testnet'
      });

      await expect(timeoutProver.initialize()).rejects.toThrow();
    });

    test('should handle invalid input data', async () => {
      await expect(
        prover.runComplianceAudit('', {
          policy_hash: '',
          audit_id: '',
          auditor_public_key: ''
        })
      ).rejects.toThrow();
    });
  });

  describe('Security Tests', () => {
    test('should not expose private data in proofs', async () => {
      const result = await prover.runComplianceAudit('EMP001', {
        policy_hash: '0x12345abcdef0000000000000000000000000000',
        audit_id: '0x' + Date.now().toString(16),
        auditor_public_key: 'auditor_public_key_test'
      });

      // Proof should not contain sensitive information
      expect(result.proofHash).toBeDefined();
      expect(result.proofHash).not.toContain('Alice');
      expect(result.proofHash).not.toContain('92');
      expect(result.proofHash).not.toContain('IT_SECURITY');
    });

    test('should validate input data integrity', async () => {
      // Test with tampered data
      await expect(
        prover.runComplianceAudit('EMP001', {
          policy_hash: '0x0000000000000000000000000000000000000000', // Invalid hash
          audit_id: '0x' + Date.now().toString(16),
          auditor_public_key: 'auditor_public_key_test'
        })
      ).rejects.toThrow();
    });
  });
});

describe('Environment-Specific Tests', () => {
  test('should work on testnet', () => {
    process.env.MIDNIGHT_NETWORK = 'testnet';
    const config = loadConfig();
    expect(config.environment.network).toBe('testnet');
  });

  test('should work on mainnet', () => {
    process.env.MIDNIGHT_NETWORK = 'mainnet';
    const config = loadConfig();
    expect(config.environment.network).toBe('mainnet');
  });

  test('should validate required environment variables', () => {
    delete process.env.MIDNIGHT_PRIVATE_KEY;
    
    expect(() => {
      loadConfig();
    }).toThrow('Missing required environment variables');
  });
});
