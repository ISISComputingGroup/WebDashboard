import { Inter } from "next/font/google";
import InstrumentData from "@/app/components/InstrumentData";
const inter = Inter({ subsets: ["latin"] });

export default function Instrument({ params }: { params: { slug: string } }) {
  return (
    <main
      className={`flex min-h-screen bg-white flex-col items-center justify-start  ${inter.className}`}
    >
      <InstrumentData instrumentName={params.slug} />
    </main>
  );
}
