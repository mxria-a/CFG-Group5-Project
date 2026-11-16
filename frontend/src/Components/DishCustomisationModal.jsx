import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FoodCardIllustration from "./FoodCardIllustration";
import { formatStartingPrice, getLowestPricedSize } from "../utils/itemStartingPrice";
import "./DishCustomisationModal.css";

const API_BASE = "https://cfg-group5-backend.onrender.com";
const pounds = (value) => `£${Number(value).toFixed(2)}`;

function selectionKey(itemId, sizeId, removalIds, extraIds, quantity) {
  return JSON.stringify([
    Number(itemId), sizeId == null ? null : Number(sizeId),
    [...removalIds].sort((a, b) => a - b), [...extraIds].sort((a, b) => a - b), quantity,
  ]);
}

export default function DishCustomisationModal({ item, onClose, onBack, onAddToBasket, backLabel = "Back to dish details" }) {
  const [catalogue, setCatalogue] = useState(null);
  const [loadState, setLoadState] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);
  const [sizeId, setSizeId] = useState(null);
  const [removalIds, setRemovalIds] = useState([]);
  const [extraIds, setExtraIds] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [quoteState, setQuoteState] = useState({ key: "", value: null, error: "" });
  const [adding, setAdding] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  const itemId = item?.itemID;

  useEffect(() => {
    if (!itemId) return undefined;
    const controller = new AbortController();
    setCatalogue(null);
    setLoadState("loading");
    setLoadError("");
    setSizeId(null);
    setRemovalIds([]);
    setExtraIds([]);
    setQuantity(1);
    setQuoteState({ key: "", value: null, error: "" });
    fetch(`${API_BASE}/items/${encodeURIComponent(itemId)}/customisation-options`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load your options.");
        return result;
      })
      .then((result) => {
        setCatalogue(result);
        const defaultSize = getLowestPricedSize(result.sizes);
        setSizeId(defaultSize ? Number(defaultSize.id) : null);
        setLoadState("ready");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setLoadError(error.message || "Could not load your options. Try again.");
        setLoadState("error");
      });
    return () => controller.abort();
  }, [itemId, reloadCount]);

  const currentKey = selectionKey(itemId, sizeId, removalIds, extraIds, quantity);
  useEffect(() => {
    if (loadState !== "ready" || !catalogue) return undefined;
    if (catalogue.sizes?.length && !sizeId) return undefined;
    const controller = new AbortController();
    const key = selectionKey(itemId, sizeId, removalIds, extraIds, quantity);
    setQuoteState({ key: "", value: null, error: "" });
    fetch(`${API_BASE}/customisations/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: Number(itemId), sizeId, removalIds, extraIds, quantity }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to calculate price.");
        return result;
      })
      .then((value) => setQuoteState({ key, value, error: "" }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        setQuoteState({ key, value: null, error: error.message || "Could not calculate the price." });
      });
    return () => controller.abort();
  }, [itemId, catalogue, loadState, sizeId, removalIds, extraIds, quantity]);

  useEffect(() => {
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKeydown(event) {
      if (event.key === "Escape") { event.preventDefault(); closeCallback.current?.(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const buttons = Array.from(dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled])'));
      if (!buttons.length) return;
      if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0].focus(); }
    }
    document.addEventListener("keydown", onKeydown);
    return () => { document.removeEventListener("keydown", onKeydown); document.body.style.overflow = prevOverflow; prevFocus?.focus?.(); };
  }, []);

  if (!item) return null;
  const toggle = (id, setter) => setter((previous) => (
    previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]
  ));
  const quoteReady = loadState === "ready" && quoteState.key === currentKey && Boolean(quoteState.value);
  const quote = quoteReady ? quoteState.value : null;
  const selectedSize = catalogue?.sizes?.find((size) => Number(size.id) === sizeId);
  const selectedExtras = catalogue?.extras?.filter((extra) => extraIds.includes(Number(extra.id))) || [];
  const selectedRemovals = catalogue?.removals?.filter((removal) => removalIds.includes(Number(removal.id))) || [];
  const submit = () => {
    if (!quote || adding) return;
    setAdding(true);
    try {
      onAddToBasket(item, quote);
    } finally {
      setAdding(false);
    }
  };

  return createPortal(
    <div className="pk-customise-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="pk-customise-dialog" role="dialog" aria-modal="true" aria-labelledby="pk-customise-title" ref={dialogRef}>
        <header className="pk-customise-header">
          <div>
            <button type="button" className="pk-customise-back" onClick={onBack}>← {backLabel}</button>
            <h2 id="pk-customise-title">Make it yours</h2>
          </div>
          <button type="button" ref={closeRef} className="pk-customise-close" aria-label="Close customisation" onClick={onClose}>×</button>
        </header>
        <div className="pk-customise-body">
          <div className="pk-customise-dish">
            <div className="pk-customise-art"><FoodCardIllustration name={item.itemName} /></div>
            <div>
              <div className="pk-customise-restaurant">{item.restaurantName || "Restaurant"}</div>
              <h3>{item.itemName}</h3>
              <p className="pk-customise-from-price">{loadState === "loading" ? "Checking price…" : formatStartingPrice(catalogue?.item?.basePrice ?? item.price, catalogue?.sizes)}</p>
            </div>
          </div>
          {loadState === "loading" && <p className="pk-customise-feedback" role="status">Loading your options…</p>}
          {loadState === "error" && <div className="pk-customise-feedback" role="alert">
            <p>{loadError}</p>
            <button type="button" className="pk-customise-retry" onClick={() => setReloadCount((value) => value + 1)}>Try again</button>
          </div>}
          {loadState === "ready" && catalogue && <>
            {catalogue.sizes?.length > 0 && <div className="pk-customise-section">
              <h3>Choose your size</h3>
              <p className="pk-customise-hint">Pick the size that suits your appetite.</p>
              <div className="pk-customise-size-grid">
                {catalogue.sizes.map((size) => (
                  <label className={`pk-customise-size${sizeId === Number(size.id) ? " is-selected" : ""}`} key={size.id}>
                    <input type="radio" name="pk-dish-size" value={size.id} checked={sizeId === Number(size.id)} onChange={() => setSizeId(Number(size.id))} />
                    <strong>{size.name}</strong>
                    <span>{pounds(size.price)}</span>
                    {size.isDefault && <small>Regular size</small>}
                  </label>
                ))}
              </div>
            </div>}
            <div className="pk-customise-section">
              <h3>Leave something out</h3>
              <p className="pk-customise-hint">Not a fan of something? Leave it out at no extra charge.</p>
              {catalogue.removals?.length ? <div className="pk-customise-option-list">
                {catalogue.removals.map((option) => <label className="pk-customise-option" key={option.id}>
                  <span><input type="checkbox" checked={removalIds.includes(Number(option.id))} onChange={() => toggle(Number(option.id), setRemovalIds)} /> No {option.name.toLowerCase()}</span>
                  <small>Included</small>
                </label>)}
              </div> : <p className="pk-customise-muted">No removable ingredients listed for this dish.</p>}
            </div>
            <div className="pk-customise-section">
              <h3>Fancy an extra?</h3>
              <p className="pk-customise-hint">Add something delicious to make it yours.</p>
              {catalogue.extras?.length ? <div className="pk-customise-option-list">
                {catalogue.extras.map((extra) => <label className="pk-customise-option" key={extra.id}>
                  <span><input type="checkbox" checked={extraIds.includes(Number(extra.id))} onChange={() => toggle(Number(extra.id), setExtraIds)} /> {extra.name}</span>
                  <small className="pk-customise-extra-price">+{pounds(extra.price)}</small>
                </label>)}
              </div> : <p className="pk-customise-muted">No extras listed for this dish.</p>}
            </div>
            <div className="pk-customise-section pk-customise-quantity">
              <div><h3>Quantity</h3><p className="pk-customise-hint">How many would you like?</p></div>
              <div className="pk-customise-stepper">
                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <strong aria-live="polite">{quantity}</strong>
                <button type="button" aria-label="Increase quantity" disabled={quantity >= 10} onClick={() => setQuantity((q) => Math.min(10, q + 1))}>+</button>
              </div>
            </div>
            {(selectedSize || selectedRemovals.length || selectedExtras.length) ? <p className="pk-customise-selection-summary">
              Your picks: {[selectedSize && `${selectedSize.name} size`, ...selectedRemovals.map((choice) => `No ${choice.name.toLowerCase()}`), ...selectedExtras.map((choice) => choice.name)].filter(Boolean).join(" · ")}
            </p> : null}
          </>}
          <p className="pk-customise-allergy-note">Removing an ingredient does not guarantee a dish is safe for allergies. Always confirm allergens with the restaurant.</p>
        </div>
        <footer className="pk-customise-footer">
          <span aria-live="polite">{quote ? `${quantity} × ${pounds(quote.unitPrice)}` : loadState === "error" ? "Price unavailable" : "Calculating price…"}</span>
          <button className="pk-customise-submit" type="button" disabled={!quoteReady || adding} onClick={submit}>
            {quote ? `Add ${quantity} to basket · ${pounds(quote.totalPrice)}` : loadState === "error" ? "Price unavailable" : "Updating price…"}
          </button>
          {quoteState.error && loadState === "ready" && <p className="pk-customise-quote-error" role="alert">{quoteState.error}</p>}
        </footer>
      </section>
    </div>, document.body
  );
}
