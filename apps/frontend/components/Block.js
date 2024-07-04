const grafana_stub =
  "https://shadow.nd.rl.ac.uk/grafana/d/wMlwwaHMk/block-history?viewPanel=2&orgId=1&var-block=";

export default function Block(pv, instName, showHiddenBlocks) {
  if (!pv.visible && !showHiddenBlocks) {
    return;
  }
  return (
    <tr
      key={pv.human_readable_name}
      className="border-b border-blue-gray-200 transition duration-100 hover:bg-gray-100 hover:text-black"
    >
      <td className="py-1 px-4">
        <a
          className="underline"
          href={
            grafana_stub +
            pv.human_readable_name +
            "&var-inst=" +
            instName.toUpperCase()
          }
          target="_blank"
        >
          {pv.human_readable_name}
        </a>
      </td>

      <td className="py-1 px-4 ">
        <span id={pv.human_readable_name + "_VALUE"}>{pv.value} {(pv.units != null) && pv.units} <p className="text-red-600">{(pv.severity != "NONE") && pv.severity}</p>  </span>
      </td>
      <td className="py-1 px-4 flex justify-between items-center">
        <span id={pv.human_readable_name + "_VALUE_RC"}>
          {pv.runcontrol_enabled}
        </span>
        <svg
          id={pv.human_readable_name + "_CIRCLE"}
          className="min-w-2 min-h-2 max-w-2 max-h-2 transition-all text-transparent"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="12" />
        </svg>
      </td>
    </tr>
  );
}
