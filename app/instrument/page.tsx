"use client";
import { Inter } from "next/font/google";
import InstrumentData from "@/app/components/InstrumentData";
const inter = Inter({ subsets: ["latin"] });
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function InstrumentPage() {
  const searchParams = useSearchParams();
  const instrument = searchParams.get("name")!;

  return <InstrumentData instrumentName={instrument} />;
}

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
