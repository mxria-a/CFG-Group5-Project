import { render, screen, fireEvent, within } from "@testing-library/react";
import ComparisonTable from "./ComparisonTable";
import { StoreContext } from "../Context/shop-context";

const items = [
  { itemID: 1, itemName: "Burger A", restaurantName: "Burger King", price: 10.5,
    deliveryTime: 30, avRating: 4.5, distance: 4.3, calories: 800,
    allergens: "Gluten", isVegan: false, ingredients: "Bun, Meat, Cheese, Ketchup" },
  { itemID: 2, itemName: "Vegan Burger", restaurantName: "Green Eats", price: 12,
    deliveryTime: 45, avRating: 4.8, calories: 500, allergens: "Soy", isVegan: true,
    ingredients: "Plant patty, lettuce, tomato, cucumber, special vegan sauce, sesame bun, onion rings, pickles, avocado, mushrooms, spinach, kale" }
];

const withStore = (component, addToBasket = jest.fn()) => render(
  <StoreContext.Provider value={{ addToBasket }}>{component}</StoreContext.Provider>
);

describe("Showdown comparison", () => {
  test("explains an empty comparison", () => {
    withStore(<ComparisonTable items={[]} />);
    expect(screen.getByText(/no dishes selected for comparison/i)).toBeInTheDocument();
  });

  test("shows winners together with their restaurant names, without inventing an overall winner", () => {
    withStore(<ComparisonTable items={items} />);
    const glance = screen.getByRole("region", { name: "At a glance" });
    expect(within(glance).getByText("Lowest dish price")).toBeInTheDocument();
    expect(within(glance).getByText("Fastest delivery")).toBeInTheDocument();
    expect(within(glance).getByText("Top rated")).toBeInTheDocument();
    expect(within(glance).getAllByText("Burger A")).toHaveLength(2);
    expect(within(glance).getAllByText("Burger King")).toHaveLength(2);
    expect(within(glance).getByText("Vegan Burger")).toBeInTheDocument();
    expect(within(glance).getByText("Green Eats")).toBeInTheDocument();
    expect(screen.getByText(/dish prices shown exclude/i)).toBeInTheDocument();
    expect(screen.getAllByText("£10.50")).toHaveLength(1);
  });

  test("shows tied winners without picking one arbitrarily", () => {
    withStore(<ComparisonTable items={[items[0], { ...items[1], deliveryTime: 30 }]} />);
    const glance = screen.getByRole("region", { name: "At a glance" });
    expect(within(glance).getByText("Joint fastest delivery")).toBeInTheDocument();
    expect(within(glance).getAllByText("Burger A")).toHaveLength(2);
    expect(within(glance).getAllByText("Vegan Burger")).toHaveLength(2);
  });

  test("expands ingredients and keeps control state accessible", () => {
    withStore(<ComparisonTable items={items} />);
    const section = screen.getByTestId("ingredients-2");
    const button = within(section).getByRole("button", { name: /view all ingredients/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(within(section).getByRole("button", { name: /show fewer/i })).toHaveAttribute("aria-expanded", "true");
    expect(within(section).getByText("kale")).toBeInTheDocument();
  });

  test("choosing a dish adds it to the existing basket", () => {
    const addToBasket = jest.fn();
    const onSelectWinner = jest.fn();
    withStore(<ComparisonTable items={items} onSelectWinner={onSelectWinner} />, addToBasket);
    fireEvent.click(screen.getByTestId("add-to-cart-1"));
    expect(addToBasket).toHaveBeenCalledWith(1);
    expect(onSelectWinner).toHaveBeenCalledWith(items[0]);
    expect(screen.getByText(/added to basket/i)).toBeInTheDocument();
  });

  test("shows restaurant logos instead of A/B/C badges", () => {
    const { container } = withStore(<ComparisonTable items={items} />);
    expect(container.querySelectorAll(".pk-showdown-restaurant .pk-restaurant-logo")).toHaveLength(2);
    expect(container.querySelectorAll(".pk-showdown-letter")).toHaveLength(0);
  });

  test("opens the existing customisation modal through the supplied callback", () => {
    const onCustomiseDish = jest.fn();
    const addToBasket = jest.fn();
    withStore(<ComparisonTable items={items} onCustomiseDish={onCustomiseDish} />, addToBasket);
    fireEvent.click(screen.getByRole("button", { name: /customise burger a and add to basket/i }));
    expect(onCustomiseDish).toHaveBeenCalledWith(items[0]);
    expect(addToBasket).not.toHaveBeenCalled();
    expect(screen.getAllByText(/customise & add to basket/i)).toHaveLength(2);
  });

  test("missing data is explicit and never treated as allergen-free", () => {
    const unknown = { itemID: 3, itemName: "Mystery dish" };
    withStore(<ComparisonTable items={[items[0], unknown]} />);
    expect(screen.getByText("Allergen information unavailable")).toBeInTheDocument();
    expect(screen.getByText("Ingredient information unavailable")).toBeInTheDocument();
    expect(screen.getAllByText("Not enough data").length).toBeGreaterThan(0);
    expect(screen.getByText(/missing information does not mean/i)).toBeInTheDocument();
    expect(screen.getByText("Vegan status not provided")).toBeInTheDocument();
  });
});
