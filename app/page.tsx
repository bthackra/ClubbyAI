export default function Home() {
  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">ClubMate Starter</h1>
      <p className="opacity-80">Prototype your club management app here.</p>
      <ul className="list-disc pl-6 text-sm">
        <li>API: <code>/api/reservations/hold</code>, <code>/api/reservations/book</code></li>
        <li>API: <code>/api/ask-ops</code>, <code>/api/stripe/webhook</code></li>
        <li>DB schema: <code>supabase/schema.sql</code></li>
      </ul>
    </main>
  );
}
