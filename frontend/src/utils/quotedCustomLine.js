// Keep distinct size, removal and extra combinations as separate basket lines.
export function createQuotedCustomLine(item, quote) {
  if (!item || Number(item.itemID) !== Number(quote?.itemID)) return null;
  const quantity = Number(quote.quantity);
  const unitPrice = Number(quote.unitPrice);
  const totalPrice = Number(quote.totalPrice);
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10 ||
      !Number.isFinite(unitPrice) || unitPrice < 0 ||
      !Number.isFinite(totalPrice) ||
      Math.round(totalPrice * 100) !== Math.round(unitPrice * 100) * quantity) return null;

  const size = quote.size ? { id: Number(quote.size.id), name: String(quote.size.name) } : null;
  const removals = (quote.removals || []).map((option) => ({ id: Number(option.id), name: String(option.name) }));
  const extras = (quote.extras || []).map((option) => ({ id: Number(option.id), name: String(option.name), price: Number(option.price) }));
  const key = JSON.stringify([
    Number(item.itemID), size?.id ?? null,
    removals.map((value) => value.id).sort((a, b) => a - b),
    extras.map((value) => value.id).sort((a, b) => a - b),
  ]);
  return {
    key, itemID: Number(item.itemID), itemName: String(item.itemName),
    restaurantName: String(item.restaurantName || "Restaurant"), image: item.image,
    size, removed: removals.map((option) => option.name).sort(), extras,
    unitPrice, quantity,
  };
}
