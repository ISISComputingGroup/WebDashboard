import pako from "pako";
import binascii from "binascii";

/**
 * dehex - synonymous to dehex_and_decompress in inst_servers
 * @param {*} input raw data
 * @returns dehexed and decompressed data (you can choose to JSON parse it or not afterwards)
 */
export function dehex(input) {
      // DEHEX
      const unhexed = binascii.unhexlify(input);
      const charData = unhexed.split('').map(function(x){return x.charCodeAt(0); });
      // convert to binary
      const binData = new Uint8Array(charData);
      const res = pako.inflate(binData, {to: "string"});
      return res
}
