import { NextRequest } from "next/server";
import { redis } from "@/lib/redis";
import { randomUUID } from "crypto";
import { err, ok } from "@/lib/utils";

// Body: { resourceId: string, start: string, end: string, ttlSec?: number }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { resourceId, start, end, ttlSec = 120 } = body || {};

  if (!resourceId || !start || !end) return err("Missing fields: resourceId,start,end");
  const key = `hold:${resourceId}:${start}`; // start ISO sec precision

  const token = randomUUID();
  // NX = only set if not exists. EX = seconds TTL.
  const res = await redis.set(key, token, { nx: true, ex: ttlSec });
  if (!res) return err("Slot already held. Try again.", 409);

  return ok({ token, key, expiresIn: ttlSec });
}
