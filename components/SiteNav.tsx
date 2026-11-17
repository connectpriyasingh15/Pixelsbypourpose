import Link from "next/link";
import { meta, nav } from "@/lib/content";

export default function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-night/60 backdrop-blur-md">
      <nav className="flex items-center justify-between px-6 py-5 md:px-14">
        <Link
          href="/"
          className="font-sans text-[16px] font-semibold tracking-tight text-mist/90 transition-colors hover:text-mist"
        >
          Priya Singh<span className="text-mist/50">.</span>
        </Link>
        <div className="flex items-center gap-6 md:gap-8">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="font-sans text-[15px] text-mist/85 transition-colors hover:text-mist"
            >
              {n.label}
            </Link>
          ))}
          <a
            href={meta.resume}
            className="hidden font-sans text-[15px] text-mist/85 transition-colors hover:text-mist sm:block"
          >
            Résumé
          </a>
        </div>
      </nav>
    </header>
  );
}
