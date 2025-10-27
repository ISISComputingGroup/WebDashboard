import { render } from "@testing-library/react";
import NavBar from "@/app/NavBar";

it("renders navbar unchanged", () => {
  const { container } = render(<NavBar />);
  expect(container).toMatchSnapshot();
});
