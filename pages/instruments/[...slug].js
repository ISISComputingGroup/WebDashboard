import { Inter } from "next/font/google";
import InstrumentData from "@/components/InstrumentData";
const inter = Inter({ subsets: ["latin"] });

export default function Instrument() {
  return (
    <main
      className={`flex min-h-screen bg-white flex-col items-center justify-start  ${inter.className}`}
    >
      <InstrumentData />
    </main>
  );
}
