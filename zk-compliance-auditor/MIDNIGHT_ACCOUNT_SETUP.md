# Midnight Account Setup Guide

This guide will help you connect your Midnight account to the ZK Compliance Auditor.

## Prerequisites

1. **Midnight Wallet**: Install the Lace wallet extension in your browser
2. **Test DUST Tokens**: Get test tokens from the Midnight testnet faucet
3. **Midnight Account**: Create an account on the Midnight testnet

## Step 1: Install Lace Wallet

1. Go to [Lace Wallet](https://lace.io/)
2. Install the browser extension (Chrome recommended)
3. Create a new wallet or import an existing one
4. Switch to Midnight testnet

## Step 2: Get Test DUST Tokens

1. Open your Lace wallet
2. Switch to Midnight testnet
3. Go to the faucet section
4. Request test DUST tokens (you'll need these for transactions)

## Step 3: Get Your Wallet Information

### Option A: From Lace Wallet Extension

1. Open Lace wallet
2. Go to Settings → Security
3. Export your private key (keep this secure!)
4. Copy your wallet address

### Option B: From Wallet Recovery

If you have your mnemonic phrase:
1. Use a tool like `@midnight-ntwrk/wallet` to derive your private key
2. Or use the Lace wallet to import and export

## Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual values:
   ```bash
   nano .env
   ```

3. Fill in your Midnight account details:
   ```env
   # Your actual Midnight wallet private key
   MIDNIGHT_PRIVATE_KEY="0x1234567890abcdef..."
   
   # Your Midnight wallet address
   MIDNIGHT_WALLET_ADDRESS="0xabcdef1234567890..."
   
   # Your wallet mnemonic (optional but recommended)
   MIDNIGHT_MNEMONIC="word1 word2 word3 ... word24"
   
   # Midnight network configuration
   MIDNIGHT_RPC_URL="https://testnet.midnight.network"
   MIDNIGHT_NETWORK_ID="testnet"
   
   # API key if you have one (optional)
   MIDNIGHT_API_KEY="your_api_key_here"
   
   # Proof server URL
   MIDNIGHT_PROOF_SERVER_URL="https://proof-server-testnet.midnight.network"
   
   # Generate a strong encryption key
   ENCRYPTION_KEY="$(openssl rand -hex 32)"
   ```

## Step 5: Generate Encryption Key

Generate a secure encryption key for the private state manager:

```bash
# Generate a 32-byte encryption key
openssl rand -hex 32
```

Copy the output and use it as your `ENCRYPTION_KEY` in the `.env` file.

## Step 6: Deploy Contracts

Deploy the ZK compliance contracts to Midnight testnet:

```bash
# Deploy to testnet
npm run deploy:testnet
```

This will output a contract address. Update `ZK_COMPLIANCE_CONTRACT_ADDRESS` in your `.env` file.

## Step 7: Test Your Connection

Run the demo to test your Midnight account connection:

```bash
# Test with your Midnight account
npm run demo
```

## Step 8: Verify Connection

Check that everything is working:

1. **Wallet Connection**: You should see "Connected to Midnight Protocol network"
2. **Data Loading**: Employee data should load successfully
3. **ZK Proofs**: Proofs should generate using your account
4. **Transactions**: Transactions should be submitted to Midnight testnet

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Keep your private key secure** - never share it
3. **Use testnet first** - test thoroughly before mainnet
4. **Backup your mnemonic** - store it securely offline
5. **Use strong encryption keys** - generate them randomly

## Troubleshooting

### "Failed to connect to Midnight Protocol"
- Check your `MIDNIGHT_RPC_URL` is correct
- Verify your wallet has DUST tokens
- Check your private key format (should start with 0x)

### "Transaction failed"
- Ensure you have enough DUST tokens for gas
- Check the contract address is correct
- Verify your private key is valid

### "Invalid wallet address"
- Make sure your address starts with 0x
- Check the address length (should be 42 characters)
- Verify it's a valid Midnight address

## Production Setup

For mainnet deployment:

1. Change `MIDNIGHT_NETWORK_ID` to `"mainnet"`
2. Update `MIDNIGHT_RPC_URL` to mainnet endpoint
3. Get mainnet DUST tokens
4. Deploy contracts to mainnet
5. Update contract addresses

## Support

If you need help:
1. Check the Midnight Protocol documentation
2. Join the Midnight Discord community
3. Review the error logs in the console
4. Ensure all environment variables are set correctly

## Example .env File

```env
# Midnight Protocol Configuration
MIDNIGHT_RPC_URL="https://testnet.midnight.network"
MIDNIGHT_NETWORK_ID="testnet"
MIDNIGHT_API_KEY=""

# Wallet Configuration
MIDNIGHT_PRIVATE_KEY="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
MIDNIGHT_WALLET_ADDRESS="0xabcdef1234567890abcdef1234567890abcdef12"
MIDNIGHT_MNEMONIC="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"

# Contract Addresses
ZK_COMPLIANCE_CONTRACT_ADDRESS="0x1234567890abcdef1234567890abcdef12345678"

# Encryption
ENCRYPTION_KEY="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"

# Environment
NODE_ENV="development"
MIDNIGHT_USE_OFFICIAL_SDK="true"
```

Remember to replace all placeholder values with your actual Midnight account information!
