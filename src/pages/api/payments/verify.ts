// pages/api/payments/verify.ts
import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import { createClient } from '@supabase/supabase-js';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isConfigured = Boolean(supabaseUrl && supabaseServiceKey);

const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { reference } = req.body;

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ success: false, error: 'Paystack is not configured' });
    }

    if (!supabase || !supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        success: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY is required for payment verification updates'
      });
    }

    if (!reference) {
      return res.status(400).json({ success: false, error: 'Missing payment reference' });
    }

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    };

    const request = https.request(options, (paystackRes) => {
      let data = '';

      paystackRes.on('data', (chunk) => {
        data += chunk;
      });

      paystackRes.on('end', async () => {
        let response: any;

        try {
          response = JSON.parse(data);
        } catch (parseError) {
          console.error('Failed to parse Paystack verify response:', parseError, data);
          return res.status(502).json({
            success: false,
            error: 'Invalid response returned from Paystack'
          });
        }

        if (paystackRes.statusCode && paystackRes.statusCode >= 400) {
          return res.status(paystackRes.statusCode).json({
            success: false,
            error: response?.message || 'Paystack rejected the payment verification request'
          });
        }

        if (!response.status || response.data?.status !== 'success') {
          return res.status(400).json({
            success: false,
            error: response?.message || 'Payment verification failed'
          });
        }

        try {
          const { metadata, amount, customer } = response.data;
          const userId = metadata?.userId;
          const plan = metadata?.plan;
          const billingCycle = metadata?.billingCycle;

          if (!userId || !plan || !billingCycle) {
            return res.status(400).json({
              success: false,
              error: 'Missing metadata from verified payment'
            });
          }

          const now = new Date();
          const periodEnd = new Date(now);
          periodEnd.setMonth(periodEnd.getMonth() + (billingCycle === 'yearly' ? 12 : 1));

          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              plan,
              updated_at: now.toISOString()
            })
            .eq('id', userId);

          if (profileError) throw profileError;

          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              plan,
              status: 'active',
              amount,
              currency: response.data.currency || 'NGN',
              interval: billingCycle,
              current_period_start: now.toISOString(),
              current_period_end: periodEnd.toISOString(),
              cancel_at_period_end: false,
              payment_reference: reference,
              created_at: now.toISOString(),
              updated_at: now.toISOString()
            }, {
              onConflict: 'user_id'
            });

          if (subscriptionError) throw subscriptionError;

          const { data: existingInvoice, error: existingInvoiceError } = await supabase
            .from('invoices')
            .select('id')
            .eq('payment_reference', reference)
            .maybeSingle();

          if (existingInvoiceError) throw existingInvoiceError;

          if (!existingInvoice) {
            const { error: invoiceError } = await supabase
              .from('invoices')
              .insert({
                user_id: userId,
                plan,
                amount,
                currency: response.data.currency || 'NGN',
                status: 'paid',
                payment_reference: reference,
                invoice_url: response.data.receipt_url || null,
                description: `${plan} plan subscription`,
                created_at: now.toISOString()
              });

            if (invoiceError) throw invoiceError;
          }

          const { data: existingActivity, error: existingActivityError } = await supabase
            .from('user_activity')
            .select('id')
            .eq('user_id', userId)
            .eq('activity_type', 'plan_upgrade')
            .eq('metadata->>reference', reference)
            .maybeSingle();

          if (existingActivityError) throw existingActivityError;

          if (!existingActivity) {
            const { error: activityError } = await supabase
              .from('user_activity')
              .insert({
                user_id: userId,
                activity_type: 'plan_upgrade',
                metadata: {
                  to: plan,
                  amount: amount / 100,
                  billingCycle,
                  reference,
                  customer: customer?.email || null
                },
                created_at: now.toISOString()
              });

            if (activityError) throw activityError;
          }

          return res.status(200).json({
            success: true,
            data: {
              ...response.data,
              plan,
              billingCycle
            }
          });
        } catch (dbError) {
          console.error('Payment verification database error:', dbError);
          return res.status(500).json({
            success: false,
            error: 'Payment verified with Paystack, but subscription update failed'
          });
        }
      });
    });

    request.on('error', (error) => {
      console.error('Paystack verification error:', error);
      res.status(500).json({ success: false, error: 'Payment verification failed' });
    });

    request.end();
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
