import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET (from Vercel Cron) or POST (manual trigger)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Protect endpoint with shared secret
  const secret = req.headers['x-cron-secret'] ?? req.query.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 1. Find users who have been inactive for 14+ days.
    // We check 'updated_at' to see when their profile was last modified
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const { data: inactiveUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, brand_score, updated_at')
      .lt('updated_at', fourteenDaysAgo.toISOString());

    if (usersError) throw usersError;

    if (!inactiveUsers || inactiveUsers.length === 0) {
      return res.status(200).json({ queued: 0, message: 'No inactive users found' });
    }

    let queuedCount = 0;

    for (const user of inactiveUsers) {
      // 2. Check if we've ALREADY queued an inactive email for this user
      const { count, error: checkError } = await supabase
        .from('email_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('email_type', 'inactive');

      if (checkError) {
        console.error(`Error checking previous inactive emails for ${user.email}:`, checkError);
        continue;
      }

      if (count && count > 0) {
        // We already nudged them for being inactive at some point. Skip.
        continue;
      }

      // 3. Queue the inactive email
      const { error: insertError } = await supabase
        .from('email_notifications')
        .insert({
          user_id: user.id,
          email_to: user.email,
          email_type: 'inactive',
          email_subject: '', // Will be filled by process-queue
          email_body: '',    // Will be filled by process-queue
          metadata: { 
            user_name: user.full_name,
            email_key: 'inactive',
            score: user.brand_score
          },
          scheduled_for: new Date().toISOString(), // Process immediately on next cron
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error(`Error queuing inactive email for ${user.email}:`, insertError);
      } else {
        queuedCount++;
      }
    }

    return res.status(200).json({ success: true, queued: queuedCount });

  } catch (error: any) {
    console.error('queue-inactive error:', error);
    return res.status(500).json({ error: error.message || 'Failed to process inactive users' });
  }
}
