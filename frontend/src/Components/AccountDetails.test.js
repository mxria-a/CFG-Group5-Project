import { render, screen, act } from "@testing-library/react";
import AccountDetails from "./AccountDetails";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          firstName: "Test",
          lastName: "User",
          emailAddress: "test.user@example.com",
          phoneNumber: "07000000000",
        }),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("AccountDetails Component", () => {

  test("renders Personal Details heading and labels", () => {
    render(<AccountDetails />);

    expect(screen.getByText("Personal Details")).toBeInTheDocument();
    expect(screen.getByText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
  });

  test("displays customer details after fetch", async () => {
    await act(async () => {
      render(<AccountDetails />);
    });

    expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test.user@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("07000000000")).toBeInTheDocument();
  });

  test('falls back to "N/A" when customer data is missing', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({}) })
    );

    await act(async () => {
      render(<AccountDetails />);
    });

    const inputs = screen.getAllByDisplayValue("N/A");
    expect(inputs.length).toBe(4);
  });

});