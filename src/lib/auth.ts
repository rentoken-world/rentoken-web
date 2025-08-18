import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  sub: string;
  address: string;
  email?: string;
}

export interface TokenPayload {
  userId: string;
  address: string;
  name?: string;
  planId?: string;
  status: string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authorization = request.headers.get('authorization');
    
    if (!authorization?.startsWith('Bearer ')) {
      return null;
    }

    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    return {
      sub: decoded.sub,
      address: decoded.address,
      email: decoded.email
    };
  } catch (error) {
    return null;
  }
}

export function createToken(payload: TokenPayload) {
  const tokenPayload = {
    sub: payload.userId,
    address: payload.address,
    name: payload.name,
    planId: payload.planId,
    status: payload.status,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET);

  return {
    token,
    user: {
      id: payload.userId,
      address: payload.address,
      name: payload.name,
      planId: payload.planId,
      status: payload.status
    },
    expiresAt: new Date(tokenPayload.exp * 1000).toISOString()
  };
}

export function createAuthResponse(statusCode: number, message: string, data?: any) {
  return new Response(
    JSON.stringify({
      success: statusCode < 400,
      message,
      ...data
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}