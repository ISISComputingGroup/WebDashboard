import pako from "pako";
import binascii from "binascii";

export function dehex(input) {
      // DEHEX
      const unhexed = binascii.unhexlify(input);
      const charData = unhexed.split('').map(function(x){return x.charCodeAt(0); });
      // convert to binary
      const binData = new Uint8Array(charData);
      const res = pako.inflate(binData, {to: "string"});
      return res
}
