import { IfcPV, IfcPVWSMessage, instListEntry } from "@/app/types";

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
  const nValue: number = value == undefined ? NaN : +value;
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

/**
 * PVWS gives values as several different fields depending on the PV's data type,
 * this function returns either the string, number or no value at all
 * so we can use it as a single variable
 */
export function getPvValue(
  updatedPV: IfcPVWSMessage,
): string | number | undefined {
  if (updatedPV.text != null) {
    // PV has string value
    return updatedPV.text;
  } else if (updatedPV.b64byt != null) {
    // PV value is base64 encoded
    const buffer = Buffer.from(updatedPV.b64byt, "base64");
    // In chrome, to avoid trailing nulls in the returned string, we need to
    // explicitly trim out everything after the first null character.
    const end = buffer.indexOf(0);
    if (end !== -1) {
      return buffer.toString("utf8", 0, end);
    } else {
      return buffer.toString("utf8");
    }
  } else if (updatedPV.value != null) {
    // PV value is a number
    return updatedPV.value;
  }
}

/**
 * Given an instlist, check if the current instrument is in it and return
 * the instrument prefix, if not just return TE:<instName>:
 */
export function getPrefix(
  instlist: Array<instListEntry>,
  instName: string,
): string {
  for (const instListEntry of instlist) {
    if (instListEntry.name == instName.toUpperCase()) {
      return instListEntry.pvPrefix;
    }
  }

  // not on the instlist, or the instlist is not available. Try to guess it's a developer machine
  return "TE:" + instName.toUpperCase() + ":";
}
