import { render, screen } from "@testing-library/react";
import AccountDetails from "./AccountDetails";

describe("AccountDetails Component", () => {
  const mockCustomer = {
    firstName: "Test",
    lastName: "User",
    emailAddress: "test.user@example.com",
    phoneNumber: "07000000000",
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockCustomer) })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete global.fetch;
  });

  test("renders Personal Details heading and labels", () => {
    render(<AccountDetails customerId={1} />);

    const heading = screen.getByRole("heading", { name: /Personal Details/i });
    expect(heading).toBeInTheDocument();

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
  });

  test("displays customer details after fetch", async () => {
    render(<AccountDetails customerId={1} />);

    expect(
      await screen.findByDisplayValue(mockCustomer.firstName)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockCustomer.lastName)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockCustomer.emailAddress)
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockCustomer.phoneNumber)
    ).toBeInTheDocument();
  });

  test('falls back to "N/A" when customer data is missing', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({}) })
    );

    render(<AccountDetails customerId={1} />);

    const inputs = await screen.findAllByDisplayValue("N/A");
    expect(inputs.length).toBe(4);
  });

  test("does not fetch if no customerId", () => {
    render(<AccountDetails />);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
