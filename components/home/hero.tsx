import Link from "next/link";
import Image from "next/image";

// Swap /samples/hero.svg for a real full-bleed campaign photo later.
export function Hero() {
  return (
    <section className="relative h-[78vh] min-h-[480px] w-full overflow-hidden bg-foreground">
      <Image src="/samples/hero.svg" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-6 pb-12 text-white md:pb-16">
        <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-white/70">The collection</p>
        <h1 className="max-w-xl font-serif text-4xl font-medium leading-[1.05] md:text-6xl">
          Quiet luxury,
          <br />
          crafted by hand.
        </h1>
        <div className="mt-8 flex gap-3">
          <Link
            href="/shop"
            className="bg-white px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-white/85"
          >
            Shop all
          </Link>
          <Link
            href="/shop?new=1"
            className="border border-white px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-white hover:text-foreground"
          >
            New arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
