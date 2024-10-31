import useWebSocket from "react-use-websocket";
import { dehex_and_decompress } from "./dehex_and_decompress";

import { IfcPVWSMessage, IfcPVWSRequest } from "@/app/types";

const INSTLIST_PV = "CS:INSTLIST";

export default function InstList() {
  const socketURL = process.env.NEXT_PUBLIC_WS_URL ?? "";

  const {
    sendJsonMessage,
    lastJsonMessage,
  }: {
    sendJsonMessage: (a: IfcPVWSRequest) => void;
    lastJsonMessage: IfcPVWSMessage;
  } = useWebSocket(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  sendJsonMessage({ type: "subscribe", pvs: [INSTLIST_PV] });

  let instList = null;

  if (lastJsonMessage) {
    if (lastJsonMessage.b64byt) {
      const response = dehex_and_decompress(atob(lastJsonMessage.b64byt));
      if (typeof response == "string") {
        instList = JSON.parse(response);
      }
    }
  }

  if (!instList) {
    return;
  }
  return instList;
}
