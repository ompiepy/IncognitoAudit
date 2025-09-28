/**
 * Environment Configuration for Midnight Protocol
 * 
 * This module manages environment-specific configurations for different
 * deployment environments (development, testnet, mainnet).
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export interface EnvironmentConfig {
  name: string;
  network: 'testnet' | 'mainnet';
  rpcUrl: string;
  apiKey?: string;
  proofServerUrl?: string;
  contractAddress?: string;
  gasLimit: number;
  gasPrice: string;
  explorerUrl: string;
  faucetUrl?: string;
  useOfficialSDK: boolean;
  walletConfig: {
    privateKey: string;
    address: string;
    mnemonic?: string;
  };
}

export interface WalletConfig {
  privateKey: string;
  address: string;
  mnemonic?: string;
}

export interface DatabaseConfig {
  url: string;
  name: string;
  ssl: boolean;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'text';
  file?: string;
}

export interface FullConfig {
  environment: EnvironmentConfig;
  wallet: WalletConfig;
  database?: DatabaseConfig;
  logging: LoggingConfig;
  features: {
    enableProofGeneration: boolean;
    enableTransactionSubmission: boolean;
    enableContractVerification: boolean;
    enablePrivateStateManagement: boolean;
  };
}

/**
 * Environment configurations
 */
const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'Development',
    network: 'testnet',
    rpcUrl: 'http://localhost:8545',
    gasLimit: 5000000,
    gasPrice: '0x1',
    explorerUrl: 'http://localhost:3000/explorer',
    faucetUrl: 'http://localhost:3000/faucet',
    useOfficialSDK: false,
    walletConfig: {
      privateKey: process.env.MIDNIGHT_PRIVATE_KEY || '',
      address: process.env.MIDNIGHT_WALLET_ADDRESS || '',
      mnemonic: process.env.MIDNIGHT_MNEMONIC
    }
  },
  testnet: {
    name: 'Midnight Testnet',
    network: 'testnet',
    rpcUrl: 'https://testnet.midnight.network',
    apiKey: process.env.MIDNIGHT_API_KEY,
    proofServerUrl: 'https://proof-server-testnet.midnight.network',
    gasLimit: 5000000,
    gasPrice: '0x1',
    explorerUrl: 'https://testnet-explorer.midnight.network',
    faucetUrl: 'https://testnet-faucet.midnight.network',
    useOfficialSDK: true,
    walletConfig: {
      privateKey: process.env.MIDNIGHT_PRIVATE_KEY || '',
      address: process.env.MIDNIGHT_WALLET_ADDRESS || '',
      mnemonic: process.env.MIDNIGHT_MNEMONIC
    }
  },
  mainnet: {
    name: 'Midnight Mainnet',
    network: 'mainnet',
    rpcUrl: 'https://mainnet.midnight.network',
    apiKey: process.env.MIDNIGHT_API_KEY,
    proofServerUrl: 'https://proof-server.midnight.network',
    gasLimit: 10000000,
    gasPrice: '0x2',
    explorerUrl: 'https://explorer.midnight.network',
    useOfficialSDK: true,
    walletConfig: {
      privateKey: process.env.MIDNIGHT_PRIVATE_KEY || '',
      address: process.env.MIDNIGHT_WALLET_ADDRESS || '',
      mnemonic: process.env.MIDNIGHT_MNEMONIC
    }
  }
};

/**
 * Load configuration from environment variables
 */
export function loadConfig(): FullConfig {
  const env = process.env.NODE_ENV || 'development';
  const environment = environments[env] || environments.development;

  // Validate required environment variables
  validateEnvironmentVariables(env);

  const config: FullConfig = {
    environment: {
      ...environment,
      contractAddress: process.env.CONTRACT_ADDRESS || environment.contractAddress
    },
    wallet: {
      privateKey: process.env.MIDNIGHT_PRIVATE_KEY || '',
      address: process.env.MIDNIGHT_WALLET_ADDRESS || '',
      mnemonic: process.env.MIDNIGHT_MNEMONIC
    },
    database: process.env.DATABASE_URL ? {
      url: process.env.DATABASE_URL,
      name: process.env.DATABASE_NAME || 'zk_compliance_auditor',
      ssl: process.env.DATABASE_SSL === 'true'
    } : undefined,
    logging: {
      level: (process.env.LOG_LEVEL as any) || 'info',
      format: (process.env.LOG_FORMAT as any) || 'text',
      file: process.env.LOG_FILE
    },
    features: {
      enableProofGeneration: process.env.ENABLE_PROOF_GENERATION !== 'false',
      enableTransactionSubmission: process.env.ENABLE_TRANSACTION_SUBMISSION !== 'false',
      enableContractVerification: process.env.ENABLE_CONTRACT_VERIFICATION !== 'false',
      enablePrivateStateManagement: process.env.ENABLE_PRIVATE_STATE_MANAGEMENT !== 'false'
    }
  };

  return config;
}

/**
 * Validate required environment variables
 */
function validateEnvironmentVariables(env: string): void {
  const requiredVars = ['MIDNIGHT_PRIVATE_KEY'];
  
  if (env === 'mainnet') {
    requiredVars.push('MIDNIGHT_API_KEY');
  }

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig(env: string = process.env.NODE_ENV || 'development'): EnvironmentConfig {
  return environments[env] || environments.development;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running on testnet
 */
export function isTestnet(): boolean {
  return process.env.MIDNIGHT_NETWORK === 'testnet' || process.env.NODE_ENV === 'testnet';
}

/**
 * Check if running on mainnet
 */
export function isMainnet(): boolean {
  return process.env.MIDNIGHT_NETWORK === 'mainnet' || process.env.NODE_ENV === 'production';
}

/**
 * Get contract address for current environment
 */
export function getContractAddress(): string {
  const config = loadConfig();
  return config.environment.contractAddress || '';
}

/**
 * Get RPC URL for current environment
 */
export function getRpcUrl(): string {
  const config = loadConfig();
  return config.environment.rpcUrl;
}

/**
 * Get network ID for current environment
 */
export function getNetworkId(): 'testnet' | 'mainnet' {
  const config = loadConfig();
  return config.environment.network;
}

/**
 * Create environment-specific .env file
 */
export function createEnvFile(env: string, outputPath: string = '.env'): void {
  const environment = environments[env];
  if (!environment) {
    throw new Error(`Unknown environment: ${env}`);
  }

  const envContent = `# ${environment.name} Configuration
NODE_ENV=${env}
MIDNIGHT_NETWORK=${environment.network}
MIDNIGHT_RPC_URL=${environment.rpcUrl}
${environment.apiKey ? `MIDNIGHT_API_KEY=${environment.apiKey}` : '# MIDNIGHT_API_KEY=your_api_key_here'}
${environment.proofServerUrl ? `MIDNIGHT_PROOF_SERVER_URL=${environment.proofServerUrl}` : '# MIDNIGHT_PROOF_SERVER_URL=your_proof_server_url_here'}

# Contract Configuration
CONTRACT_ADDRESS=${environment.contractAddress || '0x0000000000000000000000000000000000000000'}

# Wallet Configuration
MIDNIGHT_PRIVATE_KEY=your_private_key_here
MIDNIGHT_WALLET_ADDRESS=your_wallet_address_here
# MIDNIGHT_MNEMONIC=your_mnemonic_here

# Gas Configuration
MIDNIGHT_GAS_LIMIT=${environment.gasLimit}
MIDNIGHT_GAS_PRICE=${environment.gasPrice}

# Database Configuration (optional)
# DATABASE_URL=your_database_url_here
# DATABASE_NAME=zk_compliance_auditor
# DATABASE_SSL=true

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=text
# LOG_FILE=logs/app.log

# Feature Flags
ENABLE_PROOF_GENERATION=true
ENABLE_TRANSACTION_SUBMISSION=true
ENABLE_CONTRACT_VERIFICATION=true
ENABLE_PRIVATE_STATE_MANAGEMENT=true

# SDK Configuration
MIDNIGHT_USE_OFFICIAL_SDK=false
`;

  require('fs').writeFileSync(outputPath, envContent);
  console.log(`✅ Environment file created: ${outputPath}`);
}

// Export default configuration
export const config = loadConfig();
export default config;
