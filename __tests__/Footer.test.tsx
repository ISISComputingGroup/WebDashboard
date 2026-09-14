import { render } from "@testing-library/react";
import Footer from "@/app/Footer";

it("renders footer unchanged", () => {
  const { container } = render(<Footer />);
  expect(container).toMatchSnapshot();
});
