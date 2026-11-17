import { meta } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="border-t border-mist/10 px-6 py-8 md:px-14">
      <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/35 md:flex-row md:justify-between">
        <span>
          © {new Date().getFullYear()} {meta.name}
        </span>
        <span>
          {meta.title} · {meta.location}
        </span>
      </div>
    </footer>
  );
}
