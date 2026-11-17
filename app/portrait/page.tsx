import type { Metadata } from "next";
import GameHUD from "@/components/GameHUD";

export const metadata: Metadata = { title: "Portrait" };

export default function PortraitPage() {
  return (
    <main className="flex min-h-screen items-center px-6 py-16 md:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <GameHUD />
      </div>
    </main>
  );
}
