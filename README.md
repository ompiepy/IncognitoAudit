# IncognitoAudit

A privacy-preserving compliance verification system that proves regulatory compliance without exposing sensitive employee data using zero-knowledge proofs on Midnight Protocol.

## Overview

The ZK Compliance Auditor solves the fundamental privacy-compliance paradox by enabling organizations to prove regulatory compliance without exposing sensitive employee information. Using zero-knowledge proofs, the system verifies that employees have completed required training and met compliance standards while keeping all personal data private.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │     Client      │    │   Contracts     │
│   (Frontend)    │◄──►│   (ZK Prover)   │◄──►│  (ZK Circuit)   │
│                 │    │                 │    │                 │
│ • Audit UI      │    │ • Proof Gen     │    │ • Verification  │
│ • Results       │    │ • Private Data  │    │ • On-chain      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Tech Stack

- **ZK Circuits**: Compact (TypeScript-based DSL)
- **Client**: MidnightJS SDK / TypeScript
- **Frontend**: React/Next.js + Tailwind CSS
- **Blockchain**: Midnight Protocol

## Core Features

### Zero-Knowledge Proof Generation
- Generates cryptographic proofs for compliance verification
- Keeps employee data (scores, dates, IDs) completely private
- Proves compliance without revealing sensitive information

### Privacy Protection
- Client-side proof generation
- Shielded state storage
- Identity protection through hashing
- GDPR-compliant by design

### Compliance Verification
- Mathematical validation of training completion
- Score verification (≥80% threshold)
- Time-based validation (within 365 days)
- Immutable audit trail

## Quick Start

```bash
# Install dependencies
npm run install-all

# Build all components
npm run build

# Start development environment
npm run dev

# Start dashboard (separate terminal)
cd dashboard && npm run dev
```

## Project Structure

```
zk-compliance-auditor/
├── contracts/          # ZK circuits and smart contracts
├── client/            # ZK proof generation client
├── dashboard/         # React compliance dashboard
├── scripts/           # Build and deployment scripts
└── config/            # Environment configuration
```

## Usage

### Basic Compliance Audit

```typescript
import { ZKComplianceProver } from './client';

const prover = new ZKComplianceProver({
  rpcUrl: 'https://testnet.midnight.network',
  contractAddress: '0x...',
  privateKey: 'your-private-key'
});

const result = await prover.runComplianceAudit('EMP001', {
  policy_hash: 'policy-hash',
  audit_id: 'audit-id',
  auditor_public_key: 'auditor-key'
});
```

## Testing

```bash
# Test ZK circuits
cd contracts && npm test

# Test client prover
cd client && npm test

# Test all components
npm run test
```

## Security

- **Zero-Knowledge Guarantees**: Completeness, soundness, and zero-knowledge properties
- **Data Protection**: Private data never transmitted or stored on-chain
- **Audit Trail**: Immutable records on Midnight blockchain
- **Cryptographic Security**: 128-bit security level

## Performance

- Sub-second proof generation (100-500ms)
- Efficient on-chain verification (~50ms)
- Scalable to thousands of employees

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Development Setup

```bash
git clone <repository-url>
cd zk-compliance-auditor
npm run install-all
npm run build
npm run dev
```
