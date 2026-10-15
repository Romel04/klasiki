import Link from "next/link";
import Image from "next/image";

// The "craft" band: where Klasiki's story lives on the homepage
// (ILYN uses an "Our Brands" section for the same job).
export function BrandStatement() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-6 py-20 md:grid-cols-2 md:gap-20 md:py-28">
        <div className="relative aspect-[4/5] bg-muted md:max-w-xl">
          <Image src="/samples/bag-4.svg" alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        </div>
        <div className="max-w-md">
          <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Made with care</p>
          <p className="font-serif text-3xl font-medium leading-snug md:text-4xl">
            Made to be carried for years.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-foreground/80">
            Simple lines, honest materials, and craft you can feel in the details. Every Klasiki piece is
            finished by hand.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block border border-foreground px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-foreground hover:text-background"
          >
            Our story
          </Link>
        </div>
      </div>
    </section>
  );
}
