export function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <h1 className="mb-8 text-[13px] font-medium uppercase tracking-[0.2em]">{title}</h1>
      <div className="space-y-5 text-sm leading-relaxed text-foreground/80">{children}</div>
    </div>
  );
}

// Visible on purpose so nothing placeholder ships unnoticed. Search "TODO" before launch.
export function Todo({ children }: { children: React.ReactNode }) {
  return <span className="bg-muted px-1.5 py-0.5 text-xs text-foreground">[TODO: {children}]</span>;
}
