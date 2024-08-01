import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { dehex_and_decompress } from "./dehex_and_decompress";

const INSTLIST_PV = "CS:INSTLIST";

export default function InstList() {
  const socketURL = process.env.NEXT_PUBLIC_WS_URL;

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    sendJsonMessage({ type: "subscribe", pvs: [INSTLIST_PV] });
  }, [sendJsonMessage]);

  const [instList, setInstlist] = useState(null);

  useEffect(() => {
    if (lastJsonMessage !== null && lastJsonMessage.text != null) {
      const response = JSON.parse(dehex_and_decompress(lastJsonMessage.text));
      setInstlist(response);
      console.log(response);
    }
  }, [lastJsonMessage]);

  if (!instList) {
    return;
  }
  return instList;
}
