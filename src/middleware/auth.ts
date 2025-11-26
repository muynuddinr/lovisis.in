import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function authMiddleware(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and extract payload for authorization purposes
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    
    // Attach user info to request for downstream handlers
    (request as any).user = decoded;
    
    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}