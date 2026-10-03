// src/pages/api/email/process-queue.ts
// Cron endpoint — runs hourly via Vercel Cron.
// Picks up all pending email_notifications where scheduled_at <= now, sends via Resend, marks sent/failed.

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
  welcomeEmail1, welcomeEmail2, welcomeEmail3,
  postTestEmail1, postTestEmail2, postTestEmail3,
  inactiveNudgeEmail,
} from '../../../lib/email-templates';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'BrandPawa <hello@brandpawa.com>';
const BATCH_LIMIT = 20; // max emails per cron run to stay within Resend rate limits

function resolveTemplate(
  emailKey: string,
  name: string,
  metadata?: Record<string, any>
): { subject: string; html: string } | null {
  const score: number = metadata?.score ?? 0;
  const stage: string = metadata?.stage ?? 'Emerging Pawa';

  switch (emailKey) {
    case 'welcome_1':   return welcomeEmail1(name);
    case 'welcome_2':   return welcomeEmail2(name);
    case 'welcome_3':   return welcomeEmail3(name);
    case 'post_test_1': return postTestEmail1(name, score, stage);
    case 'post_test_2': return postTestEmail2(name, score);
    case 'post_test_3': return postTestEmail3(name, score);
    case 'inactive':    return inactiveNudgeEmail(name, score || null);
    default:            return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET (Vercel Cron) or POST (manual trigger)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Protect with a shared secret so only Vercel Cron (or you) can trigger it
  const secret = req.headers['x-cron-secret'] ?? req.query.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('PLACEHOLDER')) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured. Add it to your environment variables.' });
  }

  try {
    // Fetch due pending emails
    const { data: due, error: fetchError } = await supabase
      .from('email_notifications')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(BATCH_LIMIT);

    if (fetchError) throw fetchError;
    if (!due || due.length === 0) {
      return res.status(200).json({ processed: 0, message: 'No emails due' });
    }

    const results: { id: string; email_key: string; status: string; error?: string }[] = [];

    for (const row of due) {
      const template = resolveTemplate(row.email_key, row.name, row.metadata);

      if (!template) {
        // Unknown key — mark as failed so it doesn't block the queue
        await supabase
          .from('email_notifications')
          .update({ status: 'failed', sent_at: new Date().toISOString(), error: 'Unknown email_key' })
          .eq('id', row.id);
        results.push({ id: row.id, email_key: row.email_key, status: 'failed', error: 'Unknown email_key' });
        continue;
      }

      try {
        const { error: sendError } = await resend.emails.send({
          from: FROM,
          to: row.email,
          subject: template.subject,
          html: template.html,
        });

        if (sendError) throw sendError;

        await supabase
          .from('email_notifications')
          .update({ status: 'sent', sent_at: new Date().toISOString() })
          .eq('id', row.id);

        results.push({ id: row.id, email_key: row.email_key, status: 'sent' });
      } catch (sendErr: any) {
        const errMsg = sendErr?.message ?? String(sendErr);
        await supabase
          .from('email_notifications')
          .update({ status: 'failed', sent_at: new Date().toISOString(), error: errMsg })
          .eq('id', row.id);
        results.push({ id: row.id, email_key: row.email_key, status: 'failed', error: errMsg });
      }
    }

    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;
    console.log(`📧 Email cron: ${sent} sent, ${failed} failed out of ${due.length} due`);

    return res.status(200).json({ processed: due.length, sent, failed, results });
  } catch (err: any) {
    console.error('process-queue error:', err);
    return res.status(500).json({ error: err.message || 'Cron processing failed' });
  }
}
