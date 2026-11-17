// Home: a chaptered art film, in the manner of pear.no. Act one is
// the garden loop inside a sticky frame: scroll advances a quiet
// serif script (bird = user, flower = experience, inside = the work)
// while the film dives deeper and leans with the cursor. The acts
// after it drop the metaphor and speak in evidence: the pitch, the
// proof, the invitation.
//
// Earlier homes remain on disk: Story.tsx + GardenFilm.tsx (the
// zoom-through cinema), Starfield.tsx (the galaxy), SectionA..M.

import Link from "next/link";
import FilmAct from "@/components/sections/FilmAct";
import EditorialActs from "@/components/sections/EditorialActs";
import AmbientScore from "@/components/sections/AmbientScore";

// The home is a bare route (no global chrome), so it carries its own
// minimal nav: quiet mono links floating over the film.
function CinemaNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-14">
      <Link
        href="/"
        className="font-sans text-[16px] font-semibold tracking-tight text-white/90 transition-colors hover:text-white"
      >
        Priya Singh<span className="text-white/50">.</span>
      </Link>
      <nav className="flex items-center gap-6 font-sans text-[15px] md:gap-8">
        <Link href="/about" className="text-white/85 transition-colors hover:text-white">
          About
        </Link>
        <Link href="/work" className="text-white/85 transition-colors hover:text-white">
          Work
        </Link>
        <Link href="/contact" className="text-white/85 transition-colors hover:text-white">
          Contact
        </Link>
        <a
          href="/Priya_Singh_Resume.pdf"
          className="hidden text-white/85 transition-colors hover:text-white md:inline-block"
        >
          R&eacute;sum&eacute;
        </a>
      </nav>
    </header>
  );
}

export default function Home() {
  return (
    <main className="relative bg-[#030303]">
      <CinemaNav />
      <FilmAct />
      <EditorialActs />
      <AmbientScore />
    </main>
  );
}
