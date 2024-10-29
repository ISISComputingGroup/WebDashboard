const statusColourLookup = new Map<string, string>([
  ["PAUSED", "bg-red-500"],
  ["PAUSING", "bg-red-950"],
  ["RESUMING", "bg-green-900"],
  ["RUNNING", "bg-[#90EE90]"],
  ["BEGINNING", "bg-[#90EE90]"],
  ["ENDING", "bg-[#90EE90]"],
  ["WAITING", "bg-[#DAA520]"],
  ["PROCESSING", "bg-[#FFFF00]"],
  ["VETOING", "bg-[#FFFF00]"],
  ["SETUP", "bg-[#ADD8E6]"],
]);

export function getForegroundColour(status: string | undefined): string {
  const blackTextRunstates = [
    undefined,
    "UNKNOWN",
    "RUNNING",
    "PROCESSING",
    "VETOING",
    "SETUP",
  ];
  return blackTextRunstates.includes(status) ? "text-black" : "text-white";
}
export function getStatusColour(status: string | undefined): string {
  if (
    status == undefined ||
    !statusColourLookup.has(status) ||
    status == "UNKNOWN"
  ) {
    return "bg-[#F08080]";
  }
  return statusColourLookup.get(status)!;
}
