"use strict";
/**
 * Mock implementations for demo purposes
 * These simulate the MidnightJS SDK functionality for the hackathon demo
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateStateManager = exports.MidnightJSSDK = void 0;
/**
 * Mock MidnightJS SDK for demo purposes
 */
class MidnightJSSDK {
    constructor(config) {
        this.config = config;
    }
    async generateProof(params) {
        // Simulate proof generation time
        await this.delay(100 + Math.random() * 200);
        // Mock proof data - in real implementation this would be cryptographic proof
        return {
            proofData: this.generateMockProofData(),
            publicSignals: [
                params.inputs.public.current_time.toString(),
                params.inputs.public.policy_hash.toString(),
                params.inputs.public.audit_id.toString()
            ],
            proof: {
                a: [
                    "0x" + this.randomHex(64),
                    "0x" + this.randomHex(64)
                ],
                b: [
                    ["0x" + this.randomHex(64), "0x" + this.randomHex(64)],
                    ["0x" + this.randomHex(64), "0x" + this.randomHex(64)]
                ],
                c: [
                    "0x" + this.randomHex(64),
                    "0x" + this.randomHex(64)
                ]
            }
        };
    }
    async submitTransaction(params) {
        // Simulate network submission time
        await this.delay(500 + Math.random() * 1000);
        return {
            hash: "0x" + this.randomHex(64),
            status: 'confirmed',
            gasUsed: 150000 + Math.floor(Math.random() * 50000)
        };
    }
    generateMockProofData() {
        return "0x" + this.randomHex(512); // Mock proof data
    }
    randomHex(length) {
        let result = '';
        const characters = '0123456789abcdef';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.MidnightJSSDK = MidnightJSSDK;
/**
 * Mock Private State Manager for demo purposes
 */
class PrivateStateManager {
    constructor(config) {
        this.storage = new Map();
        this.encryptionKey = config.encryptionKey;
        this.initializeMockData();
    }
    async store(key, data) {
        const encrypted = this.mockEncrypt(data);
        this.storage.set(key, encrypted);
    }
    async retrieve(key) {
        return this.storage.get(key) || null;
    }
    async decrypt(encryptedData) {
        return this.mockDecrypt(encryptedData);
    }
    mockEncrypt(data) {
        // Simple mock encryption - in real implementation use proper encryption
        return Buffer.from(data).toString('base64');
    }
    mockDecrypt(encryptedData) {
        // Simple mock decryption
        return Buffer.from(encryptedData, 'base64').toString('utf8');
    }
    initializeMockData() {
        // Initialize with sample employee data for demo
        const sampleEmployees = [
            {
                employeeId: "EMP001",
                trainingA_date: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // 30 days ago
                trainingB_score: 92,
                departmentId: "IT",
                sensitiveNotes: "Completed advanced security training"
            },
            {
                employeeId: "EMP002",
                trainingA_date: Math.floor(Date.now() / 1000) - (60 * 24 * 60 * 60), // 60 days ago
                trainingB_score: 85,
                departmentId: "HR",
                sensitiveNotes: "Completed management training"
            },
            {
                employeeId: "EMP003",
                trainingA_date: Math.floor(Date.now() / 1000) - (400 * 24 * 60 * 60), // 400 days ago (expired)
                trainingB_score: 78, // Below threshold
                departmentId: "Finance",
                sensitiveNotes: "Needs to retake training"
            }
        ];
        sampleEmployees.forEach(employee => {
            const encrypted = this.mockEncrypt(JSON.stringify(employee));
            this.storage.set(employee.employeeId, encrypted);
        });
    }
}
exports.PrivateStateManager = PrivateStateManager;
//# sourceMappingURL=MockMidnightSDK.js.map