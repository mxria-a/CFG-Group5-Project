import { render, screen, fireEvent } from "@testing-library/react";
import PostCodeInput from "./PostCodeInput";

describe("PostCodeInput", () => {
  //test to find the postcode input field
  test("renders the postcode input", () => {
    //create a mock item for tesitng
    const mockSetPostcode = jest.fn();

    //mount component
    render(<PostCodeInput setPostcode={mockSetPostcode} />);

    //find input field in document
    const input = screen.getByLabelText(/postcode/i);

    expect(input).toBeInTheDocument();
  });

  //test to check that postcode is called
  test("calls setPostcode on input change", () => {
    const mockSetPostcode = jest.fn();
    render(<PostCodeInput setPostcode={mockSetPostcode} />);
    const input = screen.getByLabelText(/postcode/i);

    //simulate user input
    fireEvent.change(input, { target: { value: "AB1 2CD" } });

    //test input
    expect(mockSetPostcode).toHaveBeenCalledWith("AB1 2CD");
  });
});
