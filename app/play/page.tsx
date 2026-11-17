import type { Metadata } from "next";
import VillageScene from "@/components/VillageScene";

export const metadata: Metadata = { title: "Play · Empathize" };

export default function PlayPage() {
  return (
    <main className="flex min-h-screen flex-col justify-center px-6 py-16 md:px-10">
      <p className="mx-auto mb-8 max-w-2xl text-center font-mono text-[10px] uppercase tracking-[0.28em] text-mist/30">
        Pixels by Purpose · The Quest for Clarity
      </p>
      <VillageScene />
    </main>
  );
}
