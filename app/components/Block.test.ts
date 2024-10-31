import { render } from "@testing-library/react";
import Block from "@/app/components/Block";
import { IfcBlock } from "@/app/types";

it("renders topbar unchanged", () => {
  const unit = "mm";
  const value = 123;
  const aBlock: IfcBlock = {
    pvaddress: "SOME:PV",
    units: unit,
    value: value,
    visible: true,
  };
  const instName = "Instrument";
  // @ts-ignore
  const { container } = render(Block(aBlock, instName, false));
  expect(container).toMatchSnapshot();
});

it("renders nothing if pv is hidden", () => {
  const aBlock: IfcBlock = { pvaddress: "SOME:PV", visible: false };
  // @ts-ignore
  const { container } = render(Block(aBlock, "", false));
  expect(container.innerHTML).toBe("");
});

it("renders block with correct name", () => {
  const aBlock: IfcBlock = {
    pvaddress: "SOME:PV",
    visible: true,
    human_readable_name: "MyBlock",
  };
  // @ts-ignore
  const { container } = render(Block(aBlock, "", false));
  expect(container.getElementsByTagName("a")[0].innerHTML).toBe(
    aBlock.human_readable_name,
  );
});

it("renders block with run control that is in range as a tick", () => {
  const aBlock: IfcBlock = {
    pvaddress: "SOME:PV",
    visible: true,
    human_readable_name: "MyBlock",
    runcontrol_inrange: true,
    runcontrol_enabled: true,
  };
  // @ts-ignore
  const { container } = render(Block(aBlock, "", false));
  expect(
    container.querySelector(`#${aBlock.human_readable_name}_VALUE_RC`)!
      .innerHTML,
  ).toBe("✅");
});

it("renders block with run control that is not in range as a cross", () => {
  const aBlock: IfcBlock = {
    pvaddress: "SOME:PV",
    visible: true,
    human_readable_name: "MyBlock",
    runcontrol_inrange: false,
    runcontrol_enabled: true,
  };
  // @ts-ignore
  const { container } = render(Block(aBlock, "", false));
  expect(
    container.querySelector(`#${aBlock.human_readable_name}_VALUE_RC`)!
      .innerHTML,
  ).toBe("❌");
});

it("renders block without run control without tick or cross", () => {
  const aBlock: IfcBlock = {
    pvaddress: "SOME:PV",
    visible: true,
    human_readable_name: "MyBlock",
    runcontrol_inrange: false,
    runcontrol_enabled: false,
  };
  // @ts-ignore
  const { container } = render(Block(aBlock, "", false));
  expect(
    container.querySelector(`#${aBlock.human_readable_name}_VALUE_RC`)!
      .innerHTML,
  ).toBe("");
});
