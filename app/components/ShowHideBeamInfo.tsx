import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShowHideBeamInfo() {
  const [date, setDate] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      // Update the date, used by the beam image to get a fresh image, every 15 seconds so we're not constantly reloading the image on every render.
      setDate(Date.now());
    }, 15000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <div id="beampic" className="flex flex-col items-center justify-center">
      {" "}
      <label>
        <input className="peer/showLabel absolute scale-0" type="checkbox" />
        <span className="block max-h-14 overflow-hidden rounded-lg bg-zinc-600 hover:bg-gray-800 px-4 py-0 mb-2  shadow-lg transition-all duration-300 peer-checked/showLabel:max-h-fit cursor-pointer">
          <h3 className="flex h-14 cursor-pointer items-center font-bold justify-center text-white ">
            Show/hide beam info
          </h3>
          <Image
            src={`https://www.isis.stfc.ac.uk/Gallery/beam-status/ISIS_Status.jpg?t=${date}`}
            alt="beam info"
            height={400}
            width={0}
            className={"w-auto"}
          />
        </span>
      </label>
    </div>
  );
}
