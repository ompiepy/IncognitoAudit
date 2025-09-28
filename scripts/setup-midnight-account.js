#!/usr/bin/env node

/**
 * Midnight Account Setup Script
 * 
 * This script helps you set up your Midnight account for the ZK Compliance Auditor
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupMidnightAccount() {
  console.log('🔐 Midnight Account Setup for ZK Compliance Auditor\n');
  
  try {
    // Check if .env already exists
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Setup cancelled.');
        process.exit(0);
      }
    }

    console.log('📋 Please provide your Midnight account information:\n');

    // Get wallet information
    const privateKey = await question('🔑 Enter your Midnight wallet private key (0x...): ');
    const walletAddress = await question('📍 Enter your Midnight wallet address (0x...): ');
    const mnemonic = await question('🔐 Enter your wallet mnemonic phrase (optional): ');
    
    // Get network configuration
    const networkId = await question('🌐 Network (testnet/mainnet) [testnet]: ') || 'testnet';
    const rpcUrl = await question(`🔗 RPC URL [https://${networkId}.midnight.network]: `) || `https://${networkId}.midnight.network`;
    
    // Get API key (optional)
    const apiKey = await question('🔑 API Key (optional): ');
    
    // Generate encryption key
    const encryptionKey = crypto.randomBytes(32).toString('hex');
    console.log(`\n🔐 Generated encryption key: ${encryptionKey}`);

    // Create .env content
    const envContent = `# Midnight Protocol Configuration
MIDNIGHT_RPC_URL="${rpcUrl}"
MIDNIGHT_NETWORK_ID="${networkId}"
MIDNIGHT_API_KEY="${apiKey}"

# Midnight Proof Server
MIDNIGHT_PROOF_SERVER_URL="https://proof-server-${networkId}.midnight.network"

# Wallet Configuration
MIDNIGHT_PRIVATE_KEY="${privateKey}"
MIDNIGHT_WALLET_ADDRESS="${walletAddress}"
MIDNIGHT_MNEMONIC="${mnemonic}"

# Contract Addresses (will be set after deployment)
ZK_COMPLIANCE_CONTRACT_ADDRESS=""

# Encryption Key
ENCRYPTION_KEY="${encryptionKey}"

# Environment
NODE_ENV="development"
MIDNIGHT_USE_OFFICIAL_SDK="true"
`;

    // Write .env file
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');

    // Validate configuration
    console.log('\n🔍 Validating configuration...');
    
    if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
      console.log('⚠️  Warning: Private key format may be incorrect (should be 0x + 64 hex chars)');
    }
    
    if (!walletAddress.startsWith('0x') || walletAddress.length !== 42) {
      console.log('⚠️  Warning: Wallet address format may be incorrect (should be 0x + 40 hex chars)');
    }

    console.log('\n🎯 Next steps:');
    console.log('1. Deploy contracts: npm run deploy:testnet');
    console.log('2. Update ZK_COMPLIANCE_CONTRACT_ADDRESS in .env');
    console.log('3. Test connection: npm run demo');
    console.log('4. Start dashboard: npm run dev:dashboard');

    console.log('\n🔒 Security reminders:');
    console.log('- Never share your private key');
    console.log('- Keep your .env file secure');
    console.log('- Use testnet first before mainnet');
    console.log('- Backup your mnemonic phrase');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup
setupMidnightAccount();
