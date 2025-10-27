import GithubActionsScheduledJobs from "@/app/components/GithubActionsScheduledJobs";
import InstrumentsDisplay from "@/app/components/InstrumentsDisplay";
import JenkinsJobs from "../components/JenkinsJobs";

export default function WallDisplay() {
	return (
		<main
			className={`flex min-h-screen bg-white dark:bg-zinc-800 flex-col items-center justify-between`}
		>
			{[...Array(10).keys()].map((key) => (
				<script
					defer
					src="https://cdn.delphitools.info/wp-content/uploads/2013/10/jsbat.js?1.2"
					key={key}
				/>
			))}
			<section className="rounded-xl w-full md:px-0 md:w-11/12 my-2">
				<div className="mx-auto  ">
					<div className="w-full mx-auto text-left flex justify-center items-center pb-8 px-8 dark:bg-zinc-900 rounded-xl">
						<div
							id="status"
							className="flex flex-col justify-center items-center"
						>
							<InstrumentsDisplay />
						</div>
					</div>
					<h1 className="w-full text-left text-black dark:text-white font-semibold text-2xl p-2">
						Jenkins jobs:
					</h1>
					<JenkinsJobs />
					<h1 className="w-full text-left text-black dark:text-white font-semibold text-2xl p-2">
						Github actions scheduled workflows:
					</h1>
					<GithubActionsScheduledJobs />
				</div>
			</section>
		</main>
	);
}
