import Link from "next/link";
import { motion } from "framer-motion";
import { getForegroundColor, getStatusColor } from "./getRunstateColours";

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
        className="flex items-center justify-center w-20 min-w-min h-8" target="_blank"
      >
        <div className="flex flex-col justify-center items-center">
          <span className="text-md font-bold">{instrument.name}</span>
          <span className="text-xs text-gray-700">{instrument.status}</span>
        </div>
      </Link>
    </motion.div>
  );
}
