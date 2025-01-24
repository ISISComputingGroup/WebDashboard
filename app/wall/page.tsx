import ShowHideBeamInfo from "../components/ShowHideBeamInfo";
import JenkinsJobs from "../components/JenkinsJobs";
import InstrumentsDisplay from "@/app/components/InstrumentsDisplay";

export default function WallDisplay() {
  return (
    <main
      className={`flex min-h-screen bg-white dark:bg-zinc-800 flex-col items-center justify-between`}
    >
      <section className=" rounded-xl w-full md:px-0 md:w-11/12 my-4 ">
        <div className="mx-auto  ">
          <ShowHideBeamInfo />
          <div className="w-full mx-auto text-left flex justify-center items-center p-8 dark:bg-zinc-900 rounded-xl">
            <div
              id="status"
              className="flex flex-col justify-center items-center"
            >
              <h1 className="w-full text-left text-black dark:text-white font-semibold text-2xl   ">
                Instrument Status:
              </h1>
              <InstrumentsDisplay />
            </div>
          </div>
          <hr className="h-[2px] rounded my-4 bg-gray-200 border-0 dark:bg-gray-600" />
          <h1 className="w-full text-left text-black dark:text-white font-semibold text-2xl pb-2 ">
            Jenkins jobs:
          </h1>
          <JenkinsJobs />
        </div>
      </section>
    </main>
  );
}
