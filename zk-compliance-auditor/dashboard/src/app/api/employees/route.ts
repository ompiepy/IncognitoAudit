import { NextResponse } from 'next/server';

// Sample employee data for testing dashboard functionality
// Full dataset returned by API (UI will control which fields are rendered)
const employees = [
  {
    id: 'EMP001',
    name: 'Alice Johnson',
    department: 'IT Security',
    status: 'compliant',
    lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    trainingScore: 92,
    trainingA_date: Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000),
    trainingB_score: 92,
    departmentId: 'IT_SEC',
    sensitiveNotes: 'Excellent performance in security protocols'
  },
  {
    id: 'EMP002',
    name: 'Bob Smith',
    department: 'Human Resources',
    status: 'compliant',
    lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    trainingScore: 85,
    trainingA_date: Math.floor((Date.now() - 60 * 24 * 60 * 60 * 1000) / 1000),
    trainingB_score: 85,
    departmentId: 'HR_DEPT',
    sensitiveNotes: 'Good understanding of HR policies'
  },
  {
    id: 'EMP003',
    name: 'Carol Davis',
    department: 'Finance',
    status: 'non-compliant',
    lastAudit: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    trainingScore: 78,
    trainingA_date: Math.floor((Date.now() - 400 * 24 * 60 * 60 * 1000) / 1000),
    trainingB_score: 78,
    departmentId: 'FIN_DEPT',
    sensitiveNotes: 'Needs additional training on new regulations'
  }
];

export async function GET() {
  try {
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}
