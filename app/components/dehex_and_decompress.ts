import { unzipSync } from "zlib";
import { instList } from "@/app/types";
/**
 * dehex_and_decompress
 * - synonymous to dehex_and_decompress in inst_servers
 * @param {*} input raw data
 * @returns dehexed and decompressed data (you can choose to JSON parse it or not afterwards)
 */
export function dehex_and_decompress(input: string): string {
  return unzipSync(Buffer.from(input, "hex")).toString();
}

/**
 * instListFromBytes
 * this function is a thin wrapper around dehex_and_decompress that takes bytes and returns an instlist object.
 * if the instlist is empty or not a string it will return an empty array.
 * @param input raw unconverted bytes from the CS:INSTLIST PV.
 */
export function instListFromBytes(input: string): instList {
  const dehexedInstList = dehex_and_decompress(atob(input));
  return JSON.parse(dehexedInstList);
}
