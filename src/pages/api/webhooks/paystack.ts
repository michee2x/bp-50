// pages/api/webhooks/paystack.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  
  // Ensure secret is available
  if (!secret) {
    return res.status(500).json({ error: 'PAYSTACK_SECRET_KEY is not configured' });
  }

  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
    
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;
  
  // Handle different webhook events
  switch (event.event) {
    case 'charge.success':
      if (!supabase) {
        console.error('Supabase not configured for webhook processing');
        break;
      }
      
      try {
        const { metadata, amount, customer, reference, currency } = event.data;
        const userId = metadata?.userId;
        const plan = metadata?.plan;
        const billingCycle = metadata?.billingCycle;

        if (!userId || !plan || !billingCycle) {
          console.error('Missing metadata from webhook event');
          break;
        }

        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + (billingCycle === 'yearly' ? 12 : 1));

        // Update profile
        await supabase
          .from('profiles')
          .update({
            plan,
            updated_at: now.toISOString()
          })
          .eq('id', userId);

        // Update subscription
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan,
            status: 'active',
            amount,
            currency: currency || 'NGN',
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

        // Check and insert invoice
        const { data: existingInvoice } = await supabase
          .from('invoices')
          .select('id')
          .eq('payment_reference', reference)
          .maybeSingle();

        if (!existingInvoice) {
          await supabase
            .from('invoices')
            .insert({
              user_id: userId,
              plan,
              amount,
              currency: currency || 'NGN',
              status: 'paid',
              payment_reference: reference,
              invoice_url: event.data.receipt_url || null,
              description: `${plan} plan subscription`,
              created_at: now.toISOString()
            });
        }

        // Check and insert user activity
        const { data: existingActivity } = await supabase
          .from('user_activity')
          .select('id')
          .eq('user_id', userId)
          .eq('activity_type', 'plan_upgrade')
          .eq('metadata->>reference', reference)
          .maybeSingle();

        if (!existingActivity) {
          await supabase
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
        }

        console.log(`Successfully processed webhook for reference: ${reference}`);
      } catch (dbError) {
        console.error('Webhook database error:', dbError);
      }
      break;
      
    case 'subscription.create':
      // Handle new subscription
      break;
      
    case 'subscription.disable':
      // Handle subscription cancellation
      break;
      
    default:
      console.log(`Unhandled event: ${event.event}`);
  }
  
  res.status(200).json({ received: true });
}