export function getForegroundColor(status) {
  switch (status) {
    case "UNKNOWN":
      return "text-white";
    case "PAUSED":
      return "text-white";
    case "PAUSING":
      return "text-white";
    case "RESUMING":
      return "text-white";
    case "RUNNING":
      return "text-white";
    case "BEGINNING":
      return "text-white";
    case "ENDING":
      return "text-white";
    case "WAITING":
      return "text-white";
    case "PROCESSING":
      return "text-black";
    case "VETOING":
      return "text-black";
    case "SETUP":
      return "text-white";
    default:
      return "text-white";
  }
}export function getStatusColor(status) {
  switch (status) {
    case "UNKNOWN":
      return "bg-yellow-500";
    case "PAUSED":
      return "bg-red-500";
    case "PAUSING":
      return "bg-red-950";
    case "RESUMING":
      return "bg-green-900";
    case "RUNNING":
      return "bg-[#90EE90]";
    case "BEGINNING":
      return "bg-[#90EE90]";
    case "ENDING":
      return "bg-[#90EE90]";
    case "WAITING":
      return "bg-[#DAA520]";
    case "PROCESSING":
      return "bg-[#FFFF00]";
    case "VETOING":
      return "bg-[#FFFF00]";
    case "SETUP":
      return "bg-[#ADD8E6]";
    default:
      return "bg-gray-500";
  }
}

