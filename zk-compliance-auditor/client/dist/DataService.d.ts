/**
 * Real Data Service for ZK Compliance Auditor
 *
 * This service handles real data operations using Midnight Protocol
 * private state management and external data sources.
 */
import { MidnightPrivateStateManager } from './MidnightProtocolSDK';
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
 * Real Data Service using Midnight Protocol
 */
export declare class DataService {
    private privateStateManager;
    private isInitialized;
    constructor(privateStateManager: MidnightPrivateStateManager);
    /**
     * Initialize the data service
     */
    initialize(): Promise<void>;
    /**
     * Load initial data from external sources
     */
    private loadInitialData;
    /**
     * Create initial employee data
     * In production, this would come from HR systems
     */
    private createInitialEmployeeData;
    /**
     * Create initial policy data
     * In production, this would come from policy management systems
     */
    private createInitialPolicyData;
    /**
     * Get employee data by ID
     */
    getEmployee(employeeId: string): Promise<EmployeeTrainingRecord | null>;
    /**
     * Get all employees
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
     * Update audit session
     */
    updateAuditSession(session: AuditSession): Promise<void>;
    /**
     * Get audit session
     */
    getAuditSession(sessionId: string): Promise<AuditSession | null>;
    /**
     * Check compliance for an employee
     */
    checkCompliance(employeeId: string, policyId: string): Promise<{
        compliant: boolean;
        reasons: string[];
    }>;
    /**
     * Get compliance statistics
     */
    getComplianceStatistics(policyId: string): Promise<{
        totalEmployees: number;
        compliantEmployees: number;
        nonCompliantEmployees: number;
        complianceRate: number;
    }>;
}
//# sourceMappingURL=DataService.d.ts.map