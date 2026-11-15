"use strict";

class SelectionError extends Error {
  constructor(message) {
    super(message);
    this.name = "SelectionError";
    this.status = 400;
  }
}

function toId(value, label) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new SelectionError(`${label} must be a positive integer.`);
  }
  return value;
}

function toIdList(value, label) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 30) {
    throw new SelectionError(`${label} must be an array with no more than 30 entries.`);
  }
  const result = value.map((id) => toId(id, `${label} entry`));
  if (new Set(result).size !== result.length) {
    throw new SelectionError(`${label} must not contain duplicate options.`);
  }
  return result;
}

function pennies(value, label) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) || Number(value) < 0) {
    throw new Error(`Invalid database price for ${label}.`);
  }
  const n = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(n)) throw new Error(`Price is too large for ${label}.`);
  return n;
}

function money(cents) {
  return (cents / 100).toFixed(2);
}

function priceCustomisation(catalogue, selection = {}) {
  if (!catalogue?.item) throw new Error("Missing dish catalogue.");
  const item = catalogue.item;
  const quantity = selection.quantity === undefined ? 1 : selection.quantity;
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10) {
    throw new SelectionError("Quantity must be between 1 and 10.");
  }
  const sizes = catalogue.sizes || [];
  const removals = catalogue.removals || [];
  const extras = catalogue.extras || [];
  const chosenRemovalIDs = toIdList(selection.removalIds, "removalIds");
  const chosenExtraIDs = toIdList(selection.extraIds, "extraIds");

  let selectedSize = null;
  if (sizes.length) {
    const selectedId = toId(selection.sizeId, "sizeId");
    selectedSize = sizes.find((option) => Number(option.sizeID) === selectedId);
    if (!selectedSize) throw new SelectionError("The selected size is not available for this dish.");
  } else if (selection.sizeId !== null && selection.sizeId !== undefined) {
    throw new SelectionError("This dish has no size options.");
  }

  const selectedRemovals = chosenRemovalIDs.map((id) => {
    const option = removals.find((row) => Number(row.removalID) === id);
    if (!option) throw new SelectionError("An ingredient removal is not available for this dish.");
    return { id: id, name: option.ingredientName };
  });
  const selectedExtras = chosenExtraIDs.map((id) => {
    const option = extras.find((row) => Number(row.extraID) === id);
    if (!option) throw new SelectionError("An extra is not available for this dish.");
    return { id, name: option.extraName, price: money(pennies(option.price, option.extraName)) };
  });

  const baseCents = pennies(item.price, "dish");
  const sizeCents = selectedSize ? pennies(selectedSize.price, "size") : baseCents;
  const extrasCents = selectedExtras.reduce((sum, option) => sum + pennies(option.price, "extra"), 0);
  const unitCents = sizeCents + extrasCents;
  const totalCents = unitCents * quantity;
  if (!Number.isSafeInteger(totalCents)) throw new Error("Order total exceeds safe limits.");

  return {
    itemID: Number(item.itemID),
    itemName: item.itemName,
    restaurantName: item.restaurantName,
    category: item.category,
    currency: "GBP",
    quantity,
    basePrice: money(baseCents),
    size: selectedSize ? {
      id: Number(selectedSize.sizeID),
      code: selectedSize.sizeCode,
      name: selectedSize.sizeName,
      price: money(sizeCents),
    } : null,
    removals: selectedRemovals,
    extras: selectedExtras,
    unitPrice: money(unitCents),
    totalPrice: money(totalCents),
    isDemo: true,
  };
}

module.exports = { priceCustomisation, SelectionError, toId, money };
