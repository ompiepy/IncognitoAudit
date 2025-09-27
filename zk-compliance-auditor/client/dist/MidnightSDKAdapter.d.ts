/**
 * Midnight Protocol SDK Adapter
 *
 * This module provides a seamless adapter for the official Midnight Protocol SDK.
 * It allows easy switching between mock and production implementations.
 */
import { MidnightConfig, MidnightProof, MidnightTransaction } from './MidnightProtocolSDK';
export declare class OfficialMidnightSDK {
    private wallet;
    private runtime;
    private contracts;
    private isConnected;
    constructor(config: OfficialMidnightConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    generateProof(params: any): Promise<MidnightProof>;
    submitTransaction(params: any): Promise<MidnightTransaction>;
    verifyProof(proof: MidnightProof, publicInputs: any): Promise<boolean>;
    getNetworkStatus(): Promise<any>;
}
export interface OfficialMidnightConfig {
    rpcUrl: string;
    networkId: 'testnet' | 'mainnet';
    apiKey?: string;
    proofServerUrl?: string;
    wallet?: {
        privateKey: string;
        address: string;
    };
}
/**
 * Adapter class that provides a unified interface for Midnight Protocol SDK
 * This allows switching between mock and official implementations seamlessly
 */
export declare class MidnightSDKAdapter {
    private sdk;
    private isOfficialSDK;
    private config;
    constructor(config: MidnightConfig | OfficialMidnightConfig, useOfficialSDK?: boolean);
    /**
     * Connect to Midnight Protocol network
     */
    connect(): Promise<void>;
    /**
     * Disconnect from Midnight Protocol network
     */
    disconnect(): Promise<void>;
    /**
     * Generate a zero-knowledge proof
     */
    generateProof(params: any): Promise<MidnightProof>;
    /**
     * Submit a transaction with ZK proof
     */
    submitTransaction(params: any): Promise<MidnightTransaction>;
    /**
     * Verify a zero-knowledge proof
     */
    verifyProof(proof: MidnightProof, publicInputs: any): Promise<boolean>;
    /**
     * Get network status
     */
    getNetworkStatus(): Promise<any>;
    /**
     * Check if using official SDK
     */
    isUsingOfficialSDK(): boolean;
    /**
     * Get current configuration
     */
    getConfig(): MidnightConfig | OfficialMidnightConfig;
}
/**
 * Factory function to create Midnight SDK adapter
 */
export declare function createMidnightSDKAdapter(config: MidnightConfig | OfficialMidnightConfig, useOfficialSDK?: boolean): MidnightSDKAdapter;
/**
 * Environment-based SDK selection
 */
export declare function createSDKFromEnvironment(): MidnightSDKAdapter;
//# sourceMappingURL=MidnightSDKAdapter.d.ts.map