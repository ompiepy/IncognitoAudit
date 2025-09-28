/**
 * ZK Compliance Prover Client
 */
export interface PrivateTrainingData {
    employeeId: string;
    trainingA_date: number;
    trainingB_score: number;
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
export declare class ZKComplianceProver {
    private midnightSDK;
    private privateStateManager;
    private dataService;
    private contractAddress;
    private privateKey;
    constructor(config: {
        rpcUrl: string;
        contractAddress: string;
        privateKey?: string;
        networkId?: 'testnet' | 'mainnet';
        apiKey?: string;
        proofServerUrl?: string;
    });
    /**
     * Get wallet address from private key
     */
    private getWalletAddress;
    /**
     * Initialize connection to Midnight Protocol network
     */
    initialize(): Promise<void>;
    /**
     * Securely load private training data from DataService
     */
    loadPrivateData(employeeId: string): Promise<PrivateTrainingData>;
    /**
     * Validate private data integrity
     */
    private validatePrivateData;
    /**
     * Generate ZK proof for compliance verification
     */
    generateComplianceProof(privateData: PrivateTrainingData, publicData: PublicAuditData): Promise<ComplianceProof>;
    /**
     * Submit the ZK proof to the Midnight network
     */
    submitProofToNetwork(complianceProof: ComplianceProof): Promise<string>;
    /**
     * Complete end-to-end compliance verification flow
     */
    runComplianceAudit(employeeId: string, auditParams: {
        policy_hash: string;
        audit_id: string;
        auditor_public_key: string;
    }): Promise<{
        success: boolean;
        transactionHash?: string;
        proofHash: string;
        verificationTime: number;
        error?: string;
    }>;
    /**
     * Validate input data before proof generation
     */
    private validateInputData;
    /**
     * Hash sensitive data for privacy protection
     */
    private hashSensitiveData;
    /**
     * Create a hash of the proof for verification purposes
     */
    private createProofHash;
}
//# sourceMappingURL=ZKComplianceProver.d.ts.map