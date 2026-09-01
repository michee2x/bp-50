// pages/api/payments/initialize.ts
import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, amount, plan, billingCycle, userId } = req.body;

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ error: 'Paystack is not configured' });
    }

    if (
      PAYSTACK_SECRET_KEY.includes('your_secret_key') ||
      PAYSTACK_SECRET_KEY === 'sk_test_your_secret_key'
    ) {
      return res.status(500).json({
        error: 'Paystack secret key is still a placeholder. Update PAYSTACK_SECRET_KEY in .env.local.'
      });
    }

    if (!email || !amount || !plan || !billingCycle || !userId) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    const origin =
      (req.headers.origin as string | undefined) ||
      process.env.NEXT_PUBLIC_APP_URL ||
      `http://${req.headers.host}`;

    const normalizedAmount = Number(amount);
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }
    
    const params = JSON.stringify({
      email,
      amount: normalizedAmount,
      currency: 'NGN',
      metadata: {
        userId,
        plan,
        billingCycle,
        amount: normalizedAmount
      },
      callback_url: `${origin}/dashboard/billing?tab=subscription`,
      channels: ['card', 'bank', 'ussd', 'qr', 'bank_transfer']
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const request = https.request(options, (paystackRes) => {
      let data = '';
      
      paystackRes.on('data', (chunk) => {
        data += chunk;
      });

      paystackRes.on('end', () => {
        let response: any;

        try {
          response = JSON.parse(data);
        } catch (parseError) {
          console.error('Failed to parse Paystack initialize response:', parseError, data);
          return res.status(502).json({ error: 'Invalid response returned from Paystack' });
        }

        if (paystackRes.statusCode && paystackRes.statusCode >= 400) {
          return res.status(paystackRes.statusCode).json({
            error: response?.message || 'Paystack rejected the payment initialization request'
          });
        }

        if (response.status) {
          res.status(200).json({
            success: true,
            authorization_url: response.data.authorization_url,
            access_code: response.data.access_code,
            reference: response.data.reference
          });
        } else {
          res.status(400).json({ error: response.message });
        }
      });
    });

    request.on('error', (error) => {
      console.error('Paystack API error:', error);
      res.status(500).json({ error: 'Payment initialization failed' });
    });

    request.write(params);
    request.end();

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
