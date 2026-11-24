import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StoreContext } from "../Context/shop-context";
import Home from "./Homepage";
import { getLastSearch, saveLastSearch } from "../utils/searchSession";

jest.mock("./FoodComparisonPage", () => ({ searchQuery, postcode, onBackToSearch }) => (
  <div data-testid="results">
    Results for {searchQuery || "everything"} near {postcode}
    <button type="button" onClick={onBackToSearch}>Back to search</button>
  </div>
));

const renderHome = () => render(<MemoryRouter><StoreContext.Provider value={{ setComparisonItems: jest.fn() }}><Home /></StoreContext.Provider></MemoryRouter>);

afterEach(() => window.sessionStorage.clear());

test("first-time visitors see the search form", () => {
  renderHome();
  expect(screen.getByRole("button", { name: /find your takeaway/i })).toBeTruthy();
  expect(screen.queryByTestId("results")).toBeNull();
});

test("returning Home after a search restores the results instead of the form", () => {
  const { unmount } = renderHome();
  fireEvent.change(screen.getByRole("textbox", { name: /postcode/i }), { target: { value: "E1 6AN" } });
  fireEvent.click(screen.getByRole("button", { name: /find your takeaway/i }));
  expect(screen.getByTestId("results").textContent).toContain("E1 6AN");
  unmount();
  renderHome();
  expect(screen.getByTestId("results").textContent).toContain("E1 6AN");
  expect(screen.queryByRole("button", { name: /find your takeaway/i })).toBeNull();
});

test("the most recently selected food and postcode are restored", () => {
  saveLastSearch({ item: "Pizza", postcode: "SW1A 1AA" });
  renderHome();
  expect(screen.getByTestId("results").textContent).toContain("Pizza near SW1A 1AA");
  expect(getLastSearch().item).toBe("Pizza");
});

test("choosing Back to search explicitly returns to the form", () => {
  saveLastSearch({ item: "Burger", postcode: "E1 6AN" });
  renderHome();
  fireEvent.click(screen.getByRole("button", { name: /back to search/i }));
  expect(screen.getByRole("button", { name: /find your takeaway/i })).toBeTruthy();
  expect(getLastSearch()).toBeNull();
});
