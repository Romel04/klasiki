export function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <h1 className="mb-8 text-[13px] font-medium uppercase tracking-[0.2em]">{title}</h1>
      <div className="space-y-5 text-sm leading-relaxed text-foreground/80">{children}</div>
    </div>
  );
}

// Placeholder chip. Visible in development so nothing is forgotten, but never
// rendered in production, so customers can't see an unfinished page.
// Search the repo for "<Todo" before launch and fill every one in.
export function Todo({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;
  return <span className="bg-muted px-1.5 py-0.5 text-xs text-foreground">[TODO: {children}]</span>;
}
