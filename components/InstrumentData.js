import React from "react";
import TopBar from "./TopBar";
import Groups from "./Groups";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";

export default function InstrumentData() {
  // set up the different states for the instrument data
  const [socket, setSocket] = useState(null);

  const router = useRouter();
  const [slug, setSlug] = useState(null);
  const socketURL = "http://localhost:5000";
  const [instName, setInstName] = useState(null);

  useEffect(() => {
    if (!router.query.slug) {
      return;
    }
    setSlug(router.query.slug);
    console.log(router.query.slug);
    setInstName(router.query.slug[0]);

    async function setupSocket() {
      const socketToSet = io(socketURL);
      const instNameToSet = router.query.slug[0];
      await setSocket(socketToSet);
      socketToSet.on("connect", () => {
        console.log("Connected to server as " + socketToSet.id);

        // gets a list of PVs for the instrument top bar and group data
        socketToSet.emit("intitalRequest", instNameToSet);
      });
    }

    setupSocket();

    return () => {
      socket?.disconnect();
    };
  }, [router.query.slug]);

  if (!socket || !slug || !instName) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="p-8 w-full mx-auto max-w-7xl">
      <TopBar socket={socket} instName={instName} />
      <Groups socket={socket} />
    </div>
  );
}
