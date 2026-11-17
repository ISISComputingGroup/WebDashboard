import {
  type BeamStatusRow,
  grafanaLink,
} from "@/app/components/BeamStatusPVs";
import type { IfcPV } from "@/app/types";

export function getSeverityClass(severity: string | undefined): string {
  switch (severity) {
    case "MINOR":
      return "text-amber-500 font-bold";
    case "MAJOR":
    case "INVALID":
      return "text-red-400 font-bold";
    default:
      return "";
  }
}

export default function BeamStatusSection({
  title,
  rows,
  pvs,
}: {
  title: string;
  rows: Array<BeamStatusRow>;
  pvs: Map<string, IfcPV>;
}) {
  return (
    <div className="flex flex-col w-full rounded-xl bg-white dark:bg-zinc-900 text-black dark:text-white shadow-md p-4">
      <h1 className="w-full text-left text-gray-600 dark:text-gray-200 font-semibold text-lg pb-2">
        {title}
      </h1>
      <table className="text-sm table-fixed w-full">
        <tbody>
          {rows.map((row) => {
            const pv = pvs.get(row.pv);
            const hasValue = pv?.value != undefined && pv.value !== "";
            return (
              <tr
                key={row.pv}
                className="border-b border-blue-gray-200 transition duration-100 hover:bg-gray-100 hover:text-black"
                title={row.pv}
              >
                <td className="py-1 px-2 w-7/12">
                  {row.grafanaMetric ? (
                    <a
                      className="underline"
                      href={grafanaLink(row.grafanaMetric)}
                      target="_blank"
                      rel="noopener"
                    >
                      {row.label}
                    </a>
                  ) : (
                    row.label
                  )}
                </td>
                <td
                  id={row.pv + "_VALUE"}
                  className={`py-1 px-2 ${getSeverityClass(pv?.severity)}`}
                >
                  {hasValue ? pv!.value : "-"}
                  {hasValue && pv!.units ? ` ${pv!.units}` : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
