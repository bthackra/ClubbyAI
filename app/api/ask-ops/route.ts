import { NextRequest } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import OpenAI from "openai";

const Body = z.object({ prompt: z.string().min(1) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parse = Body.safeParse(body);
  if (!parse.success) return new Response(JSON.stringify({ ok:false, error: "Invalid body"}), { status: 400 });

  const prompt = parse.data.prompt.toLowerCase();
  const sb = supabaseAdmin();

  if (prompt.includes("overdue")) {
    const { data } = await sb.rpc("list_overdue_members").throwOnError();
    // If you haven't created the RPC yet, return placeholder:
    return Response.json({ ok: true, data: data ?? [{ member: "Demo Member", days_overdue: 37, amount_cents: 12345 }], note: "Demo data unless RPC created." });
  }

  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const msg = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an operations assistant for a private club."},
        { role: "user", content: prompt }
      ]
    });
    return Response.json({ ok: true, data: msg.choices[0].message.content });
  }

  return Response.json({ ok: true, data: "Ask-Ops is ready. Try: 'List members overdue >30d and draft a reminder email'." });
}
