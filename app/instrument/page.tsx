import { Inter } from "next/font/google";
import InstrumentPage from "@/app/components/InstrumentPage";
const inter = Inter({ subsets: ["latin"] });
import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";

export default function Instrument() {
  return (
    <main
      className={`flex min-h-screen bg-white flex-col items-center justify-start  ${inter.className}`}
    >
      <Suspense>
        <InstrumentPage />
      </Suspense>
    </main>
  );
}
