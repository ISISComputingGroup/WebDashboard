import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";


const INSTLIST_PV = "CS:INSTLIST";

export default function InstList() {
  const socketURL = process.env.NEXT_PUBLIC_WS_URL;
  const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST;

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
      sendJsonMessage({ type: "subscribe", pvs: [INSTLIST_PV] });

  }, [sendJsonMessage]);

  const [instList, setInstlist] = useState(null);

  useEffect(() => {
    if (lastJsonMessage !== null) {

      fetch(`http://${backendHost}:3001/pvs/dehex`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ data: lastJsonMessage.text }),
      }).then((response) => response.json()).then((response) => {
        setInstlist(response);
        console.log(response)
      }
    )

    }
  }, [lastJsonMessage]);

  if (!instList) {
    return
  }
  return instList;



}
