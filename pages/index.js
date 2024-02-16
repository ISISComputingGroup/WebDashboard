import Image from "next/image";
import { Inter } from "next/font/google";
import Group from "@/components/Group";
import TopBar from "@/components/TopBar";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });



export default function Home() {
  

  return (
    <main
      className={`flex min-h-screen bg-white flex-col items-center justify-between p-24 ${inter.className}`}
    >
    
    </main >
  );
}
