# Midnight Protocol Deployment Guide

This guide provides step-by-step instructions for deploying the ZK Compliance Auditor to production using the Midnight Protocol.

## Prerequisites

### 1. Midnight Protocol Setup

- **Lace Wallet**: Install the Lace wallet extension for Chrome (version 119+)
- **Test Tokens**: Obtain DUST tokens from the Midnight testnet faucet
- **API Keys**: Get Midnight Protocol API keys for production use
- **Development Tools**: Install Midnight development tools and Compact compiler

### 2. Environment Requirements

- Node.js 18+ 
- npm 9+
- TypeScript 5+
- Git

## Step 1: Environment Configuration

### 1.1 Create Environment Files

```bash
# Create environment-specific configuration files
npm run setup:env:testnet
npm run setup:env:mainnet
```

### 1.2 Configure Environment Variables

**For Testnet (.env.testnet):**
```bash
NODE_ENV=testnet
MIDNIGHT_NETWORK=testnet
MIDNIGHT_RPC_URL=https://testnet.midnight.network
MIDNIGHT_API_KEY=your_testnet_api_key
MIDNIGHT_PROOF_SERVER_URL=https://proof-server-testnet.midnight.network
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
MIDNIGHT_PRIVATE_KEY=your_testnet_private_key
MIDNIGHT_WALLET_ADDRESS=your_testnet_wallet_address
MIDNIGHT_GAS_LIMIT=5000000
MIDNIGHT_GAS_PRICE=0x1
```

**For Mainnet (.env.mainnet):**
```bash
NODE_ENV=production
MIDNIGHT_NETWORK=mainnet
MIDNIGHT_RPC_URL=https://mainnet.midnight.network
MIDNIGHT_API_KEY=your_mainnet_api_key
MIDNIGHT_PROOF_SERVER_URL=https://proof-server.midnight.network
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
MIDNIGHT_PRIVATE_KEY=your_mainnet_private_key
MIDNIGHT_WALLET_ADDRESS=your_mainnet_wallet_address
MIDNIGHT_GAS_LIMIT=10000000
MIDNIGHT_GAS_PRICE=0x2
```

## Step 2: Install Dependencies

```bash
# Install all dependencies
npm run install-all

# Install Midnight Protocol SDK (when available)
npm install @midnight-protocol/sdk

# Build all components
npm run build
```

## Step 3: Deploy Smart Contracts

### 3.1 Deploy to Testnet

```bash
# Deploy contracts to testnet
npm run deploy:testnet

# Verify deployment
npm run verify:testnet
```

### 3.2 Deploy to Mainnet

```bash
# Deploy contracts to mainnet
npm run deploy:mainnet

# Verify deployment
npm run verify:mainnet
```

## Step 4: Run Tests

### 4.1 Run Comprehensive Test Suite

```bash
# Run all tests
npm run test:all

# Run Midnight Protocol specific tests
npm run test:midnight:testnet
npm run test:midnight:mainnet

# Run tests with official SDK
npm run test:midnight:official
```

### 4.2 Test Coverage

```bash
# Generate test coverage report
npm run test:midnight --coverage
```

## Step 5: Production Deployment

### 5.1 Deploy to Testnet

```bash
# Complete testnet deployment
npm run setup:production
npm run test:midnight:testnet
```

### 5.2 Deploy to Mainnet

```bash
# Deploy to mainnet (production)
NODE_ENV=production npm run deploy:mainnet
NODE_ENV=production npm run test:midnight:mainnet
```

## Step 6: Monitor and Maintain

### 6.1 Health Checks

```bash
# Check system health
npm run health:check

# Monitor performance
npm run monitor:performance
```

### 6.2 Logs and Monitoring

```bash
# View logs
npm run logs:view

# Monitor transactions
npm run monitor:transactions
```

## Configuration Options

### Environment-Specific Settings

| Setting | Testnet | Mainnet |
|---------|---------|---------|
| RPC URL | `https://testnet.midnight.network` | `https://mainnet.midnight.network` |
| Gas Limit | 5,000,000 | 10,000,000 |
| Gas Price | 0x1 | 0x2 |
| Explorer | `https://testnet-explorer.midnight.network` | `https://explorer.midnight.network` |
| Faucet | Available | N/A |

### Feature Flags

```bash
# Enable/disable features
ENABLE_PROOF_GENERATION=true
ENABLE_TRANSACTION_SUBMISSION=true
ENABLE_CONTRACT_VERIFICATION=true
ENABLE_PRIVATE_STATE_MANAGEMENT=true
```

## Security Considerations

### 1. Private Key Management

- Store private keys in secure environment variables
- Use hardware wallets for production
- Implement key rotation policies
- Never commit private keys to version control

### 2. API Key Security

- Use different API keys for testnet and mainnet
- Implement rate limiting
- Monitor API usage
- Rotate keys regularly

### 3. Network Security

- Use HTTPS for all connections
- Implement proper authentication
- Monitor for suspicious activity
- Use VPN for production access

## Troubleshooting

### Common Issues

1. **Connection Failed**
   ```bash
   # Check network connectivity
   npm run health:check
   
   # Verify RPC URL
   curl -X POST -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
     $MIDNIGHT_RPC_URL
   ```

2. **Contract Deployment Failed**
   ```bash
   # Check gas settings
   npm run check:gas
   
   # Verify private key
   npm run verify:wallet
   ```

3. **Proof Generation Failed**
   ```bash
   # Check proof server
   npm run check:proof-server
   
   # Verify circuit compilation
   npm run verify:circuits
   ```

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug npm run start

# Run with verbose output
npm run test:midnight --verbose
```

## Monitoring and Alerts

### 1. Set up Monitoring

```bash
# Configure monitoring
npm run setup:monitoring

# Set up alerts
npm run setup:alerts
```

### 2. Key Metrics to Monitor

- Proof generation success rate
- Transaction confirmation time
- Network connectivity status
- Error rates and types
- Gas usage patterns

## Rollback Procedures

### 1. Emergency Rollback

```bash
# Rollback to previous version
npm run rollback:emergency

# Restore from backup
npm run restore:backup
```

### 2. Gradual Rollback

```bash
# Disable new features
npm run disable:features

# Revert to previous contract
npm run revert:contract
```

## Support and Resources

### Documentation

- [Midnight Protocol Docs](https://midnight.network/docs)
- [Compact Language Guide](https://midnight.network/docs/compact)
- [API Reference](https://midnight.network/docs/api)

### Community

- [Midnight Discord](https://discord.gg/midnight)
- [GitHub Issues](https://github.com/your-repo/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/midnight-protocol)

### Emergency Contacts

- Technical Support: support@midnight.network
- Security Issues: security@midnight.network
- Bug Reports: bugs@midnight.network

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-XX | Initial production release |
| 1.1.0 | 2024-XX-XX | Official SDK integration |
| 1.2.0 | 2024-XX-XX | Enhanced monitoring |

---

**Note**: This deployment guide is updated regularly. Always check for the latest version before deploying to production.
