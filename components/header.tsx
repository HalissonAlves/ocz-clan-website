"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/competicoes", label: "Competições" },
  { href: "/exposicao", label: "Exposição" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#080b09]/92 backdrop-blur-xl">
      <div className="page-container flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="OCZ Clan — página inicial"
        >
          <Image
            src="/assets/ocz_brasao.png"
            alt=""
            width={48}
            height={48}
            className="size-12 object-contain"
            priority
          />
          <div>
            <span className="block font-display text-xl font-bold leading-none tracking-[0.12em] text-stone-100">
              OCZ
            </span>
            <span className="mt-1 block text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-amber-400">
              Hunting Clan
            </span>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-9 md:flex"
          aria-label="Navegação principal"
        >
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-xs font-bold uppercase tracking-[0.16em] transition-colors ${active ? "text-amber-400" : "text-stone-400 hover:text-stone-100"}`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute inset-x-0 -bottom-[1.55rem] h-px bg-amber-400 transition-transform ${active ? "scale-x-100" : "scale-x-0"}`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center border border-white/10 text-stone-100 md:hidden"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? (
            <CloseIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-20 h-[calc(100svh-5rem)] border-t border-white/5 bg-[#080b09] md:hidden"
        >
          <nav
            className="page-container flex h-full flex-col justify-center gap-3 pb-20"
            aria-label="Navegação mobile"
          >
            {navigation.map((item, index) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-5 border-b border-white/8 py-6 font-display text-3xl ${active ? "text-amber-400" : "text-stone-200"}`}
                >
                  <span className="font-sans text-[0.6rem] tracking-[0.2em] text-stone-600">
                    0{index + 1}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
