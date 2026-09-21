import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'healthy';
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await db.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (error: any) {
    dbStatus = 'unhealthy';
    console.error('Database health check failed:', error);
  }

  const isHealthy = dbStatus === 'healthy';

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      latencyMs: Date.now() - startTime,
      services: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
          engine: 'PostgreSQL 16',
        },
        baziEngine: {
          status: 'operational',
          version: '1.0.0',
          methodology: 'zi-ping-manh-phai-v1',
        },
        ziweiEngine: {
          status: 'operational',
          version: '1.0.0',
          methodology: 'dau-so-toan-thu-v1',
        },
        ichingEngine: {
          status: 'operational',
          version: '1.0.0',
          methodology: 'luc-hao-da-hac-v1',
        },
        fengshuiEngine: {
          status: 'operational',
          version: '1.0.0',
          methodology: 'bat-trach-minh-canh-v1',
        },
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
