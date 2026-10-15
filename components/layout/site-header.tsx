"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  ShoppingBag01Icon,
  Menu01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { useCategories } from "@/lib/hooks/use-categories";
import { useCartCount } from "@/lib/cart/cart-store";
import { buildTree } from "@/lib/categories";
import { categoryPath } from "@/lib/slug";
import type { Category } from "@/types/category";
import { CartDrawer } from "./cart-drawer";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader({ initialCategories }: { initialCategories?: Category[] }) {
  const router = useRouter();
  const { data: categories = [] } = useCategories(initialCategories);
  const count = useCartCount();
  const tree = useMemo(() => buildTree(categories), [categories]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setActiveId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveId(null);
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const activeNode = tree.find((n) => n.category.id === activeId);
  const hasPanel = !!activeNode && activeNode.children.length > 0;

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40 bg-background">
        {/* Utility bar */}
        <div className="hidden md:block bg-foreground text-white">
          <div className="mx-auto flex h-8 max-w-[1600px] items-center justify-between px-6 text-[11px] uppercase tracking-[0.18em]">
            <span>Cash on delivery across Bangladesh</span>
            <div className="flex items-center gap-6">
              <Link href="/track-order" className="hover:underline underline-offset-4">
                Track order
              </Link>
              <Link href="/contact" className="hover:underline underline-offset-4">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Logo row */}
        <div className="border-b border-border">
          <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-3 items-center px-4 md:px-6">
            <div className="flex items-center">
              <button
                aria-label="Open menu"
                className="md:hidden p-1.5 -ml-1.5"
                onClick={() => setMenuOpen(true)}
              >
                <HugeiconsIcon icon={Menu01Icon} size={22} strokeWidth={1.5} />
              </button>
            </div>

            <Link href="/" className="justify-self-center" aria-label="Klasiki home">
              <Image
                src="/logo-black.png"
                alt="Klasiki"
                width={1410}
                height={385}
                priority
                className="h-8 md:h-10 w-auto"
              />
            </Link>

            <div className="flex items-center justify-end gap-4">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
                className="p-1.5"
              >
                <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.5} />
              </button>
              <button
                aria-label="Open cart"
                onClick={() => setCartOpen(true)}
                className="relative p-1.5"
              >
                <HugeiconsIcon icon={ShoppingBag01Icon} size={20} strokeWidth={1.5} />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center bg-foreground px-1 text-[10px] font-medium text-background">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category nav (desktop) — submenus open on click via the arrow */}
        <nav className="hidden md:block border-b border-border">
          <ul className="mx-auto flex h-11 max-w-[1600px] items-center justify-center gap-10 px-6">
            <li>
              <Link
                href="/shop"
                onClick={() => setActiveId(null)}
                className="text-[12px] font-medium uppercase tracking-[0.16em] hover:underline underline-offset-8"
              >
                All
              </Link>
            </li>
            {tree.map(({ category, children }) => {
              const hasChildren = children.length > 0;
              const isOpen = activeId === category.id;
              return (
                <li key={category.id} className="flex items-center gap-0.5">
                  <Link
                    href={categoryPath(category)}
                    onClick={() => setActiveId(null)}
                    className="text-[12px] font-medium uppercase tracking-[0.16em] hover:underline underline-offset-8"
                  >
                    {category.name}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      aria-label={`Show ${category.name} subcategories`}
                      aria-expanded={isOpen}
                      onClick={() => setActiveId(isOpen ? null : category.id)}
                      className="p-1"
                    >
                      <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        size={14}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mega menu panel */}
        {hasPanel && activeNode && (
          <div className="absolute left-0 right-0 top-full hidden md:block border-b border-border bg-background">
            <div className="mx-auto grid max-w-[1600px] grid-cols-4 gap-10 px-6 py-8">
              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {activeNode.category.name}
                </p>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link
                      href={categoryPath(activeNode.category)}
                      onClick={() => setActiveId(null)}
                      className="font-medium hover:underline underline-offset-4"
                    >
                      Shop all {activeNode.category.name}
                    </Link>
                  </li>
                  {activeNode.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={categoryPath(child)}
                        onClick={() => setActiveId(null)}
                        className="text-foreground/80 hover:text-foreground hover:underline underline-offset-4"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Search drop-down */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-border bg-background">
            <form onSubmit={submitSearch} className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5">
              <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.5} className="text-muted-foreground" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bags"
                className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" className="text-[11px] uppercase tracking-[0.18em] hover:underline underline-offset-4">
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} tree={tree} />
    </>
  );
}
