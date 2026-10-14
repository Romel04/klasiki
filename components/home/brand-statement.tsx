import Image from "next/image";

export function BrandStatement() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="relative aspect-[4/5] bg-muted md:max-w-xl">
          <Image src="/samples/bag-4.svg" alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        </div>
        <div className="max-w-md">
          <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">About Klasiki</p>
          <p className="text-xl font-light leading-relaxed md:text-2xl">
            Every Klasiki piece is made to be carried for years — simple lines, honest materials,
            and craft you can feel in the details.
          </p>
        </div>
      </div>
    </section>
  );
}
