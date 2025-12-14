import { render, screen } from "@testing-library/react";
import Addresses from "./Addresses";

describe("Addresses Component", () => {
  const mockAddress = { address: "123 London Road, SW12 3JW" };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockAddress) })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders heading", () => {
    render(<Addresses customerId={1} />);
    const heading = screen.getByRole("heading", { name: /Address/i });
    expect(heading).toBeInTheDocument();
  });

  test("input has initial value from API", async () => {
    render(<Addresses customerId={1} />);

    const input = await screen.findByDisplayValue(mockAddress.address);
    expect(input).toBeInTheDocument();
    expect(input.value).toBe(mockAddress.address);
  });

  test("does not fetch if no customerId", () => {
    render(<Addresses />);
    expect(fetch).not.toHaveBeenCalled();
  });
});
