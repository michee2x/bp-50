// src/pages/api/email/queue-post-test.ts
// Called when a user completes a diagnostic (saveFinalResults in Diagnostic 1).
// Queues 3 post-test emails with score context.

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, email, name, score, stage, diagnosticId } = req.body;

  if (!userId || !email || !name || score === undefined || !stage) {
    return res.status(400).json({ error: 'Missing required fields: userId, email, name, score, stage' });
  }

  try {
    // Delete any previous post-test flow for this diagnostic so re-takes get fresh emails
    await supabase
      .from('email_notifications')
      .delete()
      .eq('user_id', userId)
      .eq('flow', 'post_test')
      .eq('status', 'pending');

    const emails = [
      { send_at: daysFromNow(0), email_key: 'post_test_1' },
      { send_at: daysFromNow(1), email_key: 'post_test_2' },
      { send_at: daysFromNow(3), email_key: 'post_test_3' },
    ];

    const rows = emails.map(({ send_at, email_key }) => ({
      user_id: userId,
      email,
      name,
      flow: 'post_test',
      email_key,
      // Store score + stage so the processor can personalise the email
      metadata: { score, stage, diagnosticId: diagnosticId ?? 1 },
      scheduled_at: send_at,
      status: 'pending',
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('email_notifications').insert(rows);

    if (error) throw error;

    console.log(`✅ Post-test flow queued for ${email} | score: ${score}/100 | stage: ${stage}`);
    return res.status(200).json({ success: true, queued: rows.length });
  } catch (err: any) {
    console.error('queue-post-test error:', err);
    return res.status(500).json({ error: err.message || 'Failed to queue post-test emails' });
  }
}
