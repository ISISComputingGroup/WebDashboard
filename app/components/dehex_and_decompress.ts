import pako from "pako";
import { instList } from "@/app/types";

function unhexlify(str: string): string {
  let result = "";
  for (let i = 0, l = str.length; i < l; i += 2) {
    result += String.fromCharCode(parseInt(str.slice(i, i + 2), 16));
  }
  return result;
}

/**
 * dehex_and_decompress
 * - synonymous to dehex_and_decompress in inst_servers
 * @param {*} input raw data
 * @returns dehexed and decompressed data (you can choose to JSON parse it or not afterwards)
 */
export function dehex_and_decompress(input: string): string {
  // DEHEX
  const unhexed = unhexlify(input);
  const charData = unhexed.split("").map(function (x) {
    return x.charCodeAt(0);
  });
  // convert to binary
  const binData = new Uint8Array(charData);
  return pako.inflate(binData, { to: "string" });
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
