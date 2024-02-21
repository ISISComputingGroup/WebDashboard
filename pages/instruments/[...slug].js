import Image from "next/image";
import { Inter } from "next/font/google";
import TopBar from "@/components/TopBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Groups from "@/components/Groups";

const inter = Inter({ subsets: ["latin"] });

async function getInstrument(name) {
  let instrumentData = await fetch("/api/instruments/" + name);
  return instrumentData;
}

export default function Instrument() {
  const [data, setData] = useState(null);
  const [configName, setConfigName] = useState(null);
  const [instPvs, setInstPvs] = useState(null);
  const [groups, setGroups] = useState({});

  const router = useRouter();
  const slug = router.query.slug;

  useEffect(() => {
    if (router.query.slug) {
      // console.log(router.query.slug);
      getInstrument(router.query.slug)
        .then((response) => response.json())
        .then((resData) => {
          setData(resData);
          setConfigName(resData["config_name"]);
          setInstPvs(resData["inst_pvs"]);
          setGroups(resData["groups"]);
        });
    }
  }, [router.query.slug]);

  if (!slug || !data) {
    return <div>Loading...</div>;
  }

  return (
    <main
      className={`flex min-h-screen bg-white flex-col items-center justify-start  ${inter.className}`}
    >
      <div className="p-8 w-full mx-auto max-w-7xl">
        <div className="text-left mb-4">
          <h1 className="text-black text-2xl">
            Instrument:{" "}
            <span className="font-semibold">{slug[0].toUpperCase()}</span>
          </h1>
          <h1 className="text-black text-lg">
            Config: <span className="font-semibold">{configName}</span>
          </h1>
        </div>

        <TopBar instPvs={instPvs} slug={slug} />
        <Groups groups={groups} />
      </div>
    </main>
  );
}
