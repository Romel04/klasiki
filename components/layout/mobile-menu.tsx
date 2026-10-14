"use client";

import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { CategoryNode } from "@/types/category";

export function MobileMenu({
  open,
  onClose,
  tree,
}: {
  open: boolean;
  onClose: () => void;
  tree: CategoryNode[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="text-[11px] uppercase tracking-[0.18em]">Menu</span>
          <button aria-label="Close menu" onClick={onClose} className="p-1.5">
            <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.5} />
          </button>
        </div>

        <ul className="divide-y divide-border">
          <li>
            <Link href="/shop" onClick={onClose} className="block px-4 py-4 text-sm uppercase tracking-[0.14em]">
              Shop all
            </Link>
          </li>
          {tree.map(({ category, children }) => (
            <li key={category.id}>
              <div className="flex items-center justify-between px-4 py-4">
                <Link
                  href={`/c/${category.id}`}
                  onClick={onClose}
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  {category.name}
                </Link>
                {children.length > 0 && (
                  <button
                    aria-label={`Toggle ${category.name}`}
                    onClick={() => setExpanded(expanded === category.id ? null : category.id)}
                    className="px-2 text-lg leading-none"
                  >
                    {expanded === category.id ? "−" : "+"}
                  </button>
                )}
              </div>
              {expanded === category.id && (
                <ul className="bg-muted px-4 py-2">
                  {children.map((c) => (
                    <li key={c.id}>
                      <Link href={`/c/${c.id}`} onClick={onClose} className="block py-2.5 text-sm text-foreground/80">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <Link href="/track-order" onClick={onClose} className="block px-4 py-4 text-sm uppercase tracking-[0.14em]">
              Track order
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}
