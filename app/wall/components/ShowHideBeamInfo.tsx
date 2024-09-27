import Image from "next/image";

export default function ShowHideBeamInfo() {
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
            src={`https://www.isis.stfc.ac.uk/Gallery/beam-status/ISIS_Status.jpg?t=${Date.now()}`}
            alt="beam info"
            className="w-auto"
            height={600}
            width={600}
          />
        </span>
      </label>
    </div>
  );
}
