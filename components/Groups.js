import Group from "./Group";
import { useEffect, useState } from "react";

export default function Groups({ socket }) {
  if (!socket) {
    return <h1>Loading...</h1>;
  }

  // const [socket, setSocket] = useState(null);
  const [groups, setGroups] = useState([]);
  // const socket = io("http://localhost:5000");

  // useEffect(() => {
  //   if (!socket) {
  //     setSocket(io("http://localhost:5000"));
  //   }

  //   return () => {
  //     socket?.disconnect();
  //   };
  // }, [socket]);

  useEffect(() => {
    if (!socket) return;

    // get socket status\
    console.log("Socket status: ", socket.connected);

    // socket.on("connect", () => {
    //   console.log("Connected to server assasasa " + socket.id);
    //   socket.emit("intitalRequest", slug[0]);
    // });

    // socket.on("instData", (data) => {
    //   console.log("InstData received:", data);
    //   // update the data structure to be displayed in the top bar
    //   updateInstData(data);
    // });

    // socket.on("groupData", async (data) => {
    //   console.log("GroupData received:", data);
    //   // update the data structure to be displayed in the top bar
    //   // append the data to the groups array

    //   setGroups((prev) => {
    //     return [...prev, data];
    //   });

    //   console.log(groups);

    //   // setGroups(data);
    // });

    socket.on("groupData", async (data) => {
      // console.log("GROUPDATA received:", data);
      // update the data structure to be displayed in the top bar
      // append the data to the groups array

      // const pvEl = document.getElementById(data["pvName"] + "_VALUE");
      // if (pvEl) {
      //   pvEl.innerHTML = data["value"];
      // }

      setGroups((prev) => {
        return [...prev, data];
      });
    });

    socket.on("groupPV", async (data) => {
      // console.log("GROUPDATA received:", data);
      // update the data structure to be displayed in the top bar
      // append the data to the groups array

      const pvEl = document.getElementById(data["pvName"] + "_VALUE_1");

      if (pvEl) {
        pvEl.innerHTML = data["value"];
        if (data["pvName"] === "IN:INTER:MOT:MTR0404") {
          console.log("PV VALUE: ", data["value"]);
        }
      }

      const pv = document.getElementById(data["pvName"] + "_CIRCLE");

      if (!pv) return;

      // if pv already has a green bg, dont do anything
      if (pv.classList.contains("text-green-500")) return;
      pv.classList.remove("text-transparent");
      pv.classList.add("text-green-500");

      setTimeout(() => {
        // pv.classList.remove("bg-green-500");
        pv.classList.remove("text-green-500");
        pv.classList.add("text-transparent");
      }, 2000);

      // setGroups(data);
    });

    return () => {
      socket.off("connect");
      socket.off("instData");
    };
  }, [socket]);

  return (
    <div className="rounded-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-4 mt-8">
      {groups.map((group) => {
        // console.log(group);
        return (
          <Group key={group.name} groupName={group.name} group={group.blocks} />
        );
      })}
    </div>
  );
}
