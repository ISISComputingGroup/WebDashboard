import Image from "next/image";
import { Inter } from "next/font/google";
import Group from "@/components/Group";
import TopBar from "@/components/TopBar";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

async function getInstrument(name) {
  let instrumentData = await fetch("/api/instrument/" + name);
  return instrumentData;
}

export default function instrument() {
  getInstrument("inter").then((data) => {
    console.log(data.json);
  });

  let data = getInstrument("inter");

  const router = useRouter();
  const slug = router.query.slug;
  console.log(slug);


  return (
    <main
      className={`flex min-h-screen bg-white flex-col items-center justify-between p-24 ${inter.className}`}
    >
     <TopBar data={data} slug={slug}/>


              <div className="flex flex-col w-full">
                <h1>Blocks:</h1>
                <div class="bg-white border-2 rounded-xl p-4 grid grid-cols-3 gap-4">
                <Group id="test1"/>
                <Group id="test2"/>
                <Group id="test3"/>

               
                </div>
              </div>
    </main >
  );
}
