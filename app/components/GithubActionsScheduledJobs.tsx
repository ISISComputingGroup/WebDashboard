import Image from "next/image";

function GithubActionsJob({
  repo,
  workflowName,
}: {
  repo: string;
  workflowName: string;
}) {
  return (
    <div className={"w-full"}>
      <a
        href={`https://github.com/ISISComputingGroup/${repo}/actions/workflows/${workflowName}`}
        className={
          "flex flex-row h-10 w-full rounded-lg bg-gray-800 border-2 border-black hover:border-white"
        }
        target={"_blank"}
      >
        <h2 className={"text-lg text-center w-2/5 mx-5"}>{repo}</h2>
        <div className={"float-right w-3/5"}>
          <Image
            src={`https://github.com/ISISComputingGroup/${repo}/actions/workflows/${workflowName}/badge.svg`}
            alt={"build status badge"}
            className={"h-8 w-auto my-0.5 float-right"}
            width={500}
            height={500}
          />
        </div>
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
      <GithubActionsJob
        repo={"IBEX-device-generator"}
        workflowName={"lint-and-test-nightly.yml"}
      />
      <GithubActionsJob
        repo={"WebDashboard"}
        workflowName={"lint-and-test-nightly.yml"}
      />
      <GithubActionsJob
        repo={"isis_css_top"}
        workflowName={"build-nightly.yml"}
      />
      <GithubActionsJob
        repo={"IBEX"}
        workflowName={"project_board_checks.yml"}
      />
      <GithubActionsJob
        repo={"EPICS-refl"}
        workflowName={"lint-and-test-nightly.yml"}
      />
      <GithubActionsJob
        repo={"ibex_developers_manual"}
        workflowName={"nightly.yml"}
      />
      <GithubActionsJob
        repo={"ibex_user_manual"}
        workflowName={"nightly.yml"}
      />
      <GithubActionsJob
          repo={"saluki"}
          workflowName={"lint-and-test-nightly.yml"}
      />
    </div>
  );
}
