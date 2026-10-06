// src/pages/api/email/queue-welcome.ts
// Called immediately after a user signs up.
// Writes 3 scheduled rows into email_notifications so the process-queue cron sends them at the right time.

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

  const { userId, email, name } = req.body;

  if (!userId || !email || !name) {
    return res.status(400).json({ error: 'Missing userId, email, or name' });
  }

  try {
    // Check we haven't already queued a welcome flow for this user
    const { count } = await supabase
      .from('email_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('email_type', 'welcome');

    if (count && count > 0) {
      return res.status(200).json({ skipped: true, message: 'Welcome flow already queued' });
    }

    const emails = [
      { send_at: daysFromNow(0), email_key: 'welcome_1' },
      { send_at: daysFromNow(1), email_key: 'welcome_2' },
      { send_at: daysFromNow(3), email_key: 'welcome_3' },
    ];

    const rows = emails.map(({ send_at, email_key }) => ({
      user_id: userId,
      email_to: email,
      email_type: 'welcome',
      email_subject: '',        // filled by process-queue from template
      email_body: '',           // filled by process-queue from template
      metadata: { user_name: name, email_key },
      scheduled_for: send_at,
      status: 'pending',
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('email_notifications').insert(rows);

    if (error) throw error;

    console.log(`✅ Welcome flow queued for ${email} (${rows.length} emails)`);
    return res.status(200).json({ success: true, queued: rows.length });
  } catch (err: any) {
    console.error('queue-welcome error:', err);
    return res.status(500).json({ error: err.message || 'Failed to queue welcome emails' });
  }
}
