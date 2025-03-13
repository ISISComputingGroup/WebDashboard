import Image from "next/image";

export default function GithubActionsScheduledJobs() {
  return (
      <div className={"flex gap-4 dark:text-white"}>


              <div>
                  <h1>ibex_bluesky_core</h1>
                  <a
                      href={
                          "https://github.com/ISISComputingGroup/ibex_bluesky_core/actions/workflows/lint-and-test-nightly.yml"
                      }
                  >
                      <Image
                          src="https://github.com/ISISComputingGroup/ibex_bluesky_core/actions/workflows/lint-and-test-nightly.yml/badge.svg"
                          alt={"ibex_bluesky_core lint-and-test-nightly badge"} height={240} width={240}
                      />
                  </a>
              </div>

              <div>
                  <h1>inst_servers</h1>
                  <a
                      href={
                          "https://github.com/ISISComputingGroup/EPICS-inst_servers/actions/workflows/lint-and-test-nightly.yml"
                      }
                  >
                      <Image
                          src="https://github.com/ISISComputingGroup/EPICS-inst_servers/actions/workflows/lint-and-test-nightly.yml/badge.svg"
                          alt={"inst_servers lint-and-test-nightly badge"} height={240} width={240}
                      />
                  </a>
              </div>


      </div>
  );
}
