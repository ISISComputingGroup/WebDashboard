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

export function getForegroundColour(status: string): string {
  const blackTextRunstates = [
    "UNKNOWN",
    "RUNNING",
    "PROCESSING",
    "VETOING",
    "SETUP",
    "WAITING",
    "BEGINNING",
    "ENDING",
  ];
  return blackTextRunstates.includes(status) ? "text-black" : "text-white";
}
export function getStatusColour(status: string): string {
  return statusColourLookup.get(status) || "bg-[#F08080]";
}
