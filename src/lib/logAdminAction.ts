import { supabase } from "./supabaseClient";

export async function logAdminAction(
  action: string,
  description?: string
) {
  const { error } = await supabase
    .from("admin_actions")
    .insert({
      action,
      description,
    });

  if (error) {
    console.error("Failed to log admin action:", error);
  }
}
