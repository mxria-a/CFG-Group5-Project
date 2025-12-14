import { render, screen } from "@testing-library/react";
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

describe("OrderHistory Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockOrders) })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete global.fetch;
  });

  test("renders heading", () => {
    render(<OrderHistory customerId={1} />);
    expect(screen.getByText("Order History")).toBeInTheDocument();
  });

  test('shows "No orders found." when no orders', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
    );

    render(<OrderHistory customerId={1} />);

    const noOrders = await screen.findByText(/No orders found/i);
    expect(noOrders).toBeInTheDocument();
  });

  test("renders list of orders when data exists", async () => {
    render(<OrderHistory customerId={1} />);

    const pizzaOrder = await screen.findByText(
      (content) =>
        content.includes("Pizza Hut") &&
        content.includes("Cheese Pizza") &&
        content.includes("£12.5")
    );
    const kfcOrder = await screen.findByText(
      (content) =>
        content.includes("KFC") &&
        content.includes("Chicken Wrap") &&
        content.includes("£8.99")
    );

    expect(pizzaOrder).toBeInTheDocument();
    expect(kfcOrder).toBeInTheDocument();
  });

  test("does not fetch if no customerId", () => {
    render(<OrderHistory />);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
