const ITEMS = [
  { title: "Cash on delivery", text: "Pay when it arrives" },
  { title: "Delivery nationwide", text: "Across Bangladesh" },
  { title: "Order tracking", text: "By order number and phone" },
  { title: "Handcrafted", text: "Finished with care" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border">
      <ul className="mx-auto grid max-w-[1600px] grid-cols-2 gap-y-8 px-6 py-10 md:grid-cols-4">
        {ITEMS.map((i) => (
          <li key={i.title} className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em]">{i.title}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{i.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
