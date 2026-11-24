// Basket display estimates only; checkout must quote and validate fees on the server.
const DELIVERY_FEES = {
  "pizza express": 250,
  "burger king": 180,
  "dominos": 199,
  "papa johns": 249,
  "wagamama": 229,
  "pho": 189,
};
const SERVICE_FEE_PENCE = 149;
const asPence = (value) => Math.round(Number(value) * 100);
const safeQty = (value) => Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : 0;

export const money = (pence) => `£${(pence / 100).toFixed(2)}`;

function feeForRestaurant(name) {
  const normalized = String(name || "Restaurant").toLowerCase().trim();
  if (Object.prototype.hasOwnProperty.call(DELIVERY_FEES, normalized)) return DELIVERY_FEES[normalized];
  // Deterministic illustration for restaurants without a configured delivery quote.
  const seed = [...normalized].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return [149, 179, 199, 229, 249, 299][seed % 6];
}

export function buildBasketSummary(foodList = [], basketItems = {}, customLines = {}) {
  const rows = [];
  for (const item of foodList) {
    const quantity = safeQty(basketItems[item.itemID]);
    const unitPence = asPence(item.price);
    if (!quantity || !Number.isFinite(unitPence) || unitPence < 0) continue;
    rows.push({
      type: "standard", key: `standard:${item.itemID}`, itemID: Number(item.itemID),
      itemName: item.itemName, restaurantName: item.restaurantName || "Restaurant",
      restaurantID: item.restaurantID, size: null, removed: [], extras: [],
      ingredients: item.ingredients || null,
      unitPence, quantity, linePence: unitPence * quantity,
    });
  }
  for (const line of Object.values(customLines)) {
    const quantity = safeQty(line.quantity);
    const unitPence = asPence(line.unitPrice);
    if (!quantity || !Number.isFinite(unitPence) || unitPence < 0) continue;
    rows.push({
      type: "custom", key: String(line.key), itemID: Number(line.itemID),
      itemName: line.itemName, restaurantName: line.restaurantName || "Restaurant",
      restaurantID: line.restaurantID, size: line.size || null,
      removed: line.removed || [], extras: line.extras || [],
      unitPence, quantity, linePence: unitPence * quantity,
    });
  }
  const groups = [];
  const groupMap = new Map();
  for (const row of rows) {
    const key = `name:${row.restaurantName.toLowerCase().trim()}`;
    if (!groupMap.has(key)) {
      const group = { key, restaurantName: row.restaurantName, items: [], subtotalPence: 0, deliveryFeePence: feeForRestaurant(row.restaurantName) };
      groups.push(group);
      groupMap.set(key, group);
    }
    const group = groupMap.get(key);
    group.items.push(row);
    group.subtotalPence += row.linePence;
  }
  const foodSubtotalPence = groups.reduce((sum, group) => sum + group.subtotalPence, 0);
  const deliveryFeesPence = groups.reduce((sum, group) => sum + group.deliveryFeePence, 0);
  const serviceFeePence = groups.length ? SERVICE_FEE_PENCE : 0;
  return {
    groups, rows,
    itemCount: rows.reduce((sum, line) => sum + line.quantity, 0),
    foodSubtotalPence, deliveryFeesPence, serviceFeePence,
    totalPence: foodSubtotalPence + deliveryFeesPence + serviceFeePence,
  };
}
