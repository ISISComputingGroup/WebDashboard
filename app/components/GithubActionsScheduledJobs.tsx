import Image from "next/image";

function GithubActionsJob({
  repo,
  workflowName,
}: {
  repo: string;
  workflowName: string;
}) {
  return (
    <div>
      <a
        href={`https://github.com/ISISComputingGroup/${repo}/actions/workflows/${workflowName}`}
        className={
          "flex-row flex items-center content-center h-10 w-full text-center rounded-lg bg-gray-800 border-2 border-black hover:border-white"
        }
      >
        <h2 className={"text-center text-lg w-1/2"}>{repo}: </h2>
        <Image
          src={`https://github.com/ISISComputingGroup/${repo}/actions/workflows/${workflowName}/badge.svg`}
          alt={"ibex_bluesky_core lint-and-test-nightly badge"}
          className={"w-1/2 pr-2"}
          width={500}
          height={500}
        />
      </a>
    </div>
  );
}

export default function GithubActionsScheduledJobs() {
  return (
    <div
      className={
        "grid md:grid-cols-3 items-center gap-1.5 grid-cols-1 dark:text-white"
      }
    >
      <GithubActionsJob
        repo={"ibex_bluesky_core"}
        workflowName={"lint-and-test-nightly.yml"}
      />
      <GithubActionsJob
        repo={"EPICS-inst_servers"}
        workflowName={"lint-and-test-nightly.yml"}
      />
      <GithubActionsJob
        repo={"lewis"}
        workflowName={"lint-and-test-nightly.yml"}
      />
      <GithubActionsJob
        repo={"genie"}
        workflowName={"lint-and-test-nightly.yml"}
      />
      <GithubActionsJob
        repo={"ExperimentDatabasePopulator"}
        workflowName={"lint-and-test-nightly.yml"}
      />
      <GithubActionsJob
        repo={"ibex_utils"}
        workflowName={"lint-and-test-nightly.yml"}
      />
    </div>
  );
}
