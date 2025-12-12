import { render, screen, fireEvent } from "@testing-library/react";
import SubmitButton from "./SubmitButton";

describe("SubmitButton", () => {
  //test to find button
  test("renders button", () => {
    //mock component
    ///const handleClick = jest.fn();

    //mount component
    render(<SubmitButton />);

    //find the button
    const button = screen.getByRole("button", { name: /find your takeaway/i });
    expect(button).toBeInTheDocument();
  });

  //test for button click
  test("button clicked", () => {
    //mock component
    const handleClick = jest.fn();

    //mount component
    render(<SubmitButton onClick={handleClick} />);

    //find the button
    const button = screen.getByRole("button", { name: /find your takeaway/i });

    //simulate click
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
