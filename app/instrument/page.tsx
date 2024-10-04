import { Inter } from "next/font/google";
import InstrumentPage from "@/app/components/InstrumentData";
const inter = Inter({ subsets: ["latin"] });
import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const instrument = searchParams!["name"];
  
  return {
    title: instrument + ' | IBEX Web Dashboard',
  }
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
