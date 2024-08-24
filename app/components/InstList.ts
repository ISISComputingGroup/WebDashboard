
import useWebSocket from "react-use-websocket";
import { dehex_and_decompress } from "./dehex_and_decompress";

const INSTLIST_PV = "CS:INSTLIST";

export default function InstList() {
  const socketURL = process.env.NEXT_PUBLIC_WS_URL ?? "";

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<any>(socketURL, {
    shouldReconnect: (closeEvent) => true,
  });

  sendJsonMessage({ type: "subscribe", pvs: [INSTLIST_PV] });

  let instList = null;

    if (lastJsonMessage) {
      if (lastJsonMessage.b64byt && typeof lastJsonMessage.b64byt == "string") {
        const response: any = dehex_and_decompress(atob(lastJsonMessage.b64byt));
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
