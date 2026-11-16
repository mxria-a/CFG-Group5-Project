import { getDishCategory } from "./menuDiscovery";
import { getStartingPrice } from "./itemStartingPrice";

const API_BASE = "https://cfg-group5-backend.onrender.com";
const sizePriceRequests = new Map();

const hasValidPrice = (value) => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;

// Menu prices are the price of the cheapest available size. The current menu offers
// sizes for pizzas only; other dishes retain their listed single-item price.
export function getItemComparablePrice(item) {
  if (item?.priceStatus === "unavailable") return null;
  if (hasValidPrice(item?.startingPrice)) return Number(item.startingPrice);
  return hasValidPrice(item?.price) ? Number(item.price) : null;
}

export function getItemDisplayPrice(item) {
  const price = getItemComparablePrice(item);
  if (price === null) return "Price on selection";
  return `${item?.hasSizes ? "From " : ""}£${price.toFixed(2)}`;
}

function fetchSizePrices(item) {
  const id = Number(item.itemID);
  if (!sizePriceRequests.has(id)) {
    const request = fetch(`${API_BASE}/items/${encodeURIComponent(id)}/customisation-options`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load size prices");
        const result = await response.json();
        const start = getStartingPrice(item.price, result.sizes || []);
        return { startingPrice: start.price, hasSizes: start.hasSizes, priceStatus: "ready" };
      })
      .catch((error) => {
        sizePriceRequests.delete(id); // Allow a later search to retry after a temporary failure.
        throw error;
      });
    sizePriceRequests.set(id, request);
  }
  return sizePriceRequests.get(id);
}

export async function attachMenuStartingPrices(items) {
  const result = [...items];
  const pizzaIndices = items.flatMap((item, i) => getDishCategory(item) === "pizza" ? [i] : []);
  let index = 0;
  // Four concurrent requests keep the initial menu load manageable on Render.
  async function worker() {
    while (index < pizzaIndices.length) {
      const current = pizzaIndices[index++];
      try {
        const pricing = await fetchSizePrices(items[current]);
        result[current] = { ...items[current], ...pricing };
      } catch {
        // Never display the regular-size price as though it were the starting price.
        result[current] = { ...items[current], startingPrice: null, hasSizes: false, priceStatus: "unavailable" };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, pizzaIndices.length) }, () => worker()));
  return result;
}
