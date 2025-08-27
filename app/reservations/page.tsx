'use client';
import { useState } from "react";

export default function Reservations() {
  const [resourceId, setResourceId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [log, setLog] = useState<string>("");

  const hold = async () => {
    const res = await fetch("/api/reservations/hold", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ resourceId, start, end }),
    });
    const data = await res.json();
    setLog(JSON.stringify(data, null, 2));
    if (data.ok) setToken(data.data.token);
  };

  const book = async () => {
    const res = await fetch("/api/reservations/book", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ resourceId, memberId, start, end, token }),
    });
    const data = await res.json();
    setLog(JSON.stringify(data, null, 2));
  };

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Reservations Demo</h1>
      <div className="grid gap-2">
        <input className="border p-2" placeholder="resourceId" value={resourceId} onChange={e=>setResourceId(e.target.value)} />
        <input className="border p-2" placeholder="memberId" value={memberId} onChange={e=>setMemberId(e.target.value)} />
        <input className="border p-2" placeholder="start (ISO)" value={start} onChange={e=>setStart(e.target.value)} />
        <input className="border p-2" placeholder="end (ISO)" value={end} onChange={e=>setEnd(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button className="border px-3 py-1" onClick={hold}>Hold</button>
        <button className="border px-3 py-1" onClick={book} disabled={!token}>Book</button>
      </div>
      <pre className="text-xs bg-black/5 p-3 rounded">{log}</pre>
    </main>
  );
}
