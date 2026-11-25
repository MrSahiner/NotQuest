"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "harita" },
  { href: "/yukle", label: "not yükle" },
];

export default function BottomNav() {
  const path = usePathname();
  if (path.startsWith("/oyun")) return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t-[3px] border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {items.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex-1 py-4 text-center font-mono text-sm ${active ? "text-hl" : "text-dim"}`}
            >
              {active ? "▸ " : ""}
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
