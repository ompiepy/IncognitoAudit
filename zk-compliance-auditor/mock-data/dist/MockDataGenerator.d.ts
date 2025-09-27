/**
 * Mock Data Generator for ZK Compliance Demo
 *
 * This module creates realistic training and employee data for demonstration purposes.
 * In a real implementation, this would be replaced with secure data sources.
 */
export interface EmployeeTrainingRecord {
    employeeId: string;
    employeeName: string;
    department: string;
    trainingA_date: number;
    trainingB_score: number;
    sensitiveNotes: string;
    lastLogin: number;
    managerApproval: boolean;
}
export interface CompliancePolicy {
    id: string;
    name: string;
    description: string;
    requirements: {
        trainingA_maxAge: number;
        trainingB_minScore: number;
        managerApproval: boolean;
    };
    created: number;
    lastModified: number;
}
export interface AuditSession {
    id: string;
    policyId: string;
    auditorId: string;
    employees: string[];
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    created: number;
    results?: AuditResult[];
}
export interface AuditResult {
    employeeId: string;
    compliant: boolean;
    proofHash: string;
    transactionHash?: string;
    verificationTime: number;
    error?: string;
    timestamp: number;
}
/**
 * Mock Shielded State Manager
 * Simulates Midnight's shielded state functionality
 */
export declare class MockShieldedState {
    private encryptedStorage;
    private accessLog;
    /**
     * Store encrypted data in shielded state
     */
    storeEncrypted(key: string, data: any): Promise<void>;
    /**
     * Retrieve and decrypt data from shielded state
     */
    retrieveDecrypted<T>(key: string): Promise<T | null>;
    /**
     * Get access audit trail (for compliance purposes)
     */
    getAccessLog(): Array<{
        key: string;
        action: 'read' | 'write';
        timestamp: number;
    }>;
    private mockEncrypt;
    private mockDecrypt;
}
/**
 * Mock Data Generator Class
 */
export declare class MockDataGenerator {
    private shieldedState;
    private employees;
    private policies;
    constructor();
    /**
     * Initialize mock data for demo
     */
    private initializeData;
    /**
     * Get employee data (from shielded state)
     */
    getEmployeeData(employeeId: string): Promise<EmployeeTrainingRecord | null>;
    /**
     * Get all employees (for dashboard display)
     */
    getAllEmployees(): Promise<EmployeeTrainingRecord[]>;
    /**
     * Get compliance policy
     */
    getPolicy(policyId: string): Promise<CompliancePolicy | null>;
    /**
     * Create new audit session
     */
    createAuditSession(policyId: string, auditorId: string, employeeIds: string[]): Promise<AuditSession>;
    /**
     * Simulate compliance check (without ZK proof)
     */
    checkCompliance(employeeId: string, policyId: string): Promise<{
        compliant: boolean;
        reasons: string[];
    }>;
    /**
     * Get access audit trail
     */
    getDataAccessLog(): Array<{
        key: string;
        action: 'read' | 'write';
        timestamp: number;
    }>;
    /**
     * Generate compliance statistics
     */
    getComplianceStatistics(policyId: string): Promise<{
        totalEmployees: number;
        compliantEmployees: number;
        nonCompliantEmployees: number;
        complianceRate: number;
    }>;
}
export declare const mockDataGenerator: MockDataGenerator;
//# sourceMappingURL=MockDataGenerator.d.ts.map