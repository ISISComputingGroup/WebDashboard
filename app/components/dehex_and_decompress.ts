import pako from "pako";

function unhexlify(str: string): string {
  let result = "";
  for (let i = 0, l = str.length; i < l; i += 2) {
    result += String.fromCharCode(parseInt(str.substr(i, 2), 16));
  }
  return result;
}

/**
 * dehex_and_decompress
 * - synonymous to dehex_and_decompress in inst_servers
 * @param {*} input raw data
 * @returns dehexed and decompressed data (you can choose to JSON parse it or not afterwards)
 */
export function dehex_and_decompress(
  input: string,
): string | Uint8Array | null {
  // DEHEX
  const unhexed = unhexlify(input);
  const charData = unhexed.split("").map(function (x) {
    return x.charCodeAt(0);
  });
  // convert to binary
  const binData = new Uint8Array(charData);
  return pako.inflate(binData, { to: "string" });
}
