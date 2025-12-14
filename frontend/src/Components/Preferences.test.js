import { render, screen, fireEvent, act } from "@testing-library/react";
import Preferences from "./Preferences";

// Mock data
const mockAllergens = [
  { allergenID: 1, allergenName: "Gluten" },
  { allergenID: 2, allergenName: "Soy" },
  { allergenID: 3, allergenName: "Nuts" },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockAllergens),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Preferences Component", () => {

  test("renders heading and label", () => {
    render(<Preferences />);
    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByText(/Allergies\/Dietary/i)).toBeInTheDocument();
  });

  test("renders select with default option", async () => {
    await act(async () => {
      render(<Preferences />);
    });

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Select")).toBeInTheDocument();
  });

  test("renders allergen options from fetch", async () => {
    await act(async () => {
      render(<Preferences />);
    });

    expect(screen.getByText("Gluten")).toBeInTheDocument();
    expect(screen.getByText("Soy")).toBeInTheDocument();
    expect(screen.getByText("Nuts")).toBeInTheDocument();
  });

  test("updates selected allergen on user change", async () => {
    await act(async () => {
      render(<Preferences />);
    });

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Soy" } });
    expect(select.value).toBe("Soy");
  });

});