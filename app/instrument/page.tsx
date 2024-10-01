'use client'
import { Inter } from "next/font/google";
import InstrumentData from "@/app/components/InstrumentData";
const inter = Inter({ subsets: ["latin"] });
import { useSearchParams } from 'next/navigation'


export default function Instrument() {
    const searchParams = useSearchParams()
    const instrument = searchParams.get("name")!;
  return (
    <main
      className={`flex min-h-screen bg-white flex-col items-center justify-start  ${inter.className}`}
    >
      <InstrumentData instrumentName={instrument} />
    </main>
  );
}
