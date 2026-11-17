import BeamStatusDisplay from "@/app/components/BeamStatusDisplay";

export default function BeamStatus() {
  return (
    <main
      className={`flex min-h-screen bg-white dark:bg-zinc-800 flex-col items-center justify-between`}
    >
      <section className="rounded-xl w-full md:px-0 md:w-11/12 my-2">
        <div className="mx-auto">
          <h1 className="w-full text-left text-black dark:text-white font-semibold text-2xl p-2">
            ISIS Beam Status
          </h1>
          <div className="w-full mx-auto text-left flex justify-center items-center pb-8 px-2">
            <BeamStatusDisplay />
          </div>
        </div>
      </section>
    </main>
  );
}
