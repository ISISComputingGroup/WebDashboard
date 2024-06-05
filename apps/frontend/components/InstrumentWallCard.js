import Link from "next/link";
import { motion } from "framer-motion";
import { getForegroundColor, getStatusColor } from "./getRunstateColours";

export default function WallCard({ instrument }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`flex items-center justify-between p-3  rounded-lg shadow-sm border-2 border-gray-700 hover:shadow-lg hover:border-black transition-all duration-200
      ${getStatusColor(instrument.status)} ${getForegroundColor(
        instrument.status
      )}




`}
    >
      <Link
        href={"instruments/" + instrument.name.toLowerCase()}
        className="flex items-center justify-center  lg:w-20 w-full h-4"
        target="_blank"
      >
        <div className="flex flex-col justify-center items-center">
          <span className="text-sm font-bold truncate line-clamp-1 ">
            {instrument.name}
          </span>
          <span className="text-xs ">{instrument.status}</span>
        </div>
      </Link>
    </motion.div>
  );
}
