import { render } from "@testing-library/react";
import Groups from "@/app/components/Groups";
import { tGroups } from "@/app/types";

it("renders groups correctly with hidden and non hidden groups", () => {
  const groupsWithOneGroupThatHasAHiddenBlock: tGroups = new Map();

  groupsWithOneGroupThatHasAHiddenBlock.set(
    "group1",
    new Map([
      [
        "A:SHOWN:BLOCK",
        {
          pvaddress: "A:SHOWN:BLOCK",
          human_readable_name: "aShownBlock",
          value: 2.344,
          visible: true,
        },
      ],
      [
        "ADIFF:SHOWN:BLOCK",
        {
          pvaddress: "ADIFF:SHOWN:BLOCK",
          human_readable_name: "aDifferentShownBlock",
          value: 3.14,
          visible: true,
        },
      ],
    ]),
  );
  groupsWithOneGroupThatHasAHiddenBlock.set(
    "group2",
    new Map([
      [
        "A:HIDDEN:BLOCK",
        {
          pvaddress: "A:HIDDEN:BLOCK",
          human_readable_name: "aHiddenBlock",
          visible: false,
        },
      ],
    ]),
  );

  const { container } = render(
    <Groups
      instName={"TESTING"}
      showHiddenBlocks={false}
      groupsMap={groupsWithOneGroupThatHasAHiddenBlock}
    />,
  );
  expect(container).toMatchSnapshot();
});
