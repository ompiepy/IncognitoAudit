"use strict";
/**
 * Main entry point for the ZK Compliance Prover Client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZKComplianceProver = void 0;
exports.runDemo = runDemo;
const ZKComplianceProver_1 = require("./ZKComplianceProver");
Object.defineProperty(exports, "ZKComplianceProver", { enumerable: true, get: function () { return ZKComplianceProver_1.ZKComplianceProver; } });
/**
 * Demo function to showcase the ZK compliance audit flow
 */
async function runDemo() {
    console.log('🌟 ZK Compliance Auditor Demo Starting...\n');
    // Initialize the prover client with Midnight Protocol
    const prover = new ZKComplianceProver_1.ZKComplianceProver({
        rpcUrl: 'https://testnet.midnight.network',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        privateKey: 'demo-private-key',
        networkId: 'testnet',
        apiKey: process.env.MIDNIGHT_API_KEY,
        proofServerUrl: process.env.MIDNIGHT_PROOF_SERVER_URL
    });
    // Initialize connection to Midnight Protocol
    await prover.initialize();
    // Test different employee scenarios
    const testCases = [
        {
            employeeId: 'EMP001',
            description: 'Compliant employee (recent training, good score)',
            expected: 'PASS'
        },
        {
            employeeId: 'EMP002',
            description: 'Compliant employee (borderline but valid)',
            expected: 'PASS'
        },
        {
            employeeId: 'EMP003',
            description: 'Non-compliant employee (expired training, low score)',
            expected: 'FAIL'
        }
    ];
    console.log('📋 Running compliance audits...\n');
    for (const testCase of testCases) {
        console.log(`🔍 Testing: ${testCase.description}`);
        console.log(`   Employee ID: ${testCase.employeeId}`);
        console.log(`   Expected Result: ${testCase.expected}\n`);
        try {
            const result = await prover.runComplianceAudit(testCase.employeeId, {
                policy_hash: `0x${'12345abcdef'.padEnd(16, '0')}`,
                audit_id: `0x${Date.now().toString(16)}`,
                auditor_public_key: 'auditor_public_key_demo'
            });
            if (result.success) {
                console.log(`   ✅ AUDIT PASSED`);
                console.log(`   📝 Transaction Hash: ${result.transactionHash}`);
                console.log(`   🔒 Proof Hash: ${result.proofHash}`);
                console.log(`   ⏱️  Verification Time: ${result.verificationTime}ms`);
            }
            else {
                console.log(`   ❌ AUDIT FAILED`);
                console.log(`   🚨 Error: ${result.error}`);
                console.log(`   ⏱️  Processing Time: ${result.verificationTime}ms`);
            }
        }
        catch (error) {
            console.log(`   💥 UNEXPECTED ERROR: ${error.message}`);
        }
        console.log('\n' + '─'.repeat(60) + '\n');
    }
    console.log('🎯 Demo completed! This demonstrates:');
    console.log('• Zero-knowledge proof generation for compliance verification');
    console.log('• Privacy-preserving audit process');
    console.log('• On-chain verification without exposing sensitive data');
    console.log('• Fast proof generation (milliseconds)');
    console.log('• Cryptographically secure compliance verification\n');
}
// Run the demo if this file is executed directly
if (require.main === module) {
    runDemo().catch(console.error);
}
//# sourceMappingURL=index.js.map