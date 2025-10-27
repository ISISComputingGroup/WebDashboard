import { IfcPVWSRequest, PVWSRequestType } from "@/app/types";

export const instListPV = "CS:INSTLIST";
export const socketURL =
	/* c8 ignore next */
	process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/pvws/pv";

export const instListSubscription: IfcPVWSRequest = {
	type: PVWSRequestType.subscribe,
	pvs: [instListPV],
};

export const webSocketReconnectInterval = 5000; // ms
export const webSocketReconnectAttempts = 100000;
