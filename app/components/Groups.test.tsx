import { render } from "@testing-library/react";
import Groups from "@/app/components/Groups";
import { IfcGroup } from "@/app/types";

it("renders groups correctly with hidden and non hidden groups", () => {
  const shownGroupWithTwoBlocks: IfcGroup = {
    name: "group1",
    blocks: [
      {
        pvaddress: "A:SHOWN:BLOCK",
        human_readable_name: "aShownBlock",
        value: 2.344,
        visible: true,
      },
      {
        pvaddress: "ADIFF:SHOWN:BLOCK",
        human_readable_name: "aDifferentShownBlock",
        value: 3.14,
        visible: true,
      },
    ],
  };
  const hiddenGroupWithOneBlock: IfcGroup = {
    name: "group2",
    blocks: [
      {
        pvaddress: "A:HIDDEN:BLOCK",
        human_readable_name: "aHiddenBlock",
        visible: false,
      },
    ],
  };
  const { container } = render(
    <Groups
      instName={"TESTING"}
      showHiddenBlocks={false}
      groupsMap={[shownGroupWithTwoBlocks, hiddenGroupWithOneBlock]}
    />,
  );
  expect(container).toMatchSnapshot();
});
