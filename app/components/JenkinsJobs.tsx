"use client";

import { useEffect, useState } from "react";
import { IfcWallDisplayJob, IfcWallDisplayResponse } from "@/app/types";

const jenkinsColourToWebDashColour = new Map<string, string>([
  // these map to https://github.com/jenkinsci/jenkins/blob/master/core/src/main/java/hudson/model/BallColor.java#L57
  ["red", `bg-[#F08080]`], // build broken
  ["blue", `bg-[#90EE90]`], // build success
  ["aborted", `bg-[#99a1af]`], // build aborted

  ["yellow", `bg-[#dddd00]`],
  [
    "yellow_anime",
    "bg-[repeating-linear-gradient(45deg,#dddd00_0px,#dddd00_20px,#eeee00_20px,#eeee00_40px)]",
  ], // build running but was broken
  [
    "red_anime",
    "bg-[repeating-linear-gradient(45deg,#F08080_0px,#F08080_20px,#F09090_20px,#F09090_40px)]",
  ], // build running but was broken
  [
    "blue_anime",
    "bg-[repeating-linear-gradient(45deg,#90EE90_0px,#90EE90_20px,#90DD90_20px,#90DD90_40px)]",
  ], // build running but was successful
  [
    "aborted_anime",
    "bg-[repeating-linear-gradient(45deg,#99A1AF_0px,#99A1AF_20px,#7F7F7F_20px,#7F7F7F_40px)]",
  ], // build aborted but now running
]);

export default function JenkinsJobs() {
  const [data, setData] = useState<Array<IfcWallDisplayJob>>([]);

  useEffect(() => {
    // initially request from jenkins, then set interval to do so every minute thereafter.
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

    const interval = setInterval(() => {
      fetchPosts();
    }, 60000);
    return () => clearInterval(interval);
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
          href={job["url"] + "lastCompletedBuild"} // link to text fragment for "builds"
          className={
            "text-black h-10 font-bold text-xl capitalize rounded-lg text-center border-2 border-black hover:border-white " +
            jenkinsColourToWebDashColour.get(job["color"]) +
            ` wd-state-${job["color"]}`
          }
          target={"_blank"}
        >
          {job["name"]}
        </a>
      ))}
    </div>
  );
}
