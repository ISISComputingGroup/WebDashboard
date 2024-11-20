import { IfcPV } from "@/app/types";

/**
 * Given an array of PVs, find a PV based on its human-readable name. If none found, return undefined.
 */
export function findPVByHumanReadableName(
  arr: Array<IfcPV>,
  human_readable_name: string,
): IfcPV | undefined {
  return arr.find((b: IfcPV) => b.human_readable_name == human_readable_name);
}

/**
 * Given an array of PVs, find a PV based on its PV address. If none found, return undefined.
 */
export function findPVByAddress(
  arr: Array<IfcPV>,
  address: string,
): IfcPV | undefined {
  return arr.find((b: IfcPV) => b.pvaddress == address);
}

/**
 * Formats a given PV value input such that above or below a threshold value,
 * it uses scientific (exponential) notation, matching behaviour of ibex_gui
 */
export function ExponentialOnThresholdFormat(
  value: string | number,
  precision: number = 3,
) {
  var nValue: number = value == undefined ? NaN : +value;
  if (isNaN(nValue)) {
    return value;
  } else {
    if (nValue == 0) {
      return "0";
    } else if (Number.isInteger(nValue)) {
      return nValue.toString();
    } else if (Math.abs(nValue) < 0.001 || Math.abs(nValue) >= 1000000) {
      return nValue
        .toExponential(precision)
        .replace("e+", "E")
        .replace("e", "E");
    } else {
      return nValue.toFixed(precision);
    }
  }
}
