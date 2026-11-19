const shutterColourLookup = new Map<string, string>([
  ["OPEN", "bg-[#90EE90] text-black"],
  ["CLOSED", "bg-red-500 text-white"],
  ["MOVING", "bg-[#FFFF00] text-black"],
  ["FAULT", "bg-orange-500 text-black"],
  ["INVALID", "bg-orange-500 text-black"],
  ["DEACT", "bg-gray-400 text-black"],
]);

const unknownShutterColour = "bg-gray-200 text-black";

/**
 * Get tailwind background and foreground classes for a shutter or VAT valve status string.
 */
export function getShutterColour(status: string | number | undefined): string {
  if (status == undefined) {
    return unknownShutterColour;
  }
  return shutterColourLookup.get(status.toString()) || unknownShutterColour;
}
