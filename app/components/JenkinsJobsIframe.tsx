"use client";

import { useEffect, useState } from "react";
import { IfcWallDisplayJob, IfcWallDisplayResponse } from "@/app/types";
const jenkinsColourToWebDashColour = new Map<string, string>([
  ["red", "bg-red-800"],
  ["blue", "bg-green-800"],
  ["aborted", "bg-gray-400"],
  ["red_anime", "bg-red-400"],
  ["blue_anime", "bg-green-400"],
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
    <div className=" grid grid-cols-3 justify-center items-center gap-1">
      {data.map((job) => (
        <a
          key={job["name"]}
          href={job["url"]}
          className={
            "text-white capitalize rounded-lg text-center " +
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
