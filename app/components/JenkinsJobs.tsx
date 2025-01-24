"use client";

import { useEffect, useState } from "react";
import { IfcWallDisplayJob, IfcWallDisplayResponse } from "@/app/types";

const successColour = "[#90EE90]";
const failureColour = "[#F08080]";
const abortedColour = "gray-400";

const jenkinsColourToWebDashColour = new Map<string, string>([
  ["red", `bg-${failureColour}`], // build broken
  ["blue", `bg-${successColour}`], // build success
  ["aborted", `bg-${abortedColour}`], // build aborted
  [
    "red_anime",
    `bg-[repeating-linear-gradient(45deg,#F08080_0px,#F08080_20px,#99a1af_20px,#99a1af_40px)]`,
  ], // build running but was broken
  [
    "blue_anime",
    "bg-[repeating-linear-gradient(45deg,#90EE90_0px,#90EE90_20px,#99a1af_20px,#99a1af_40px)]",
  ], // build running but was successful
]);

export default function JenkinsJobIframe() {
  const [data, setData] = useState<Array<IfcWallDisplayJob>>([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(
        "https://epics-jenkins.isis.rl.ac.uk/view/WallDisplay/api/json",
      );
      const resData: IfcWallDisplayResponse = await res.json();
      const jobs: Array<IfcWallDisplayJob> = resData["jobs"].filter(
        (job) => job["color"] != "disabled",
      );
      setData(jobs);
    }
    fetchPosts();
  }, []);

  if (data.length === 0) {
    return (
      <div>
        <h1 className={"dark:text-white"}>
          Loading jenkins jobs. If this takes a while, check you are connected
          to the ISIS network.
        </h1>
      </div>
    );
  }

  return (
    <div
      className={
        "grid md:grid-rows-8 md:grid-flow-col  md:grid-cols-3 items-center gap-1.5 grid-cols-1"
      }
    >
      {data.map((job) => (
        <a
          key={job["name"]}
          href={job["url"] + "#:~:text=Builds"} // link to text fragment for "builds"
          className={
            "text-black h-10 font-bold text-xl capitalize rounded-lg text-center border-2 border-black hover:border-white " +
            jenkinsColourToWebDashColour.get(job["color"])
          }
          target={"_blank"}
        >
          {job["name"]}
        </a>
      ))}
    </div>
  );
}
