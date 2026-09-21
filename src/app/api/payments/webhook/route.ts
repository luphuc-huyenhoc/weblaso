import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import crypto from 'crypto';
import { SubscriptionStatus, PlanType, PaymentStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-payment-signature');

    // In production, verify HMAC signature using process.env.PAYMENT_WEBHOOK_SECRET
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || 'dev_secret';
    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    // Allow simulated webhook in local if matching or if test header present
    const isVerified = signature === computedSignature || process.env.NODE_ENV !== 'production';
    if (!isVerified) {
      return NextResponse.json({ status: 401, message: 'Chữ ký không hợp lệ' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { eventType, userId, transactionId, amount, planType, durationDays } = payload;

    // Log the payment event
    const idempotencyKey = `PAY-${transactionId || Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const payment = await db.payment.create({
      data: {
        userId,
        amount: amount || 199000,
        currency: 'VND',
        status: PaymentStatus.SUCCESS,
        provider: 'PAYMENT_GATEWAY',
        transactionId: transactionId || `TXN-${Date.now()}`,
        idempotencyKey,
      },
    });

    await db.paymentEvent.create({
      data: {
        paymentId: payment.id,
        eventType: eventType || 'payment.succeeded',
        payload,
      },
    });

    if (eventType === 'payment.succeeded' || !eventType) {
      const days = durationDays || 30;
      const startDate = new Date();
      const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      // Upsert subscription
      await db.subscription.create({
        data: {
          userId,
          planType: PlanType.PRO_MONTHLY,
          status: SubscriptionStatus.ACTIVE,
          startDate,
          endDate,
        },
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Webhook processed successfully',
      paymentId: payment.id,
    });
  } catch (error: any) {
    console.error('Payment webhook error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Lỗi xử lý webhook thanh toán' },
      { status: 500 }
    );
  }
}
