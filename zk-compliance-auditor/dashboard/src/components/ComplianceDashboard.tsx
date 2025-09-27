/**
 * ZK Compliance Dashboard Main Component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Users, CheckCircle, AlertTriangle, Clock, Lock } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  department: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  lastAudit: string;
  trainingScore?: number;
}

interface AuditResult {
  employeeId: string;
  success: boolean;
  transactionHash?: string;
  proofHash: string;
  verificationTime: number;
  error?: string;
  timestamp: number;
}

export default function ComplianceDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'EMP001',
      name: 'Alice Johnson',
      department: 'IT Security',
      status: 'compliant',
      lastAudit: '2024-09-25',
      trainingScore: 92
    },
    {
      id: 'EMP002', 
      name: 'Bob Smith',
      department: 'Human Resources',
      status: 'compliant',
      lastAudit: '2024-09-20',
      trainingScore: 85
    },
    {
      id: 'EMP003',
      name: 'Carol Davis',
      department: 'Finance',
      status: 'non-compliant',
      lastAudit: '2024-08-15',
      trainingScore: 78
    }
  ]);

  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const runComplianceAudit = async (employeeId: string) => {
    setIsRunningAudit(true);
    setSelectedEmployee(employeeId);
    
    // Update employee status to pending
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, status: 'pending' as const } : emp
    ));

    try {
      // Simulate ZK proof generation and verification
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      const employee = employees.find(emp => emp.id === employeeId);
      const isCompliant = employee?.trainingScore && employee.trainingScore >= 80 && 
                         new Date(employee.lastAudit) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      
      const result: AuditResult = {
        employeeId,
        success: isCompliant || false,
        transactionHash: isCompliant ? `0x${Math.random().toString(16).substring(2, 66)}` : undefined,
        proofHash: Math.random().toString(16).substring(2, 18),
        verificationTime: 800 + Math.floor(Math.random() * 500),
        error: isCompliant ? undefined : 'Training requirements not met',
        timestamp: Date.now()
      };

      setAuditResults(prev => [result, ...prev]);
      
      // Update employee status
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeId ? { 
          ...emp, 
          status: result.success ? 'compliant' as const : 'non-compliant' as const,
          lastAudit: new Date().toISOString().split('T')[0]
        } : emp
      ));

    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsRunningAudit(false);
      setSelectedEmployee(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Compliant
          </span>
        );
      case 'non-compliant':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Non-Compliant
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1 animate-spin" />
            Auditing...
          </span>
        );
      default:
        return null;
    }
  };

  const complianceStats = {
    total: employees.length,
    compliant: employees.filter(emp => emp.status === 'compliant').length,
    nonCompliant: employees.filter(emp => emp.status === 'non-compliant').length,
    pending: employees.filter(emp => emp.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-700 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">ZK Compliance Auditor</h1>
        </div>
        <p className="text-midnight-300 text-lg">
          Zero-knowledge compliance verification using Midnight Protocol
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-400 mr-3" />
            <div>
              <p className="text-midnight-300 text-sm">Total Employees</p>
              <p className="text-2xl font-bold text-white">{complianceStats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <p className="text-midnight-300 text-sm">Compliant</p>
              <p className="text-2xl font-bold text-white">{complianceStats.compliant}</p>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mr-3" />
            <div>
              <p className="text-midnight-300 text-sm">Non-Compliant</p>
              <p className="text-2xl font-bold text-white">{complianceStats.nonCompliant}</p>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-midnight-300 text-sm">Pending Audits</p>
              <p className="text-2xl font-bold text-white">{complianceStats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Employee List */}
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Employee Compliance Status
          </h2>
          
          <div className="space-y-4">
            {employees.map((employee) => (
              <div key={employee.id} className="bg-midnight-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-white">{employee.name}</h3>
                    <p className="text-sm text-midnight-300">{employee.department}</p>
                  </div>
                  {getStatusBadge(employee.status)}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-midnight-400">
                    Last Audit: {employee.lastAudit}
                    {employee.trainingScore && (
                      <span className="ml-2">Score: {employee.trainingScore}%</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => runComplianceAudit(employee.id)}
                    disabled={isRunningAudit || employee.status === 'pending'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-midnight-600 
                             disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors
                             flex items-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {selectedEmployee === employee.id ? 'Generating Proof...' : 'Run ZK Audit'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Results */}
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Recent Audit Results
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {auditResults.length === 0 ? (
              <div className="text-center py-8">
                <Lock className="w-12 h-12 text-midnight-400 mx-auto mb-3" />
                <p className="text-midnight-400">No audits run yet</p>
                <p className="text-sm text-midnight-500">Click "Run ZK Audit" to start</p>
              </div>
            ) : (
              auditResults.map((result, index) => (
                <div key={index} className="bg-midnight-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-white">
                        Employee {result.employeeId}
                      </h3>
                      <p className="text-sm text-midnight-300">
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {result.success ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ❌ Failed
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-midnight-400 space-y-1">
                    <div>Proof Hash: <code className="text-midnight-300">{result.proofHash}</code></div>
                    {result.transactionHash && (
                      <div>TX Hash: <code className="text-midnight-300">{result.transactionHash.substring(0, 20)}...</code></div>
                    )}
                    <div>Verification Time: {result.verificationTime}ms</div>
                    {result.error && (
                      <div className="text-red-400">Error: {result.error}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-8 glass-effect rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <p className="text-midnight-300 text-sm">
            🔐 <strong>Demo Mode:</strong> This dashboard simulates ZK proof generation using mock data. 
            In production, actual cryptographic proofs would be generated using the Midnight Protocol.
          </p>
        </div>
      </div>
    </div>
  );
}