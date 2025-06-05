import { render } from "@testing-library/react";
import Groups from "@/app/components/Groups";
import { tBlockMapping, tGroups } from "@/app/types";

it("renders groups correctly with hidden and non hidden groups", () => {
  let groups: tGroups = new Map();
  let blocksForGroup1: tBlockMapping = new Map();
  blocksForGroup1.set("A:SHOWN:BLOCK", {
    pvaddress: "A:SHOWN:BLOCK",
    human_readable_name: "aShownBlock",
    value: 2.344,
    visible: true,
  });
  blocksForGroup1.set("ADIFF:SHOWN:BLOCK", {
    pvaddress: "ADIFF:SHOWN:BLOCK",
    human_readable_name: "aDifferentShownBlock",
    value: 3.14,
    visible: true,
  });
  groups.set("group1", blocksForGroup1);

  let blocksForGroup2: tBlockMapping = new Map();
  blocksForGroup2.set("A:HIDDEN:BLOCK", {
    pvaddress: "A:HIDDEN:BLOCK",
    human_readable_name: "aHiddenBlock",
    visible: false,
  });
  groups.set("group2", blocksForGroup2);

  const { container } = render(
    <Groups instName={"TESTING"} showHiddenBlocks={false} groupsMap={groups} />,
  );
  expect(container).toMatchSnapshot();
});
