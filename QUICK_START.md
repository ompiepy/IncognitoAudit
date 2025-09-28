# Quick Start Guide - Connect Your Midnight Account

## 🚀 Quick Setup (5 minutes)

### Step 1: Run the Setup Script
```bash
npm run setup:midnight
```

This interactive script will guide you through:
- Entering your Midnight wallet private key
- Setting your wallet address
- Configuring network settings
- Generating encryption keys

### Step 2: Get Your Midnight Account Info

**Option A: From Lace Wallet**
1. Install [Lace Wallet](https://lace.io/) browser extension
2. Create/import your Midnight wallet
3. Switch to Midnight testnet
4. Go to Settings → Security → Export Private Key
5. Copy your wallet address from the main screen

**Option B: From Existing Wallet**
- Use your existing private key and address
- Make sure you have test DUST tokens

### Step 3: Deploy Contracts
```bash
npm run deploy:testnet
```

### Step 4: Test Your Connection
```bash
npm run demo
```

## 🔧 Manual Setup

If you prefer manual setup:

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env with your details:**
   ```env
   MIDNIGHT_PRIVATE_KEY="0x1234567890abcdef..."
   MIDNIGHT_WALLET_ADDRESS="0xabcdef1234567890..."
   MIDNIGHT_MNEMONIC="word1 word2 word3 ..."
   MIDNIGHT_RPC_URL="https://testnet.midnight.network"
   MIDNIGHT_NETWORK_ID="testnet"
   ENCRYPTION_KEY="$(openssl rand -hex 32)"
   ```

3. **Deploy contracts:**
   ```bash
   npm run deploy:testnet
   ```

4. **Update contract address in .env:**
   ```env
   ZK_COMPLIANCE_CONTRACT_ADDRESS="0x..."
   ```

## 🧪 Test Your Setup

Run the demo to verify everything works:
```bash
npm run demo
```

You should see:
- ✅ Connected to Midnight Protocol network
- ✅ Data Service initialized successfully
- ✅ ZK proofs generated successfully
- ✅ Transactions submitted successfully

## 🖥️ Start the Dashboard

```bash
npm run dev:dashboard
```

Open http://localhost:3000 to see the compliance dashboard.

## 🔍 Troubleshooting

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

## 📚 Full Documentation

For detailed setup instructions, see:
- [MIDNIGHT_ACCOUNT_SETUP.md](./MIDNIGHT_ACCOUNT_SETUP.md) - Complete setup guide
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Production deployment
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Advanced deployment

## 🆘 Need Help?

1. Check the error logs in the console
2. Verify all environment variables are set
3. Ensure your Midnight wallet is properly configured
4. Make sure you have test DUST tokens

## 🎯 What's Next?

Once connected:
1. **Test thoroughly** on testnet
2. **Deploy to mainnet** when ready
3. **Integrate with real HR systems**
4. **Scale to production**

Your ZK Compliance Auditor is now connected to your Midnight account! 🎉
