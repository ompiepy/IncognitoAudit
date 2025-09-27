import { ZKComplianceAuditor, PrivateTrainingData, PublicAuditData } from './ZKComplianceAuditor.compact';
import { Field } from '@midnight-ntwrk/compact';

/**
 * Test suite for ZK Compliance Auditor contract
 */

describe('ZKComplianceAuditor', () => {
  let contract: ZKComplianceAuditor;
  
  beforeEach(() => {
    contract = new ZKComplianceAuditor();
  });
  
  describe('verifyTrainingCompliance', () => {
    it('should verify valid compliance data', () => {
      const currentTime = Field(1690000000n); // Mock current timestamp
      const trainingADate = Field(1689000000n); // Recent completion (within 365 days)
      const trainingBScore = Field(85n); // Above minimum score
      const employeeId = Field(12345n);
      
      const privateData = new PrivateTrainingData(
        trainingADate,
        trainingBScore, 
        employeeId
      );
      
      const publicData = new PublicAuditData(
        currentTime,
        Field(12345n), // Expected policy hash
        Field(1n) // Audit ID
      );
      
      const result = contract.verifyTrainingCompliance(privateData, publicData);
      expect(result).toBe(true);
    });
    
    it('should reject compliance data with low score', () => {
      const currentTime = Field(1690000000n);
      const trainingADate = Field(1689000000n);
      const trainingBScore = Field(75n); // Below minimum score
      const employeeId = Field(12345n);
      
      const privateData = new PrivateTrainingData(
        trainingADate,
        trainingBScore,
        employeeId
      );
      
      const publicData = new PublicAuditData(
        currentTime,
        Field(12345n),
        Field(1n)
      );
      
      expect(() => {
        contract.verifyTrainingCompliance(privateData, publicData);
      }).toThrow('Training B score must be >= 80');
    });
    
    it('should reject compliance data with expired training', () => {
      const currentTime = Field(1690000000n);
      const trainingADate = Field(1650000000n); // More than 365 days ago
      const trainingBScore = Field(85n);
      const employeeId = Field(12345n);
      
      const privateData = new PrivateTrainingData(
        trainingADate,
        trainingBScore,
        employeeId
      );
      
      const publicData = new PublicAuditData(
        currentTime,
        Field(12345n),
        Field(1n)
      );
      
      expect(() => {
        contract.verifyTrainingCompliance(privateData, publicData);
      }).toThrow('Training A must be completed within last 365 days');
    });
    
    it('should reject invalid policy hash', () => {
      const currentTime = Field(1690000000n);
      const trainingADate = Field(1689000000n);
      const trainingBScore = Field(85n);
      const employeeId = Field(12345n);
      
      const privateData = new PrivateTrainingData(
        trainingADate,
        trainingBScore,
        employeeId
      );
      
      const publicData = new PublicAuditData(
        currentTime,
        Field(99999n), // Wrong policy hash
        Field(1n)
      );
      
      expect(() => {
        contract.verifyTrainingCompliance(privateData, publicData);
      }).toThrow('Invalid policy hash - audit not authorized');
    });
  });
  
  describe('verifyComplianceStatistics', () => {
    it('should verify valid compliance statistics', () => {
      const totalEmployees = Field(100n);
      const compliantEmployees = Field(95n); // 95% compliance rate
      
      const publicData = new PublicAuditData(
        Field(1690000000n),
        Field(12345n),
        Field(1n)
      );
      
      const result = contract.verifyComplianceStatistics(
        totalEmployees,
        compliantEmployees,
        publicData
      );
      
      expect(result).toBe(true);
    });
    
    it('should reject low compliance rate', () => {
      const totalEmployees = Field(100n);
      const compliantEmployees = Field(85n); // 85% compliance rate (below 90% threshold)
      
      const publicData = new PublicAuditData(
        Field(1690000000n),
        Field(12345n),
        Field(1n)
      );
      
      expect(() => {
        contract.verifyComplianceStatistics(
          totalEmployees,
          compliantEmployees,
          publicData
        );
      }).toThrow('Compliance rate must be >= 90%');
    });
  });
});