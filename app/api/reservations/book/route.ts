import { NextRequest } from "next/server";
import { redis } from "@/lib/redis";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { err, ok } from "@/lib/utils";

// Body: { resourceId, memberId, start, end, token }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { resourceId, memberId, start, end, token } = body || {};
  if (!resourceId || !memberId || !start || !end || !token) return err("Missing fields");

  const key = `hold:${resourceId}:${start}`;
  const heldToken = await redis.get<string>(key);
  if (!heldToken) return err("Hold expired or missing.", 410);
  if (heldToken !== token) return err("Hold token mismatch.", 403);

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      resource_id: resourceId,
      member_id: memberId,
      start_ts: start,
      end_ts: end,
      status: "BOOKED"
    })
    .select()
    .single();

  if (error) {
    // Unique index violation → double-book attempt
    return err(`Could not book: ${error.message}`, 409);
  }

  // Clear the hold after booking
  await redis.del(key);
  return ok({ reservation: data });
}
