"use client";

// SiteFrame — wraps pages in the global chrome (nav, footer, and the
// home's drafting grid carried through: hairline rails with two star
// markers on the night canvas). Routes listed in BARE render with none
// of it.

import { usePathname } from "next/navigation";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import DiyaGlow from "./DiyaGlow";

// "/" is bare: the home carries its own cinema chrome.
const BARE = ["/", "/portrait", "/play"];

function DraftingGrid() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-y-0 left-6 w-px bg-mist/[0.07] md:left-14" />
      <div className="absolute inset-y-0 right-6 w-px bg-mist/[0.07] md:right-14" />
      <div className="absolute inset-x-0 top-[13svh] h-px bg-mist/[0.06]" />
      <div className="absolute inset-x-0 bottom-[13svh] h-px bg-mist/[0.06]" />
      <span className="absolute left-6 top-[13svh] -translate-x-1/2 -translate-y-1/2 text-[10px] text-mist/60 md:left-14">
        &#10022;
      </span>
      <span className="absolute bottom-[13svh] right-6 -translate-y-1/2 translate-x-1/2 text-[10px] text-mist/60 md:right-14">
        &#10022;
      </span>
    </div>
  );
}

export default function SiteFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (BARE.includes(pathname)) return <>{children}</>;

  // Work (index and case studies) stays crisp: no lamp atmosphere.
  const showDiyas = !pathname.startsWith("/work");

  return (
    <>
      {showDiyas && <DiyaGlow />}
      <DraftingGrid />
      <div className="relative z-10">
        <SiteNav />
        {children}
        <SiteFooter />
      </div>
    </>
  );
}
