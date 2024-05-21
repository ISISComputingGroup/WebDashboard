import Link from "next/link";
import { motion } from "framer-motion";

function getStatusColor(status) {
  switch (status) {
    case "UNKNOWN":
      return "bg-red-500";
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

function getForegroundColor(status) {
  switch (status) {
    case "UNKNOWN":
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
}

export default function WallCard({ instrument }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`flex items-center justify-between p-3 m-1 rounded-lg shadow-sm border-2 border-gray-100 hover:shadow-lg hover:border-black transition-all duration-200
      ${getStatusColor(instrument.status)} ${getForegroundColor(
        instrument.status
      )}




`}
    >
      <Link
        href={"instruments/" + instrument.name.toLowerCase()}
        className="flex items-center justify-center w-20 min-w-min h-8"
      >
        <div className="flex flex-col justify-center items-center">
          <span className="text-md font-bold">{instrument.name}</span>
          <span className="text-xs text-gray-700">{instrument.status}</span>
        </div>
      </Link>
    </motion.div>
  );
}
