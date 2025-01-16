export default function JenkinsJobIframe() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="w-full text-left text-black dark:text-white font-semibold text-2xl   ">
        Jenkins Jobs:
      </h1>{" "}
      <p className="text-md text-left w-full text-black dark:text-white">
        Tip: Open the jobs by clicking on the individual job, then clicking the job name into a{" "}
        <span className="font-bold underline">new tab</span> only. If you cannot
        see this, you probably aren&apos;t connected to the ISIS network.
      </p>
      <iframe
        className="w-full h-[300px] mt-4 border-2 border-gray-100 dark:border-black rounded-lg shadow-sm hover:shadow-lg hover:border-black dark:hover:border-white transition-all duration-200"
        src="https://epics-jenkins.isis.rl.ac.uk/plugin/jenkinswalldisplay/walldisplay.html?viewName=WallDisplay&amp;jenkinsUrl=https%3A%2F%2Fepics-jenkins.isis.rl.ac.uk%2F"
      ></iframe>
    </div>
  );
}
