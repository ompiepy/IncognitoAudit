import { NextResponse } from 'next/server';

// Start with no audit results; results will be added after tests run
const auditResults: any[] = [];

export async function GET() {
  try {
    return NextResponse.json(auditResults);
  } catch (error) {
    console.error('Error fetching audit results:', error);
    return NextResponse.json({ error: 'Failed to fetch audit results' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create new audit result
    const newAuditResult = {
      id: 'AUDIT' + (auditResults.length + 1).toString().padStart(3, '0'),
      ...body,
      auditDate: new Date().toISOString(),
      proofHash: '0x' + Math.random().toString(16).substring(2, 66),
      transactionHash: '0x' + Math.random().toString(16).substring(2, 66),
      auditor: 'System Auditor'
    };
    
    auditResults.push(newAuditResult);
    
    return NextResponse.json(newAuditResult, { status: 201 });
  } catch (error) {
    console.error('Error creating audit result:', error);
    return NextResponse.json({ error: 'Failed to create audit result' }, { status: 500 });
  }
}
