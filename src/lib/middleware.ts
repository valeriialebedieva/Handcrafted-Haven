// Route protection middleware
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export async function requireAuth(request: NextRequest, allowedRoles?: ('artisan' | 'customer')[]) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const payload = await verifyToken(token);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
  
  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return payload;
}

export async function optionalAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

