import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Admin client - bypasses ALL RLS and GRANT restrictions
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      id, email, full_name, plan,
      brand_score, brand_stage,
      diagnostic_count, last_diagnostic_at
    } = req.body;

    if (!id) return res.status(400).json({ error: 'Missing user id' });

    // Build payload
    const payload: any = { id, updated_at: new Date().toISOString() };
    if (email !== undefined) payload.email = email;
    if (full_name !== undefined) payload.full_name = full_name;
    if (plan !== undefined) payload.plan = plan;
    if (brand_score !== undefined) payload.brand_score = brand_score;
    if (brand_stage !== undefined) payload.brand_stage = brand_stage;
    if (diagnostic_count !== undefined) payload.diagnostic_count = diagnostic_count;
    if (last_diagnostic_at !== undefined) payload.last_diagnostic_at = last_diagnostic_at;

    // Check if profile already exists
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!existing) {
      // New user — set defaults
      if (!payload.plan) payload.plan = 'free';
      if (!payload.full_name) payload.full_name = email?.split('@')[0] || 'User';
      if (payload.brand_score === undefined) payload.brand_score = 0;
      if (!payload.brand_stage) payload.brand_stage = 'Weak Pawa';
      if (!payload.diagnostic_count) payload.diagnostic_count = 0;
      payload.created_at = new Date().toISOString();

      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert(payload);
      if (insertError) throw insertError;
    } else {
      // Existing user — update
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update(payload)
        .eq('id', id);
      if (updateError) throw updateError;
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('sync-profile error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
