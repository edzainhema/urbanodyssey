import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    return res.status(200).json({
      ok: true,
      env: {
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Handler crashed" });
  }
}
