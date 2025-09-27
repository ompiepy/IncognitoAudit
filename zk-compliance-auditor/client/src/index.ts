/**
 * Main entry point for the ZK Compliance Prover Client
 */

import { ZKComplianceProver } from './ZKComplianceProver';

/**
 * Demo function to showcase the ZK compliance audit flow
 */
async function runDemo() {
  console.log('🌟 ZK Compliance Auditor Demo Starting...\n');
  
  // Initialize the prover client
  const prover = new ZKComplianceProver({
    rpcUrl: 'https://testnet.midnight.network', // Mock URL for demo
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    privateKey: 'demo-private-key'
  });
  
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
        policy_hash: '12345abcdef',
        audit_id: `audit_${Date.now()}`,
        auditor_public_key: 'auditor_public_key_demo'
      });
      
      if (result.success) {
        console.log(`   ✅ AUDIT PASSED`);
        console.log(`   📝 Transaction Hash: ${result.transactionHash}`);
        console.log(`   🔒 Proof Hash: ${result.proofHash}`);
        console.log(`   ⏱️  Verification Time: ${result.verificationTime}ms`);
      } else {
        console.log(`   ❌ AUDIT FAILED`);
        console.log(`   🚨 Error: ${result.error}`);
        console.log(`   ⏱️  Processing Time: ${result.verificationTime}ms`);
      }
      
    } catch (error: any) {
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

export { runDemo, ZKComplianceProver };