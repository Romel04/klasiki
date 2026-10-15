import { Suspense } from "react";
import { connection } from "next/server";

// generateMetadata reads `params` (request-time data). Under Cache Components,
// Next.js wants that to be an explicit choice when the rest of the page is
// prerenderable. This renders nothing; it just marks the page as intentionally
// dynamic so the static shell still prerenders. Place it once in the page.
async function Connection() {
  await connection();
  return null;
}

export function DynamicMarker() {
  return (
    <Suspense>
      <Connection />
    </Suspense>
  );
}
