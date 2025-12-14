import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, price, description, sizes, images } = req.body;

  if (!name || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const { error, data } = await supabase.from("items").insert({
    name,
    price: typeof price === "number" ? price : null,
    description: description || null,
    sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : null,
    images,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, item: data });
}
