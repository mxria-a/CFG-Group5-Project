import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/shop-context";
import DishCustomisationModal from "../../Components/DishCustomisationModal";
import FoodCardIllustration from "../../Components/FoodCardIllustration";
import RestaurantLogo from "../../Components/RestaurantLogo";
import { buildBasketSummary, money } from "../../utils/basketSummary";
import { getBasketLineDetails } from "../../utils/basketLineDetails";
import "./basket.css";

function BasketLine({ line, onQuantity, onEdit, onRemove }) {
  const choices = getBasketLineDetails(line);
  return (
    <article className="pk-basket-line">
      <div className="pk-basket-art" aria-hidden="true"><FoodCardIllustration name={line.itemName} /></div>
      <div className="pk-basket-description">
        <h3>{line.itemName}</h3>
        {choices.length ? <div className="pk-basket-choices">{choices.map((choice, i) => <span key={`${i}:${choice}`} className="pk-basket-chip">{choice}</span>)}</div>
          : <p className="pk-basket-plain">Ingredients not listed</p>}
        <div className="pk-basket-item-actions">
          <button type="button" onClick={() => onEdit(line)}>Edit choices</button>
          <button type="button" className="pk-basket-remove-link" onClick={() => onRemove(line)}>Remove</button>
        </div>
      </div>
      <div className="pk-basket-line-right">
        <strong className="pk-basket-line-price">{money(line.linePence)}</strong>
        <span className="pk-basket-unit-price">{money(line.unitPence)} each</span>
        <div className="pk-basket-stepper" aria-label={`${line.itemName} quantity`}>
          <button type="button" aria-label={`Decrease quantity of ${line.itemName}`} onClick={() => onQuantity(line, -1)}>−</button>
          <span aria-live="polite">{line.quantity}</span>
          <button type="button" aria-label={`Increase quantity of ${line.itemName}`} disabled={line.quantity >= 10} onClick={() => onQuantity(line, 1)}>+</button>
        </div>
      </div>
    </article>
  );
}

function ConfirmRemove({ line, onCancel, onConfirm }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();
    const onKeyDown = (event) => { if (event.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [onCancel]);
  return <div className="pk-basket-confirm-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
    <section role="alertdialog" aria-modal="true" aria-labelledby="pk-basket-confirm-title" aria-describedby="pk-basket-confirm-copy" className="pk-basket-confirm">
      <div className="pk-basket-confirm-symbol" aria-hidden="true">✕</div>
      <h2 id="pk-basket-confirm-title">Remove this item?</h2>
      <p id="pk-basket-confirm-copy">Are you sure you want to remove <strong>{line.itemName}</strong> from your basket? You can always add it again.</p>
      <div className="pk-basket-confirm-actions">
        <button ref={cancelRef} className="pk-basket-cancel" type="button" onClick={onCancel}>Keep item</button>
        <button className="pk-basket-confirm-remove" type="button" onClick={onConfirm}>Remove item</button>
      </div>
    </section>
  </div>;
}

export default function Basket() {
  const {
    basketItems, demoCustomLines = {}, foodList = [], addToBasket, removeFromBasket,
    removeItemFromBasket, changeDemoCustomQuantity, removeDemoCustomLine,
    addQuotedCustomLine, replaceQuotedCustomLine,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const summary = buildBasketSummary(foodList, basketItems, demoCustomLines);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [editing, setEditing] = useState(null);
  const [feesOpen, setFeesOpen] = useState(false);
  const [feesPinned, setFeesPinned] = useState(false);
  const feeAreaRef = useRef(null);

  useEffect(() => {
    if (!feesPinned) return undefined;
    const onOutside = (event) => { if (!feeAreaRef.current?.contains(event.target)) { setFeesPinned(false); setFeesOpen(false); } };
    const onKey = (event) => { if (event.key === "Escape") { setFeesPinned(false); setFeesOpen(false); } };
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onOutside); document.removeEventListener("keydown", onKey); };
  }, [feesPinned]);

  const changeQuantity = (line, delta) => {
    if (delta < 0 && line.quantity === 1) { setRemoveTarget(line); return; }
    if (delta > 0 && line.quantity >= 10) return;
    if (line.type === "custom") changeDemoCustomQuantity(line.key, delta);
    else if (delta > 0) addToBasket(line.itemID);
    else removeFromBasket(line.itemID);
  };
  const removeConfirmed = () => {
    if (!removeTarget) return;
    if (removeTarget.type === "custom") removeDemoCustomLine(removeTarget.key);
    else removeItemFromBasket(removeTarget.itemID);
    setRemoveTarget(null);
  };
  const openEdit = (line) => {
    const item = foodList.find((record) => Number(record.itemID) === line.itemID) || {
      itemID: line.itemID, itemName: line.itemName, restaurantName: line.restaurantName,
      restaurantID: line.restaurantID, price: line.unitPence / 100,
    };
    const original = line.type === "custom" ? demoCustomLines[line.key] : null;
    setEditing({ line, item, initialSelection: original || { quantity: line.quantity } });
  };
  const saveEdit = (item, quote) => {
    if (!editing) return;
    const success = editing.line.type === "custom"
      ? replaceQuotedCustomLine(editing.line.key, item, quote)
      : addQuotedCustomLine(item, quote);
    if (!success) return;
    if (editing.line.type === "standard") removeItemFromBasket(editing.line.itemID);
    setEditing(null);
  };

  if (!summary.itemCount) return <main className="pk-basket pk-basket-is-empty">
    <div className="pk-basket-eyebrow">YOUR CRAVINGS</div>
    <div className="pk-basket-heading"><div><h1>Your basket.</h1><p>A little empty right now. Very easy to fix.</p></div></div>
    <section className="pk-basket-empty">
      <div className="pk-basket-empty-art" aria-hidden="true">
        <svg viewBox="0 0 245 195" focusable="false" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="121" cy="129" rx="90" ry="39" fill="#3a222b"/>
          <ellipse cx="120" cy="107" rx="84" ry="62" fill="#f9eee2"/>
          <ellipse cx="120" cy="107" rx="63" ry="45" fill="#eadad2"/>
          <ellipse cx="120" cy="107" rx="50" ry="35" fill="#fff3e6"/>
          <path d="M105 119q-15-30 12-46 31-10 32 19-3 16-25 37-12 6-19-10" fill="#ff5358"/>
          <path d="M121 75q-1-20 15-23" fill="none" stroke="#34795b" strokeWidth="8" strokeLinecap="round"/>
          <path d="M132 54q18-14 27 3-9 9-27-3" fill="#69a85b"/>
          <path d="M33 39l4 9 9 4-9 3-4 10-4-10-9-3 9-4zM201 67l3 7 8 3-8 3-3 7-3-7-7-3z" fill="#ffc93c"/>
        </svg>
      </div>
      <h2>Your basket’s feeling a little hungry.</h2>
      <p>Something delicious is just a search away. Your next craving is waiting to be discovered.</p>
      <button type="button" className="pk-basket-primary" onClick={() => navigate("/")}>Explore food →</button>
    </section>
  </main>;

  return <main className="pk-basket">
    <div className="pk-basket-eyebrow">YOUR CRAVINGS</div>
    <div className="pk-basket-heading"><div><h1>Your basket.</h1><p>Everything you're craving, just how you like it.</p></div><span className="pk-basket-count">{summary.itemCount} item{summary.itemCount === 1 ? "" : "s"} · {summary.groups.length} restaurant{summary.groups.length === 1 ? "" : "s"}</span></div>
    <div className="pk-basket-steps" aria-label="Checkout progress"><strong><span>1</span> Basket</strong><i/><span><b>2</b> Checkout</span><i/><span><b>3</b> Confirmation</span></div>
    <div className="pk-basket-grid">
      <section className="pk-basket-restaurants" aria-label="Items by restaurant">
        {summary.groups.map((group) => <section className="pk-basket-restaurant" key={group.key}>
          <header className="pk-basket-restaurant-header"><RestaurantLogo name={group.restaurantName} /><div><h2>{group.restaurantName}</h2><p>{group.items.reduce((sum, line) => sum + line.quantity, 0)} item{group.items.reduce((sum, line) => sum + line.quantity, 0) === 1 ? "" : "s"}</p></div></header>
          {group.items.map((line) => <BasketLine key={line.key} line={line} onQuantity={changeQuantity} onEdit={openEdit} onRemove={setRemoveTarget}/>)}
          <div className="pk-basket-delivery"><span><span aria-hidden="true">🛵</span> Delivery fee · {group.restaurantName}</span><strong>{money(group.deliveryFeePence)}</strong></div>
        </section>)}
      </section>
      <aside className="pk-basket-totals" aria-label="Price summary">
        <div className="pk-basket-summary-title" ref={feeAreaRef} onMouseLeave={() => { if (!feesPinned) setFeesOpen(false); }} onBlur={(event) => { if (!feeAreaRef.current?.contains(event.relatedTarget) && !feesPinned) setFeesOpen(false); }}>
          <h2>Price summary</h2>
          <button type="button" className="pk-basket-fee-info" aria-expanded={feesOpen} aria-controls="pk-basket-fees-info" aria-label="How fees work" onMouseEnter={() => setFeesOpen(true)} onFocus={() => setFeesOpen(true)} onClick={() => { const next = !feesPinned; setFeesPinned(next); setFeesOpen(next); }}>i</button>
          {feesOpen && <div id="pk-basket-fees-info" className="pk-basket-tooltip" role="status"><button type="button" aria-label="Close fee information" onClick={() => { setFeesOpen(false); setFeesPinned(false); }}>×</button><strong>How fees work</strong><p><b>Delivery fees</b> are estimated separately for each restaurant in your basket.</p><p><b>Service fee</b> is a single estimated charge for your basket, not per restaurant.</p></div>}
        </div>
        <div className="pk-basket-summary-row"><span>Food subtotal</span><strong>{money(summary.foodSubtotalPence)}</strong></div>
        <div className="pk-basket-summary-row"><span>Delivery fees · {summary.groups.length} restaurant{summary.groups.length === 1 ? "" : "s"}</span><strong>{money(summary.deliveryFeesPence)}</strong></div>
        <div className="pk-basket-summary-row"><span>Service fee</span><strong>{money(summary.serviceFeePence)}</strong></div>
        <div className="pk-basket-total"><span>Estimated total</span><strong>{money(summary.totalPence)}</strong></div>
        <button type="button" className="pk-basket-primary" onClick={() => navigate("/checkout")}>Go to checkout</button>
      </aside>
    </div>
    {removeTarget && <ConfirmRemove line={removeTarget} onCancel={() => setRemoveTarget(null)} onConfirm={removeConfirmed}/>}
    {editing && <DishCustomisationModal key={editing.line.key} item={editing.item} initialSelection={editing.initialSelection} onClose={() => setEditing(null)} submitLabel="Save" onAddToBasket={saveEdit}/>}
  </main>;
}
