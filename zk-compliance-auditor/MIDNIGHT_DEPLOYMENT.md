# Midnight Network Deployment Guide

This guide walks you through deploying your ZK Compliance Auditor to the actual Midnight network.

## Prerequisites

### 1. Install Required Tools

**Docker** (for proof server):
```bash
# Install Docker if not already installed
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

**Lace Wallet**:
- Install from [Chrome Web Store](https://chrome.google.com/webstore)
- Create a new wallet or import existing one
- Switch to Midnight testnet

### 2. Get Test Tokens

1. Open Lace wallet
2. Switch to Midnight testnet
3. Visit the [Midnight Faucet](https://testnet-faucet.midnight.network)
4. Request tDUST tokens for your wallet address

### 3. Verify Your Setup

```bash
# Check if your wallet is configured
npm run setup:midnight

# Verify environment variables
cat .env | grep MIDNIGHT
```

## Deployment Steps

### Step 1: Start the Proof Server

The proof server generates zero-knowledge proofs locally:

```bash
# Start proof server in background
docker run -d -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'

# Verify it's running
curl http://localhost:6300/health
```

### Step 2: Deploy to Midnight Network

```bash
# Deploy to testnet
npm run deploy:midnight

# Or deploy to production
npm run deploy:production
```

### Step 3: Verify Deployment

After deployment, you'll get:
- Contract address
- Transaction hash
- Block number
- Gas used

Verify on the [Midnight Explorer](https://testnet-explorer.midnight.network)

## Production Configuration

### Environment Variables

Create a production `.env` file:

```env
# Midnight Protocol Production Configuration
MIDNIGHT_RPC_URL="https://testnet.midnight.network"
MIDNIGHT_NETWORK_ID="testnet"
MIDNIGHT_API_KEY="your_api_key_here"

# Midnight Proof Server
MIDNIGHT_PROOF_SERVER_URL="https://proof-server-testnet.midnight.network"

# Wallet Configuration
MIDNIGHT_PRIVATE_KEY="your_private_key_here"
MIDNIGHT_WALLET_ADDRESS="your_wallet_address_here"
MIDNIGHT_MNEMONIC="your_mnemonic_phrase_here"

# Contract Addresses
ZK_COMPLIANCE_CONTRACT_ADDRESS="deployed_contract_address_here"

# Encryption Key
ENCRYPTION_KEY="your_encryption_key_here"

# Production Environment
NODE_ENV="production"
MIDNIGHT_USE_OFFICIAL_SDK="true"
```

### Mainnet Deployment

For mainnet deployment:

1. Update environment variables:
   ```env
   MIDNIGHT_RPC_URL="https://mainnet.midnight.network"
   MIDNIGHT_NETWORK_ID="mainnet"
   MIDNIGHT_PROOF_SERVER_URL="https://proof-server.midnight.network"
   ```

2. Get mainnet DUST tokens
3. Deploy contracts:
   ```bash
   npm run deploy:production
   ```

## Testing Your Deployment

### 1. Test Contract Functions

```bash
# Test the deployed contract
npm run test:midnight:testnet

# Test with production configuration
npm run test:production
```

### 2. Run the Application

```bash
# Start the application
npm run start:production

# Or start individual components
npm run dev:client
npm run dev:dashboard
```

### 3. Verify on Explorer

1. Go to [Midnight Explorer](https://testnet-explorer.midnight.network)
2. Search for your contract address
3. Verify the contract code and transactions

## Troubleshooting

### Common Issues

**"Proof server not responding"**:
```bash
# Restart proof server
docker stop $(docker ps -q --filter ancestor=midnightnetwork/proof-server)
docker run -d -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

**"Insufficient funds"**:
- Get more tDUST tokens from the faucet
- Check your wallet balance in Lace

**"Contract deployment failed"**:
- Verify your private key is correct
- Ensure you have enough tDUST tokens
- Check the Midnight network status

**"Proof generation failed"**:
- Ensure proof server is running on port 6300
- Check proof server logs: `docker logs <container_id>`

### Debug Commands

```bash
# Check proof server status
curl http://localhost:6300/health

# View proof server logs
docker logs $(docker ps -q --filter ancestor=midnightnetwork/proof-server)

# Check wallet balance (if explorer API available)
curl "https://testnet-explorer.midnight.network/api/address/your_wallet_address"

# Test network connection
curl -X POST https://testnet.midnight.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Environment Files**: Use `.env` files and add them to `.gitignore`
3. **Testnet First**: Always test on testnet before mainnet
4. **Backup**: Keep secure backups of your mnemonic phrase
5. **Monitoring**: Set up monitoring for your deployed contracts

## Support

- [Midnight Protocol Documentation](https://midnight.network/docs)
- [Midnight Discord](https://discord.gg/midnight)
- [GitHub Issues](https://github.com/your-repo/issues)

## Next Steps

After successful deployment:

1. **Monitor**: Set up monitoring and alerting
2. **Scale**: Consider load balancing for high traffic
3. **Update**: Keep dependencies and contracts updated
4. **Audit**: Consider professional security audits
5. **Documentation**: Maintain deployment and operational docs
