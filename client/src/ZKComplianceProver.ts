/**
 * ZK Compliance Prover Client
 */

import { MidnightSDKAdapter, createSDKFromEnvironment } from './MidnightSDKAdapter';
import { MidnightPrivateStateManager } from './MidnightProtocolSDK';
import { DataService, EmployeeTrainingRecord, CompliancePolicy } from './DataService';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Environment variables for Midnight Protocol
const env = {
  PROVER_PRIVATE_KEY: process.env.MIDNIGHT_PRIVATE_KEY || 'demo-private-key-12345',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'demo-encryption-key-67890',
  WALLET_ADDRESS: process.env.MIDNIGHT_WALLET_ADDRESS || '',
  MNEMONIC: process.env.MIDNIGHT_MNEMONIC || ''
};

// Types for our compliance data
export interface PrivateTrainingData {
  employeeId: string;
  trainingA_date: number;      // Unix timestamp
  trainingB_score: number;     // 0-100 score
  departmentId: string;
  sensitiveNotes?: string;
}

export interface PublicAuditData {
  current_time: number;
  policy_hash: string;
  audit_id: string;
  auditor_public_key: string;
}

export interface ComplianceProof {
  proof: string;
  publicInputs: PublicAuditData;
  proofHash: string;
  timestamp: number;
}

/**
 * Main ZK Compliance Prover Class
 */
export class ZKComplianceProver {
  private midnightSDK: MidnightSDKAdapter;
  private privateStateManager: MidnightPrivateStateManager;
  private dataService: DataService;
  private contractAddress: string;
  private privateKey: string;
  
  constructor(config: {
    rpcUrl: string;
    contractAddress: string;
    privateKey?: string;
    networkId?: 'testnet' | 'mainnet';
    apiKey?: string;
    proofServerUrl?: string;
  }) {
    this.contractAddress = config.contractAddress;
    this.privateKey = config.privateKey || env.PROVER_PRIVATE_KEY;
    
    // Initialize Midnight SDK Adapter with official SDK only
    this.midnightSDK = new MidnightSDKAdapter({
      rpcUrl: config.rpcUrl,
      networkId: config.networkId || 'testnet',
      apiKey: config.apiKey,
      proofServerUrl: config.proofServerUrl,
      wallet: {
        privateKey: this.privateKey,
        address: this.getWalletAddress()
      }
    }, true); // Always use official SDK
    
    // Initialize private state management
    this.privateStateManager = new MidnightPrivateStateManager(
      env.ENCRYPTION_KEY,
      this.midnightSDK as any // Type assertion for compatibility
    );
    
    // Initialize data service
    this.dataService = new DataService(this.privateStateManager);
  }
  
  /**
   * Get wallet address from private key
   */
  private getWalletAddress(): string {
    // Use wallet address from environment if available
    if (env.WALLET_ADDRESS) {
      return env.WALLET_ADDRESS;
    }
    
    // TODO: Implement proper address derivation from private key using official packages
    // Placeholder until official method integrated
    return env.WALLET_ADDRESS || '';
  }

  /**
   * Initialize connection to Midnight Protocol network
   */
  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing ZK Compliance Prover...');
      await this.midnightSDK.connect();
      await this.dataService.initialize();
      console.log('✅ ZK Compliance Prover initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize ZK Compliance Prover:', error);
      throw error;
    }
  }
  
  /**
   * Securely load private training data from DataService
   */
  async loadPrivateData(employeeId: string): Promise<PrivateTrainingData> {
    try {
      console.log(`🔓 Loading private training data for employee: ${employeeId}`);
      
      // Load data from DataService
      const employeeData = await this.dataService.getEmployee(employeeId);
      
      if (!employeeData) {
        throw new Error('No private training data found for employee');
      }
      
      // Convert to PrivateTrainingData format
      const privateData: PrivateTrainingData = {
        employeeId: employeeData.employeeId,
        trainingA_date: employeeData.trainingA_date,
        trainingB_score: employeeData.trainingB_score,
        departmentId: employeeData.department,
        sensitiveNotes: employeeData.sensitiveNotes
      };
      
      // Validate data integrity
      this.validatePrivateData(privateData);
      
      console.log(`✅ Private training data loaded for employee: ${employeeId}`);
      return privateData;
      
    } catch (error: any) {
      console.error('Error loading private data:', error);
      throw new Error('Failed to load private training data');
    }
  }

  /**
   * Validate private data integrity
   */
  private validatePrivateData(data: PrivateTrainingData): void {
    if (!data.employeeId || !data.trainingA_date || !data.trainingB_score || !data.departmentId) {
      throw new Error('Invalid private data: missing required fields');
    }
    
    if (data.trainingB_score < 0 || data.trainingB_score > 100) {
      throw new Error('Invalid private data: training score out of range');
    }
    
    if (data.trainingA_date < 0) {
      throw new Error('Invalid private data: invalid training date');
    }
  }
  
  /**
   * Generate ZK proof for compliance verification
   */
  async generateComplianceProof(
    privateData: PrivateTrainingData,
    publicData: PublicAuditData
  ): Promise<ComplianceProof> {
    
    console.log('🔐 Generating ZK proof for compliance verification...');
    const startTime = Date.now();
    
    try {
      // Validate input data
      this.validateInputData(privateData, publicData);
      
      // Hash sensitive data for privacy
      const hashedEmployeeId = this.hashSensitiveData(privateData.employeeId);
      
      // Prepare circuit inputs
      const circuitInputs = {
        // Private inputs (witness data)
        private: {
          trainingA_date: BigInt(privateData.trainingA_date),
          trainingB_score: BigInt(privateData.trainingB_score),
          employeeId: BigInt('0x' + hashedEmployeeId.substring(0, 16)) // Take first 16 chars
        },
        // Public inputs
        public: {
          current_time: BigInt(publicData.current_time),
          policy_hash: BigInt(publicData.policy_hash.startsWith('0x') ? publicData.policy_hash : '0x' + publicData.policy_hash),
          audit_id: BigInt(publicData.audit_id.startsWith('0x') ? publicData.audit_id : '0x' + publicData.audit_id)
        }
      };
      
      // Generate the ZK proof using Midnight Protocol SDK
      const proof = await this.midnightSDK.generateProof({
        contractAddress: this.contractAddress,
        method: 'verifyTrainingCompliance',
        inputs: circuitInputs
      });
      
      const proofGenerationTime = Date.now() - startTime;
      console.log(`✅ ZK proof generated successfully in ${proofGenerationTime}ms`);
      
      // Create proof hash for verification
      const proofHash = this.createProofHash(proof, publicData);
      
      return {
        proof: proof.proofData,
        publicInputs: publicData,
        proofHash,
        timestamp: Date.now()
      };
      
    } catch (error: any) {
      console.error('❌ Error generating ZK proof:', error);
      throw new Error(`Proof generation failed: ${error.message}`);
    }
  }
  
  /**
   * Submit the ZK proof to the Midnight network
   */
  async submitProofToNetwork(complianceProof: ComplianceProof): Promise<string> {
    console.log('📡 Submitting proof to Midnight network...');
    
    try {
      const transaction = await this.midnightSDK.submitTransaction({
        contractAddress: this.contractAddress,
        method: 'verifyTrainingCompliance',
        proof: complianceProof.proof,
        publicInputs: complianceProof.publicInputs
      });
      
      console.log('✅ Proof submitted successfully');
      console.log(`Transaction hash: ${transaction.hash}`);
      
      return transaction.hash;
      
    } catch (error: any) {
      console.error('❌ Error submitting proof:', error);
      throw new Error(`Proof submission failed: ${error.message}`);
    }
  }
  
  /**
   * Complete end-to-end compliance verification flow
   */
  async runComplianceAudit(
    employeeId: string,
    auditParams: {
      policy_hash: string;
      audit_id: string;
      auditor_public_key: string;
    }
  ): Promise<{
    success: boolean;
    transactionHash?: string;
    proofHash: string;
    verificationTime: number;
    error?: string;
  }> {
    
    const startTime = Date.now();
    
    try {
      console.log(`🚀 Starting compliance audit for employee: ${employeeId}`);
      
      // Step 1: Load private training data
      const privateData = await this.loadPrivateData(employeeId);
      console.log('📋 Private training data loaded');
      
      // Step 2: Prepare public audit data
      const publicData: PublicAuditData = {
        current_time: Math.floor(Date.now() / 1000),
        policy_hash: auditParams.policy_hash,
        audit_id: auditParams.audit_id,
        auditor_public_key: auditParams.auditor_public_key
      };
      
      // Step 3: Generate ZK proof
      const complianceProof = await this.generateComplianceProof(privateData, publicData);
      
      // Step 4: Submit proof to network
      const transactionHash = await this.submitProofToNetwork(complianceProof);
      
      const totalTime = Date.now() - startTime;
      
      return {
        success: true,
        transactionHash,
        proofHash: complianceProof.proofHash,
        verificationTime: totalTime
      };
      
    } catch (error: any) {
      const totalTime = Date.now() - startTime;
      
      return {
        success: false,
        proofHash: '',
        verificationTime: totalTime,
        error: error.message
      };
    }
  }
  
  /**
   * Validate input data before proof generation
   */
  private validateInputData(privateData: PrivateTrainingData, publicData: PublicAuditData): void {
    // Validate private data
    if (!privateData.employeeId || privateData.employeeId.length === 0) {
      throw new Error('Employee ID is required');
    }
    
    if (!privateData.trainingA_date || privateData.trainingA_date <= 0) {
      throw new Error('Valid Training A completion date is required');
    }
    
    if (privateData.trainingB_score < 0 || privateData.trainingB_score > 100) {
      throw new Error('Training B score must be between 0 and 100');
    }
    
    // Validate public data
    if (!publicData.policy_hash || publicData.policy_hash.length === 0) {
      throw new Error('Policy hash is required');
    }
    
    if (!publicData.audit_id || publicData.audit_id.length === 0) {
      throw new Error('Audit ID is required');
    }
    
    console.log('✅ Input data validation passed');
  }
  
  /**
   * Hash sensitive data for privacy protection
   */
  private hashSensitiveData(data: string): string {
    // Simple hash function for demo - in production use proper cryptographic hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
  
  /**
   * Create a hash of the proof for verification purposes
   */
  private createProofHash(proof: any, publicData: PublicAuditData): string {
    const proofString = JSON.stringify(proof) + JSON.stringify(publicData);
    return this.hashSensitiveData(proofString);
  }
}