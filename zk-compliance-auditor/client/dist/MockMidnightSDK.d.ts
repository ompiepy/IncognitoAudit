/**
 * Mock implementations for demo purposes
 * These simulate the MidnightJS SDK functionality for the hackathon demo
 */
export interface MockMidnightSDKConfig {
    rpcUrl: string;
    privateKey?: string;
}
export interface MockProof {
    proofData: string;
    publicSignals: any[];
    proof: {
        a: string[];
        b: string[][];
        c: string[];
    };
}
export interface MockTransaction {
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
    gasUsed: number;
}
/**
 * Mock MidnightJS SDK for demo purposes
 */
export declare class MidnightJSSDK {
    private config;
    constructor(config: MockMidnightSDKConfig);
    generateProof(params: {
        contractAddress: string;
        method: string;
        inputs: any;
    }): Promise<MockProof>;
    submitTransaction(params: {
        contractAddress: string;
        method: string;
        proof: string;
        publicInputs: any;
    }): Promise<MockTransaction>;
    private generateMockProofData;
    private randomHex;
    private delay;
}
/**
 * Mock Private State Manager for demo purposes
 */
export declare class PrivateStateManager {
    private encryptionKey;
    private storage;
    constructor(config: {
        encryptionKey: string;
    });
    store(key: string, data: string): Promise<void>;
    retrieve(key: string): Promise<string | null>;
    decrypt(encryptedData: string): Promise<string>;
    private mockEncrypt;
    private mockDecrypt;
    private initializeMockData;
}
//# sourceMappingURL=MockMidnightSDK.d.ts.map