import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { name, price, description, sizes, images } = req.body;

    if (!name || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const { data, error } = await supabase.from("items").insert({
      name,
      price: typeof price === "number" ? price : null,
      description: description || null,
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : null,
      images,
    });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, item: data });
  } catch (err) {
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
