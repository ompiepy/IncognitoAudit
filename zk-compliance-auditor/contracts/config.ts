/**
 * Contract configuration and deployment settings
 */

export const CONTRACT_CONFIG = {
  // Contract deployment settings
  contractName: 'ZKComplianceAuditor',
  version: '1.0.0',
  
  // ZK Circuit parameters
  maxConstraints: 1000000,
  provingKeyPath: './proving-keys/',
  verifyingKeyPath: './verifying-keys/',
  
  // Compliance policy settings
  policies: {
    TRAINING_COMPLIANCE: {
      id: 12345n,
      name: 'Mandatory Training Compliance',
      description: 'Verifies completion of Training A (within 365 days) and Training B (score >= 80%)',
      minScore: 80n,
      validityPeriodDays: 365n
    },
    SECURITY_COMPLIANCE: {
      id: 12346n, 
      name: 'Security Training Compliance',
      description: 'Verifies completion of security training modules',
      minScore: 85n,
      validityPeriodDays: 180n
    }
  },
  
  // Network configuration
  network: {
    testnet: {
      rpcUrl: 'https://testnet.midnight.network',
      contractAddress: '0x...' // To be populated after deployment
    },
    mainnet: {
      rpcUrl: 'https://mainnet.midnight.network', 
      contractAddress: '0x...' // To be populated after deployment
    }
  }
};

export default CONTRACT_CONFIG;