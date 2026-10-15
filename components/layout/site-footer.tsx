import Link from "next/link";
import Image from "next/image";
import { getFooterCategories } from "@/lib/server/data";
import { categoryPath } from "@/lib/slug";

// Set these in .env / Vercel. The column is hidden until at least one exists.
const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL;
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

const HELP_LINKS = [
  { href: "/track-order", label: "Track order" },
  { href: "/shipping", label: "Shipping & delivery" },
  { href: "/exchange-return", label: "Exchange & returns" },
  { href: "/contact", label: "Contact us" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Klasiki" },
  { href: "/terms", label: "Terms & conditions" },
  { href: "/privacy", label: "Privacy policy" },
];

export async function SiteFooter() {
  const top = await getFooterCategories().catch(() => []);

  return (
    <footer className="bg-foreground text-white">
      <div className="mx-auto max-w-[1600px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Image
              src="/logo-white.png"
              alt="Klasiki"
              width={1410}
              height={385}
              className="h-12 w-auto"
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
              Handcrafted leather bags. Quiet luxury, made with care.
            </p>
          </div>

          <FooterColumn title="Shop" className="md:col-span-2">
            {top.map((c) => (
              <FooterLink key={c.id} href={categoryPath(c)}>
                {c.name}
              </FooterLink>
            ))}
            <FooterLink href="/shop">All products</FooterLink>
          </FooterColumn>

          <FooterColumn title="Help" className="md:col-span-2">
            {HELP_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Company" className="md:col-span-2">
            {COMPANY_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {(FACEBOOK_URL || INSTAGRAM_URL) && (
            <FooterColumn title="Follow" className="md:col-span-2">
              {FACEBOOK_URL && <FooterLink href={FACEBOOK_URL}>Facebook</FooterLink>}
              {INSTAGRAM_URL && <FooterLink href={INSTAGRAM_URL}>Instagram</FooterLink>}
            </FooterColumn>
          )}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © <Year /> Klasiki. All rights reserved.
          </p>
          <p className="uppercase tracking-[0.18em]">
            Cash on delivery · Confirmation via bKash
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <h4 className="mb-5 text-[11px] uppercase tracking-[0.18em] text-white/50">
        {title}
      </h4>
      <ul className="space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/80 hover:text-white hover:underline underline-offset-4"
      >
        {children}
      </Link>
    </li>
  );
}

// new Date() must be cached/deferred under Cache Components.
async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
