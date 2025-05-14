"use client";

const grafana_stub =
  "https://shadow.nd.rl.ac.uk/grafana/d/wMlwwaHMk/block-history?viewPanel=2&orgId=1&var-block=";

export default function GrafanaLink({
  name,
  instName,
}: {
  name: string | undefined;
  instName: string;
}) {
    return (
      <td className="py-1 px-2 w-1/3 flex-row">
        <a
          className="underline"
          href={
            grafana_stub +
            name +
            "&var-inst=" +
            instName.toUpperCase()
          }
          target="_blank"
        >
          {name}
        </a>
      </td>
  );
}