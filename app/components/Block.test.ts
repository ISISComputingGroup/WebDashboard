import { render } from "@testing-library/react";
import Block from "@/app/components/Block";
import { IfcBlock } from "@/app/types";
import { table } from "framer-motion/m";
import React from "react";

let tableBody: HTMLTableSectionElement;
beforeEach(() => {
  // We have to create a table with a tbody as Block returns a <tr>, so create that here for each test.
  const table = document.createElement("table");
  tableBody = table.createTBody();
});

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
  const { container } = render(Block(aBlock, instName, false), {
    container: tableBody,
  });
  expect(container).toMatchSnapshot();
});

it("renders nothing if pv is hidden", () => {
  const aBlock: IfcBlock = { pvaddress: "SOME:PV", visible: false };
  const { container } = render(Block(aBlock, "", false), {
    container: tableBody,
  });
  expect(container.innerHTML).toBe("");
});

it("renders block with correct name", () => {
  const aBlock: IfcBlock = {
    pvaddress: "SOME:PV",
    visible: true,
    human_readable_name: "MyBlock",
  };
  const { container } = render(Block(aBlock, "", false), {
    container: tableBody,
  });
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
  const { container } = render(Block(aBlock, "", false), {
    container: tableBody,
  });
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
  const { container } = render(Block(aBlock, "", false), {
    container: tableBody,
  });
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
  const { container } = render(Block(aBlock, "", false), {
    container: tableBody,
  });
  expect(
    container.querySelector(`#${aBlock.human_readable_name}_VALUE_RC`)!
      .innerHTML,
  ).toBe("");
});
