import { fireEvent, render } from "@testing-library/react";
import CheckToggle from "@/app/components/CheckToggle";

it.each([
  true,
  false,
])("CheckToggle acts on checked variable on a toggle when the initial state is %s", (initialChecked) => {
  const onChange = jest.fn();
  const expectedText = "Click me to break the internet";
  const { container } = render(
    <CheckToggle
      checked={initialChecked}
      setChecked={onChange}
      text={expectedText}
    />,
  );
  const input = container.getElementsByTagName("input")[0];
  expect(input.checked).toBe(initialChecked);
  fireEvent.click(input);
  expect(onChange).toHaveBeenCalledWith(!initialChecked);
});
