"use strict";
/**
 * Mock Data Generator for ZK Compliance Demo
 *
 * This module creates realistic training and employee data for demonstration purposes.
 * In a real implementation, this would be replaced with secure data sources.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockDataGenerator = exports.MockDataGenerator = exports.MockShieldedState = void 0;
/**
 * Mock Shielded State Manager
 * Simulates Midnight's shielded state functionality
 */
class MockShieldedState {
    constructor() {
        this.encryptedStorage = new Map();
        this.accessLog = [];
    }
    /**
     * Store encrypted data in shielded state
     */
    async storeEncrypted(key, data) {
        const encrypted = this.mockEncrypt(JSON.stringify(data));
        this.encryptedStorage.set(key, encrypted);
        this.accessLog.push({ key, action: 'write', timestamp: Date.now() });
    }
    /**
     * Retrieve and decrypt data from shielded state
     */
    async retrieveDecrypted(key) {
        const encrypted = this.encryptedStorage.get(key);
        if (!encrypted) {
            return null;
        }
        this.accessLog.push({ key, action: 'read', timestamp: Date.now() });
        const decrypted = this.mockDecrypt(encrypted);
        return JSON.parse(decrypted);
    }
    /**
     * Get access audit trail (for compliance purposes)
     */
    getAccessLog() {
        return [...this.accessLog];
    }
    mockEncrypt(data) {
        // Simple base64 encoding for demo - real implementation would use proper encryption
        return Buffer.from(data).toString('base64');
    }
    mockDecrypt(encrypted) {
        return Buffer.from(encrypted, 'base64').toString('utf8');
    }
}
exports.MockShieldedState = MockShieldedState;
/**
 * Mock Data Generator Class
 */
class MockDataGenerator {
    constructor() {
        this.employees = [];
        this.policies = [];
        this.shieldedState = new MockShieldedState();
        this.initializeData();
    }
    /**
     * Initialize mock data for demo
     */
    async initializeData() {
        // Create compliance policies
        this.policies = [
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
            },
            {
                id: 'POLICY_002',
                name: 'Security Awareness Training',
                description: 'Enhanced security training requirements',
                requirements: {
                    trainingA_maxAge: 180,
                    trainingB_minScore: 85,
                    managerApproval: true
                },
                created: Date.now() - (60 * 24 * 60 * 60 * 1000),
                lastModified: Date.now() - (14 * 24 * 60 * 60 * 1000)
            }
        ];
        // Create employee training records
        this.employees = [
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
            },
            {
                employeeId: 'EMP004',
                employeeName: 'David Wilson',
                department: 'Engineering',
                trainingA_date: Math.floor(Date.now() / 1000) - (10 * 24 * 60 * 60), // 10 days ago
                trainingB_score: 94,
                sensitiveNotes: 'Senior engineer with full compliance status',
                lastLogin: Date.now() - (30 * 60 * 1000), // 30 minutes ago
                managerApproval: true
            },
            {
                employeeId: 'EMP005',
                employeeName: 'Eva Martinez',
                department: 'Legal',
                trainingA_date: Math.floor(Date.now() / 1000) - (45 * 24 * 60 * 60), // 45 days ago
                trainingB_score: 88,
                sensitiveNotes: 'Legal counsel, handles confidential legal matters',
                lastLogin: Date.now() - (6 * 60 * 60 * 1000), // 6 hours ago
                managerApproval: true
            }
        ];
        // Store data in shielded state
        for (const employee of this.employees) {
            await this.shieldedState.storeEncrypted(`employee:${employee.employeeId}`, employee);
        }
        for (const policy of this.policies) {
            await this.shieldedState.storeEncrypted(`policy:${policy.id}`, policy);
        }
    }
    /**
     * Get employee data (from shielded state)
     */
    async getEmployeeData(employeeId) {
        return await this.shieldedState.retrieveDecrypted(`employee:${employeeId}`);
    }
    /**
     * Get all employees (for dashboard display)
     */
    async getAllEmployees() {
        const employees = [];
        for (const emp of this.employees) {
            const data = await this.getEmployeeData(emp.employeeId);
            if (data) {
                employees.push(data);
            }
        }
        return employees;
    }
    /**
     * Get compliance policy
     */
    async getPolicy(policyId) {
        return await this.shieldedState.retrieveDecrypted(`policy:${policyId}`);
    }
    /**
     * Create new audit session
     */
    async createAuditSession(policyId, auditorId, employeeIds) {
        const session = {
            id: `AUDIT_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            policyId,
            auditorId,
            employees: employeeIds,
            status: 'pending',
            created: Date.now()
        };
        await this.shieldedState.storeEncrypted(`audit:${session.id}`, session);
        return session;
    }
    /**
     * Simulate compliance check (without ZK proof)
     */
    async checkCompliance(employeeId, policyId) {
        const employee = await this.getEmployeeData(employeeId);
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
     * Get access audit trail
     */
    getDataAccessLog() {
        return this.shieldedState.getAccessLog();
    }
    /**
     * Generate compliance statistics
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
exports.MockDataGenerator = MockDataGenerator;
// Export singleton instance for demo
exports.mockDataGenerator = new MockDataGenerator();
//# sourceMappingURL=MockDataGenerator.js.map