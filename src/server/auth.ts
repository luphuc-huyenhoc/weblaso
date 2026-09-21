import { db } from './db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { User, Role, Subscription, SubscriptionStatus, PlanType } from '@prisma/client';

const SESSION_COOKIE_NAME = 'luphuc_session';
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/** Hash plaintext using SHA-256 for tokens and sessions */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Hash password using bcrypt */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/** Verify password */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface AuthSessionUser extends User {
  activeSubscription?: Subscription | null;
}

/** Create an opaque server session and attach HttpOnly cookie */
export async function createSession(userId: string, reqIp?: string, reqUserAgent?: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const sessionToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await db.session.create({
    data: {
      userId,
      sessionToken,
      ipAddress: reqIp,
      userAgent: reqUserAgent,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return rawToken;
}

/** Retrieve current authenticated user from session cookie */
export async function getCurrentUser(): Promise<AuthSessionUser | null> {
  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!rawToken) return null;

    const tokenHash = hashToken(rawToken);
    const session = await db.session.findUnique({
      where: { sessionToken: tokenHash },
      include: {
        user: {
          include: {
            subscriptions: {
              where: {
                status: SubscriptionStatus.ACTIVE,
                OR: [
                  { endDate: null },
                  { endDate: { gt: new Date() } }
                ]
              },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const { subscriptions, ...userFields } = session.user;
    return {
      ...userFields,
      activeSubscription: subscriptions[0] ?? null,
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

/** Destroy current session */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (rawToken) {
      const tokenHash = hashToken(rawToken);
      await db.session.deleteMany({
        where: { sessionToken: tokenHash },
      });
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (e) {
    console.error('Error destroying session:', e);
  }
}
