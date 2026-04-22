"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore, startTickLoop, stopTickLoop } from "@/store/gameStore";
import { TopBar } from "./TopBar";

export function GameShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const state = useGameStore((s) => s.state);
  const isInitialized = useGameStore((s) => s.isInitialized);
  const load = useGameStore((s) => s.load);

  // On first mount, try to load an existing save. If none, kick to main menu.
  useEffect(() => {
    if (!isInitialized) {
      const loaded = load();
      if (!loaded) {
        router.replace("/");
      }
    }
  }, [isInitialized, load, router]);

  // Start the tick loop
  useEffect(() => {
    startTickLoop();
    return () => stopTickLoop();
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-sticker">LOADING</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar activePath={pathname ?? ""} />
      <main className="max-w-[1400px] mx-auto p-4">{children}</main>
    </div>
  );
}
