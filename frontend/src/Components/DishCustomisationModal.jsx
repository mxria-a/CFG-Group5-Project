import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FoodCardIllustration from "./FoodCardIllustration";
import { getDemoOptions } from "../utils/menuDiscovery";
import "./DishCustomisationModal.css";

const pounds = (amount) => `£${amount.toFixed(2)}`;
const validPrice = (amount) => amount !== "" && amount !== null && amount !== undefined && Number.isFinite(Number(amount));

export default function DishCustomisationModal({ item, onClose, onBack, onAddToBasket, backLabel = "Back to dish details" }) {
  const [removed, setRemoved] = useState([]);
  const [chosenExtras, setChosenExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  const options = useMemo(() => getDemoOptions(item), [item]);
  const basePrice = validPrice(item?.price) ? Number(item.price) : null;
  const extras = options.extras.filter((option) => chosenExtras.includes(option.id));
  const unitPrice = basePrice === null ? null : basePrice + extras.reduce((sum, option) => sum + option.price, 0);
  const isDemo = removed.length > 0 || extras.length > 0;

  useEffect(() => { setRemoved([]); setChosenExtras([]); setQuantity(1); }, [item?.itemID]);
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
  const toggle = (value, selected, setter) => setter(selected.includes(value) ? selected.filter((entry) => entry !== value) : [...selected, value]);
  const submit = () => {
    if (unitPrice === null) return;
    onAddToBasket(item, { removed, extras, quantity });
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
              <p>Base dish price: {basePrice === null ? "Unavailable" : pounds(basePrice)}</p>
            </div>
          </div>
          <div className="pk-customise-demo-disclaimer" role="note">
            <strong>Customisation preview · demo options</strong>
            <p>These removals, extras and extra prices are examples, not confirmed restaurant options. Customised demo items can be viewed in your basket but cannot be submitted at checkout yet.</p>
          </div>
          <div className="pk-customise-section">
            <h3>Leave something out</h3>
            <p className="pk-customise-hint">Not a fan of something? Test removing it. No price change.</p>
            {options.removals.length ? <div className="pk-customise-option-list">
              {options.removals.map((name) => <label className="pk-customise-option" key={name}>
                <span><input type="checkbox" checked={removed.includes(name)} onChange={() => toggle(name, removed, setRemoved)} /> No {name.toLowerCase()}</span>
                <small>Included</small>
              </label>)}
            </div> : <p className="pk-customise-muted">No sample ingredient removal options for this type of dish.</p>}
          </div>
          <div className="pk-customise-section">
            <h3>Fancy an extra?</h3>
            <p className="pk-customise-hint">Experiment with example add-ons and watch the price change.</p>
            {options.extras.length ? <div className="pk-customise-option-list">
              {options.extras.map((extra) => <label className="pk-customise-option" key={extra.id}>
                <span><input type="checkbox" checked={chosenExtras.includes(extra.id)} onChange={() => toggle(extra.id, chosenExtras, setChosenExtras)} /> {extra.name}</span>
                <small className="pk-customise-extra-price">+{pounds(extra.price)}</small>
              </label>)}
            </div> : <p className="pk-customise-muted">No sample extras for this type of dish.</p>}
          </div>
          <div className="pk-customise-section pk-customise-quantity">
            <div><h3>Quantity</h3><p className="pk-customise-hint">How many would you like?</p></div>
            <div className="pk-customise-stepper">
              <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <strong aria-live="polite">{quantity}</strong>
              <button type="button" aria-label="Increase quantity" disabled={quantity >= 10} onClick={() => setQuantity((q) => Math.min(10, q + 1))}>+</button>
            </div>
          </div>
          {(removed.length > 0 || extras.length > 0) && <p className="pk-customise-selection-summary">Your picks: {[
            ...removed.map((name) => `No ${name.toLowerCase()}`), ...extras.map((extra) => extra.name)
          ].join(" · ")}</p>}
          <p className="pk-customise-allergy-note">Removing an ingredient does not guarantee a dish is safe for allergies. Always confirm with the restaurant.</p>
        </div>
        <footer className="pk-customise-footer">
          <span>{unitPrice === null ? "Price unavailable" : `${quantity} × ${pounds(unitPrice)}${isDemo ? " · Demo price" : ""}`}</span>
          <button className="pk-customise-submit" type="button" disabled={unitPrice === null} onClick={submit}>
            Add {quantity} to basket · {unitPrice === null ? "—" : pounds(unitPrice * quantity)}
          </button>
        </footer>
      </section>
    </div>, document.body
  );
}
