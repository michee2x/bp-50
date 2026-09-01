import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

type ContactRequestBody = {
  name?: string;
  email?: string;
  company?: string;
  budget?: string;
  message?: string;
};

type ContactApiResponse =
  | { success: true; message: string }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, company, budget, message } = (req.body ?? {}) as ContactRequestBody;

  if (!name?.trim() || !email?.trim() || !budget?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, budget, and message are required.',
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({
      success: false,
      error: 'Supabase server configuration is missing.',
    });
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim(),
        company: company?.trim() || null,
        budget: budget.trim(),
        message: message.trim(),
        status: 'new',
      });

    if (error) {
      console.error('Supabase contact insert error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to save contact submission.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact submission saved.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unexpected server error.',
    });
  }
}
