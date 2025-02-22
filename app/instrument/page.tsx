"use client";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import React, { Suspense } from "react";
import { InstrumentData } from "@/app/components/InstrumentData";
import { useSearchParams } from "next/navigation";

function GetInstrumentData() {
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
        <GetInstrumentData />;
      </Suspense>
    </main>
  );
}
