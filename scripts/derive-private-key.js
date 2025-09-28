#!/usr/bin/env node

/**
 * Derive Private Key from Mnemonic
 * 
 * This script helps you derive your Midnight wallet private key from your mnemonic phrase
 */

const { ethers } = require('ethers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function derivePrivateKey() {
  console.log('🔐 Derive Private Key from Mnemonic\n');
  
  try {
    // Get mnemonic phrase
    const mnemonic = await question('🔑 Enter your 24-word mnemonic phrase: ');
    
    if (!mnemonic || mnemonic.split(' ').length !== 24) {
      console.log('❌ Invalid mnemonic phrase. Must be 24 words.');
      process.exit(1);
    }

    // Derive wallet
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    
    console.log('\n✅ Wallet derived successfully!');
    console.log(`📍 Address: ${wallet.address}`);
    console.log(`🔑 Private Key: ${wallet.privateKey}`);
    
    console.log('\n🔒 Security reminder:');
    console.log('- Keep your private key secure');
    console.log('- Never share it with anyone');
    console.log('- Store it in a safe place');
    
    // Ask if they want to save to .env
    const saveToEnv = await question('\n💾 Save to .env file? (y/N): ');
    
    if (saveToEnv.toLowerCase() === 'y') {
      const fs = require('fs');
      const path = require('path');
      const crypto = require('crypto');
      
      const envPath = path.join(__dirname, '..', '.env');
      
      // Generate encryption key
      const encryptionKey = crypto.randomBytes(32).toString('hex');
      
      const envContent = `# Midnight Protocol Configuration
MIDNIGHT_RPC_URL="https://testnet.midnight.network"
MIDNIGHT_NETWORK_ID="testnet"
MIDNIGHT_API_KEY=""

# Midnight Proof Server
MIDNIGHT_PROOF_SERVER_URL="https://proof-server-testnet.midnight.network"

# Wallet Configuration
MIDNIGHT_PRIVATE_KEY="${wallet.privateKey}"
MIDNIGHT_WALLET_ADDRESS="${wallet.address}"
MIDNIGHT_MNEMONIC="${mnemonic}"

# Contract Addresses (will be set after deployment)
ZK_COMPLIANCE_CONTRACT_ADDRESS=""

# Encryption Key
ENCRYPTION_KEY="${encryptionKey}"

# Environment
NODE_ENV="development"
MIDNIGHT_USE_OFFICIAL_SDK="true"
`;

      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ .env file created successfully!');
    }

  } catch (error) {
    console.error('❌ Error deriving private key:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run derivation
derivePrivateKey();
