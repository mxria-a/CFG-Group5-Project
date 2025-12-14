import { render, screen, act } from "@testing-library/react";
import OrderHistory from "./OrderHistory";

const mockOrders = [
  {
    orderID: 1,
    restaurantName: "Pizza Hut",
    itemName: "Cheese Pizza",
    totalPrice: 12.5,
    orderTime: "2025-12-13T12:00:00Z",
  },
  {
    orderID: 2,
    restaurantName: "KFC",
    itemName: "Chicken Wrap",
    totalPrice: 8.99,
    orderTime: "2025-12-13T13:30:00Z",
  },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(mockOrders) })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("OrderHistory Component", () => {

  test("renders heading", () => {
    render(<OrderHistory />);
    expect(screen.getByText("Order History")).toBeInTheDocument();
  });

  test('shows "No orders found." when no orders', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
    );

    await act(async () => {
      render(<OrderHistory />);
    });

    expect(screen.getByText(/No orders found/i)).toBeInTheDocument();
  });

  test("renders list of orders when data exists", async () => {
    await act(async () => {
      render(<OrderHistory />);
    });

    expect(screen.getByText((content) =>
      content.includes("Pizza Hut") &&
      content.includes("Cheese Pizza") &&
      content.includes("£12.5")
    )).toBeInTheDocument();

    expect(screen.getByText((content) =>
      content.includes("KFC") &&
      content.includes("Chicken Wrap") &&
      content.includes("£8.99")
    )).toBeInTheDocument();
  });

});
