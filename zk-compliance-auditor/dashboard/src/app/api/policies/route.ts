import { NextResponse } from 'next/server';

// Sample compliance policies for testing
const policies = [
  {
    id: 'POL001',
    name: 'Security Training Compliance',
    description: 'Annual security training requirement for all employees',
    minScore: 80,
    validityPeriod: 365, // days
    department: 'All',
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    hash: '0x' + Math.random().toString(16).substring(2, 66) // Mock policy hash
  },
  {
    id: 'POL002',
    name: 'Data Privacy Training',
    description: 'GDPR and data protection training requirement',
    minScore: 85,
    validityPeriod: 180, // days
    department: 'IT',
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days ago
    hash: '0x' + Math.random().toString(16).substring(2, 66) // Mock policy hash
  },
  {
    id: 'POL003',
    name: 'Financial Compliance',
    description: 'Financial regulations and compliance training',
    minScore: 90,
    validityPeriod: 90, // days
    department: 'Finance',
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
    hash: '0x' + Math.random().toString(16).substring(2, 66) // Mock policy hash
  }
];

export async function GET() {
  try {
    return NextResponse.json(policies);
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
  }
}
