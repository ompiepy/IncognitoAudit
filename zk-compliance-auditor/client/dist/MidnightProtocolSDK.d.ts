/**
 * Midnight Protocol SDK Integration
 *
 * This module provides the interface for integrating with the actual Midnight Protocol
 * for real zero-knowledge proof generation and verification.
 *
 * Note: This is a production-ready interface that will work with the official
 * Midnight Protocol SDK when it becomes available.
 */
export interface MidnightConfig {
    rpcUrl: string;
    networkId: 'testnet' | 'mainnet';
    apiKey?: string;
    proofServerUrl?: string;
}
export interface MidnightProof {
    proofData: string;
    publicSignals: string[];
    proof: {
        a: [string, string];
        b: [[string, string], [string, string]];
        c: [string, string];
    };
    verificationKey: string;
}
export interface MidnightTransaction {
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
    gasUsed: number;
    blockNumber?: number;
    blockHash?: string;
}
export interface ProofGenerationParams {
    contractAddress: string;
    method: string;
    inputs: {
        private: Record<string, any>;
        public: Record<string, any>;
    };
    circuitWasm?: ArrayBuffer;
    verificationKey?: string;
}
export interface TransactionParams {
    contractAddress: string;
    method: string;
    proof: string;
    publicInputs: any;
    gasLimit?: number;
    value?: string;
}
/**
 * Production Midnight Protocol SDK
 *
 * This class provides the actual integration with Midnight Protocol
 * for generating and verifying zero-knowledge proofs.
 */
export declare class MidnightProtocolSDK {
    private config;
    private isConnected;
    private wallet;
    private runtime;
    constructor(config: MidnightConfig);
    /**
     * Initialize connection to Midnight Protocol network
     */
    connect(): Promise<void>;
    /**
     * Generate a zero-knowledge proof using Midnight Protocol
     */
    generateProof(params: ProofGenerationParams): Promise<MidnightProof>;
    /**
     * Submit a transaction with ZK proof to Midnight Protocol network
     */
    submitTransaction(params: TransactionParams): Promise<MidnightTransaction>;
    /**
     * Verify a zero-knowledge proof
     */
    verifyProof(proof: MidnightProof, publicInputs: any): Promise<boolean>;
    /**
     * Get the current network status
     */
    getNetworkStatus(): Promise<{
        connected: boolean;
        networkId: string;
        blockNumber: number;
        gasPrice: string;
    }>;
    /**
     * Disconnect from Midnight Protocol network
     */
    disconnect(): Promise<void>;
    private initializeMidnightSDK;
    private generateActualProof;
    private submitActualTransaction;
    private verifyActualProof;
}
/**
 * Production Private State Manager for Midnight Protocol
 *
 * This class handles encrypted data storage and retrieval using
 * Midnight Protocol's privacy features.
 */
export declare class MidnightPrivateStateManager {
    private encryptionKey;
    private sdk;
    constructor(encryptionKey: string, sdk: MidnightProtocolSDK);
    /**
     * Store encrypted data in Midnight Protocol's private state
     */
    storeEncrypted(key: string, data: any): Promise<void>;
    /**
     * Retrieve and decrypt data from Midnight Protocol's private state
     */
    retrieveDecrypted<T>(key: string): Promise<T | null>;
    private storeActualEncryptedData;
    private retrieveActualEncryptedData;
}
//# sourceMappingURL=MidnightProtocolSDK.d.ts.map