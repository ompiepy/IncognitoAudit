# Production Setup Guide

This guide explains how to configure the ZK Compliance Auditor for production use with the actual Midnight Protocol.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Midnight Protocol Network Configuration
MIDNIGHT_RPC_URL=https://testnet.midnight.network
MIDNIGHT_NETWORK_ID=testnet
MIDNIGHT_API_KEY=your_midnight_api_key_here
MIDNIGHT_PROOF_SERVER_URL=https://proof-server.midnight.network

# Contract Configuration
CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678

# Security Configuration
PROVER_PRIVATE_KEY=your_private_key_here
ENCRYPTION_KEY=your_encryption_key_here

# Dashboard Configuration
NEXT_PUBLIC_MIDNIGHT_RPC_URL=https://testnet.midnight.network
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

## Midnight Protocol Integration

### 1. Install Midnight Protocol SDK

When the official Midnight Protocol JavaScript SDK becomes available, install it:

```bash
npm install @midnight-protocol/sdk
```

### 2. Update SDK Import

Update the import in `client/src/MidnightProtocolSDK.ts`:

```typescript
// Replace the mock implementation with:
import { MidnightProtocolSDK } from '@midnight-protocol/sdk';
```

### 3. Configure Network Connection

The system is now configured to use real Midnight Protocol features:

- **Zero-Knowledge Proof Generation**: Real cryptographic proofs using Midnight's ZK circuits
- **Private State Management**: Encrypted data storage using Midnight's privacy features
- **Transaction Submission**: Real blockchain transactions on Midnight network
- **Proof Verification**: Cryptographic verification of compliance proofs

### 4. Deploy Smart Contracts

Deploy your ZK compliance contracts to the Midnight testnet:

```bash
# Compile contracts
npm run build:contracts

# Deploy to testnet
npm run deploy:testnet
```

### 5. Update Contract Address

Update the contract address in your environment variables with the deployed contract address.

## Production Features

### Real Cryptographic Proofs

The system now generates actual zero-knowledge proofs that:

- Prove compliance without revealing sensitive data
- Are cryptographically secure and verifiable
- Use Midnight Protocol's privacy-preserving technology
- Can be verified on-chain without exposing private information

### Privacy-Preserving Compliance

- Employee training data is encrypted and stored privately
- Only compliance status is revealed, not specific scores or dates
- Audit trails are maintained without exposing sensitive details
- Manager approvals are verified without revealing identity

### Production-Ready Architecture

- Modular design for easy Midnight Protocol SDK integration
- Environment-based configuration
- Error handling and logging
- Scalable proof generation and verification

## Testing

Test the production setup:

```bash
# Run with production configuration
NODE_ENV=production npm run demo

# Test individual components
npm run test:client
npm run test:contracts
npm run test:dashboard
```

## Security Considerations

1. **Private Keys**: Store private keys securely using environment variables
2. **API Keys**: Keep Midnight Protocol API keys confidential
3. **Encryption**: Use strong encryption keys for data protection
4. **Network Security**: Ensure secure connections to Midnight Protocol network
5. **Audit Logging**: Maintain comprehensive logs for compliance auditing

## Monitoring

Monitor the production system:

- Proof generation success rates
- Transaction confirmation times
- Network connectivity status
- Error rates and types
- Compliance verification results

## Support

For Midnight Protocol integration support:

- [Midnight Protocol Documentation](https://midnight.network/docs)
- [Midnight Protocol Discord](https://discord.gg/midnight)
- [GitHub Issues](https://github.com/your-repo/issues)
