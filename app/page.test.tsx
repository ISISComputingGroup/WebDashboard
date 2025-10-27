import { render } from "@testing-library/react";
import Home from "@/app/page";

it("renders main page unchanged", () => {
  const { container } = render(<Home />);
  expect(container).toMatchSnapshot();
});
