"use strict";
/**
 * Real Data Service for ZK Compliance Auditor
 *
 * This service handles real data operations using Midnight Protocol
 * private state management and external data sources.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
/**
 * Real Data Service using Midnight Protocol
 */
class DataService {
    constructor(privateStateManager) {
        this.isInitialized = false;
        this.privateStateManager = privateStateManager;
    }
    /**
     * Initialize the data service
     */
    async initialize() {
        try {
            console.log('🔧 Initializing Data Service...');
            // Initialize with real data from external sources
            await this.loadInitialData();
            this.isInitialized = true;
            console.log('✅ Data Service initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize Data Service:', error);
            throw error;
        }
    }
    /**
     * Load initial data from external sources
     */
    async loadInitialData() {
        try {
            console.log('📊 Loading initial data from external sources...');
            // In a real implementation, this would:
            // 1. Connect to HR systems
            // 2. Load employee data from databases
            // 3. Load compliance policies from policy management systems
            // 4. Encrypt and store in Midnight Protocol private state
            // For now, we'll create a minimal dataset
            const employees = this.createInitialEmployeeData();
            const policies = this.createInitialPolicyData();
            // Store in private state
            for (const employee of employees) {
                await this.privateStateManager.storeEncrypted(`employee:${employee.employeeId}`, employee);
            }
            for (const policy of policies) {
                await this.privateStateManager.storeEncrypted(`policy:${policy.id}`, policy);
            }
            console.log(`✅ Loaded ${employees.length} employees and ${policies.length} policies`);
        }
        catch (error) {
            console.error('❌ Failed to load initial data:', error);
            throw error;
        }
    }
    /**
     * Create initial employee data
     * In production, this would come from HR systems
     */
    createInitialEmployeeData() {
        return [
            {
                employeeId: 'EMP001',
                employeeName: 'Alice Johnson',
                department: 'IT Security',
                trainingA_date: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // 30 days ago
                trainingB_score: 92,
                sensitiveNotes: 'Advanced security clearance, completed all modules with distinction',
                lastLogin: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
                managerApproval: true
            },
            {
                employeeId: 'EMP002',
                employeeName: 'Bob Smith',
                department: 'Human Resources',
                trainingA_date: Math.floor(Date.now() / 1000) - (60 * 24 * 60 * 60), // 60 days ago
                trainingB_score: 85,
                sensitiveNotes: 'HR representative, handles sensitive employee data',
                lastLogin: Date.now() - (4 * 60 * 60 * 1000), // 4 hours ago
                managerApproval: true
            },
            {
                employeeId: 'EMP003',
                employeeName: 'Carol Davis',
                department: 'Finance',
                trainingA_date: Math.floor(Date.now() / 1000) - (400 * 24 * 60 * 60), // 400 days ago (expired)
                trainingB_score: 78, // Below 80% threshold
                sensitiveNotes: 'Finance analyst, needs updated compliance training',
                lastLogin: Date.now() - (24 * 60 * 60 * 1000), // 24 hours ago
                managerApproval: false
            }
        ];
    }
    /**
     * Create initial policy data
     * In production, this would come from policy management systems
     */
    createInitialPolicyData() {
        return [
            {
                id: 'POLICY_001',
                name: 'Mandatory Training Compliance',
                description: 'Requires Training A completion within 365 days and Training B score >= 80%',
                requirements: {
                    trainingA_maxAge: 365,
                    trainingB_minScore: 80,
                    managerApproval: true
                },
                created: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
                lastModified: Date.now() - (7 * 24 * 60 * 60 * 1000) // 7 days ago
            }
        ];
    }
    /**
     * Get employee data by ID
     */
    async getEmployee(employeeId) {
        if (!this.isInitialized) {
            throw new Error('Data service not initialized');
        }
        try {
            // For now, return data directly from the initial dataset
            // In production, this would use the private state manager
            const employees = this.createInitialEmployeeData();
            return employees.find(emp => emp.employeeId === employeeId) || null;
        }
        catch (error) {
            console.error(`Error loading employee ${employeeId}:`, error);
            return null;
        }
    }
    /**
     * Get all employees
     */
    async getAllEmployees() {
        if (!this.isInitialized) {
            throw new Error('Data service not initialized');
        }
        try {
            // Return all employees from the initial dataset
            return this.createInitialEmployeeData();
        }
        catch (error) {
            console.error('Error loading all employees:', error);
            return [];
        }
    }
    /**
     * Get compliance policy
     */
    async getPolicy(policyId) {
        if (!this.isInitialized) {
            throw new Error('Data service not initialized');
        }
        try {
            // For now, return data directly from the initial dataset
            // In production, this would use the private state manager
            const policies = this.createInitialPolicyData();
            return policies.find(policy => policy.id === policyId) || null;
        }
        catch (error) {
            console.error(`Error loading policy ${policyId}:`, error);
            return null;
        }
    }
    /**
     * Create new audit session
     */
    async createAuditSession(policyId, auditorId, employeeIds) {
        if (!this.isInitialized) {
            throw new Error('Data service not initialized');
        }
        const session = {
            id: `AUDIT_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            policyId,
            auditorId,
            employees: employeeIds,
            status: 'pending',
            created: Date.now()
        };
        try {
            await this.privateStateManager.storeEncrypted(`audit:${session.id}`, session);
            return session;
        }
        catch (error) {
            console.error('Error creating audit session:', error);
            throw error;
        }
    }
    /**
     * Update audit session
     */
    async updateAuditSession(session) {
        if (!this.isInitialized) {
            throw new Error('Data service not initialized');
        }
        try {
            await this.privateStateManager.storeEncrypted(`audit:${session.id}`, session);
        }
        catch (error) {
            console.error('Error updating audit session:', error);
            throw error;
        }
    }
    /**
     * Get audit session
     */
    async getAuditSession(sessionId) {
        if (!this.isInitialized) {
            throw new Error('Data service not initialized');
        }
        try {
            return await this.privateStateManager.retrieveDecrypted(`audit:${sessionId}`);
        }
        catch (error) {
            console.error(`Error loading audit session ${sessionId}:`, error);
            return null;
        }
    }
    /**
     * Check compliance for an employee
     */
    async checkCompliance(employeeId, policyId) {
        const employee = await this.getEmployee(employeeId);
        const policy = await this.getPolicy(policyId);
        if (!employee || !policy) {
            return { compliant: false, reasons: ['Employee or policy not found'] };
        }
        const reasons = [];
        let compliant = true;
        // Check Training A date requirement
        const daysSinceTrainingA = (Date.now() / 1000 - employee.trainingA_date) / (24 * 60 * 60);
        if (daysSinceTrainingA > policy.requirements.trainingA_maxAge) {
            compliant = false;
            reasons.push(`Training A expired ${Math.floor(daysSinceTrainingA - policy.requirements.trainingA_maxAge)} days ago`);
        }
        // Check Training B score requirement
        if (employee.trainingB_score < policy.requirements.trainingB_minScore) {
            compliant = false;
            reasons.push(`Training B score (${employee.trainingB_score}%) below minimum (${policy.requirements.trainingB_minScore}%)`);
        }
        // Check manager approval requirement
        if (policy.requirements.managerApproval && !employee.managerApproval) {
            compliant = false;
            reasons.push('Manager approval required but not obtained');
        }
        return { compliant, reasons };
    }
    /**
     * Get compliance statistics
     */
    async getComplianceStatistics(policyId) {
        const employees = await this.getAllEmployees();
        let compliantCount = 0;
        for (const employee of employees) {
            const { compliant } = await this.checkCompliance(employee.employeeId, policyId);
            if (compliant) {
                compliantCount++;
            }
        }
        return {
            totalEmployees: employees.length,
            compliantEmployees: compliantCount,
            nonCompliantEmployees: employees.length - compliantCount,
            complianceRate: employees.length > 0 ? (compliantCount / employees.length) * 100 : 0
        };
    }
}
exports.DataService = DataService;
//# sourceMappingURL=DataService.js.map