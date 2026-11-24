import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../Context/shop-context";
import RestaurantLogo from "../Components/RestaurantLogo";
import { buildBasketSummary, money } from "../utils/basketSummary";
import { getBasketLineDetails } from "../utils/basketLineDetails";
import { getLastSearch, saveLastSearch } from "../utils/searchSession";
import "./CheckoutPage.css";

const REQUIRED_FIELDS = ["fullName", "phone", "address", "city", "postcode"];
const DEFAULT_DETAILS = { fullName: "", phone: "", address: "", flat: "", city: "", postcode: "", instructions: "" };
function validateDetails(details) {
  const errors = {};
  REQUIRED_FIELDS.forEach((field) => {
    if (!details[field].trim()) errors[field] = "Please fill this in.";
  });
  if (details.phone.trim() && !/^\+?[\d()\s-]{10,30}$/.test(details.phone.trim())) {
    errors.phone = "Enter a valid contact number.";
  } else if (details.phone.replace(/\D/g, "").length < 10 && details.phone.trim()) {
    errors.phone = "Enter a valid contact number.";
  }
  if (details.postcode.trim() && !/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(details.postcode.trim())) {
    errors.postcode = "Enter a valid UK postcode.";
  }
  return errors;
}

function CheckoutSteps({ stage }) {
  return <div className="pk-checkout-steps" aria-label="Checkout progress">
    {["Basket", "Checkout", "Confirmation"].map((label, index) => {
      const number = index + 1;
      const classes = `pk-checkout-step ${stage === number ? "current" : stage > number ? "done" : ""}`;
      const content = <>
        <span className="pk-checkout-step-number">{stage > number ? "✓" : number}</span>{label}
        {number < 3 && <span aria-hidden="true" className="pk-checkout-step-line" />}
      </>;
      if (number === 1 && stage === 2) return <Link key={label} to="/basket" className={`${classes} pk-checkout-step-link`} aria-label="Return to basket">{content}</Link>;
      return <span key={label} className={classes} aria-current={stage === number ? "step" : undefined}>{content}</span>;
    })}
  </div>;
}

function CheckoutField({ name, label, value, onChange, error, optional = false, wide = false, ...props }) {
  return <div className={`pk-checkout-field${wide ? " wide" : ""}`}>
    <label htmlFor={`pk-checkout-${name}`}>{label} {!optional && <span className="pk-checkout-required">*</span>}</label>
    <input id={`pk-checkout-${name}`} name={name} value={value} onChange={(event) => onChange(name, event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `pk-checkout-${name}-error` : undefined} {...props} />
    {error && <span className="pk-checkout-error" id={`pk-checkout-${name}-error`} role="alert">{error}</span>}
  </div>;
}

function groupLineChoices(line) { return getBasketLineDetails(line); }

function DeliveryBikeIcon() {
  return <svg className="pk-checkout-bike-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M2 18V9h12v9M14 12h4l3 4v2h-1M7 6h6"/>
  </svg>;
}

function RestaurantOrder({ group, expanded, toggle }) {
  const count = group.items.reduce((sum, line) => sum + line.quantity, 0);
  const bodyId = `pk-checkout-group-${group.key.replace(/[^\w-]/g, "-")}`;
  return <section className="pk-checkout-restaurant">
    <div className="pk-checkout-restaurant-header">
      <RestaurantLogo name={group.restaurantName} />
      <span className="pk-checkout-restaurant-label"><strong>{group.restaurantName}</strong><small>{count} item{count === 1 ? "" : "s"}</small></span>
      <button type="button" className="pk-checkout-restaurant-toggle" aria-label={`${expanded ? "Hide details" : "See full details"} for ${group.restaurantName}`} aria-expanded={expanded} aria-controls={bodyId} onClick={toggle}>
        <span>{expanded ? "Hide details" : "See full details"}</span>
        <svg className="pk-checkout-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
      </button>
    </div>
    <div id={bodyId} className="pk-checkout-restaurant-body" hidden={!expanded}>
      {group.items.map((line) => <div className="pk-checkout-line" key={line.key}>
        <span className="pk-checkout-line-qty">{line.quantity}×</span>
        <div><strong>{line.itemName}</strong><small>{groupLineChoices(line).join(" · ") || "Ingredients not listed"}</small></div>
        <strong className="pk-checkout-line-price">{money(line.linePence)}</strong>
      </div>)}
    </div>
    <div className="pk-checkout-restaurant-delivery"><div className="pk-checkout-delivery"><span><DeliveryBikeIcon /> Delivery fee · {group.restaurantName}</span><strong>{money(group.deliveryFeePence)}</strong></div></div>
  </section>;
}

function FeeExplainer({ open, onClose }) {
  if (!open) return null;
  return <div id="pk-checkout-fee-details" className="pk-checkout-fee-popover" role="region" aria-label="How fees work">
    <div className="pk-checkout-fee-popover-title"><strong>How fees work</strong><button type="button" aria-label="Close fee explanation" onClick={onClose}>×</button></div>
    <div className="pk-checkout-fee-description"><span aria-hidden="true">↗</span><div><strong>Delivery fee</strong><p>Charged once per restaurant, not per dish. Each restaurant has its own estimated delivery fee.</p></div></div>
    <div className="pk-checkout-fee-description"><span aria-hidden="true">£</span><div><strong>Service fee</strong><p>One £1.49 estimated fee for your whole basket.</p></div></div>
    <p className="pk-checkout-fee-disclaimer">Delivery charges are estimates.</p>
  </div>;
}

function PaymentMethods({ method, onChange, card, onCardChange, sameBilling, onSameBillingChange, billingPostcode, onBillingPostcodeChange, billingError }) {
  const usingCard = method === "card";
  return <section className="pk-checkout-panel pk-checkout-payment" aria-labelledby="pk-checkout-payment-heading" id="pk-checkout-payment-section">
    <div className="pk-checkout-payment-header">
      <div><span className="pk-checkout-payment-kicker">PAY YOUR WAY</span><h2 id="pk-checkout-payment-heading">How would you like to pay?</h2><p>Choose your preferred payment method.</p></div>
    </div>
    <div className="pk-checkout-payment-methods" role="radiogroup" aria-label="Payment method">
      <button type="button" role="radio" aria-checked={usingCard} className={`pk-checkout-pay-option${usingCard ? " is-selected" : ""}`} onClick={() => onChange("card")}>
        <span className="pk-checkout-radio" aria-hidden="true"/><span className="pk-checkout-pay-symbol">▣</span><span className="pk-checkout-pay-name"><strong>Credit or debit card</strong><small>Visa, Mastercard and more</small></span><span className="pk-checkout-pay-brand" aria-hidden="true">VISA</span>
      </button>
      <button type="button" role="radio" aria-checked={!usingCard} className={`pk-checkout-pay-option${!usingCard ? " is-selected" : ""}`} onClick={() => onChange("wallet")}>
        <span className="pk-checkout-radio" aria-hidden="true"/><span className="pk-checkout-pay-symbol">◈</span><span className="pk-checkout-pay-name"><strong>Digital wallet</strong><small>Quick and easy checkout</small></span><span className="pk-checkout-pay-brand wallet" aria-hidden="true">WALLET</span>
      </button>
    </div>
    {usingCard ? <div className="pk-checkout-payment-detail">
      <div className="pk-checkout-payment-detail-head"><strong>Choose a card</strong><span>Saved cards</span></div>
      <div className="pk-checkout-saved-cards">
        {[{ id:"visa", brand:"Visa", last:"4242", expires:"12/28" },{ id:"mastercard", brand:"Mastercard", last:"4444", expires:"06/29" }].map((option) =>
          <button type="button" key={option.id} className={`pk-checkout-saved-card${card===option.id ? " is-selected" : ""}`} aria-pressed={card===option.id} onClick={() => onCardChange(option.id)}>
            <span className="pk-checkout-saved-mark">{option.brand === "Visa" ? "V" : "M"}</span><span><strong>{option.brand} •••• {option.last}</strong><small>Expires {option.expires}</small></span><span className="pk-checkout-radio" aria-hidden="true" />
          </button>)}
      </div>
      <label className="pk-checkout-billing-toggle"><input type="checkbox" checked={sameBilling} onChange={(event) => onSameBillingChange(event.target.checked)} /><span>Billing address is the same as delivery</span></label>
      {!sameBilling && <div className="pk-checkout-billing-other"><label htmlFor="pk-checkout-billing-postcode">Billing postcode</label><input id="pk-checkout-billing-postcode" value={billingPostcode} aria-invalid={billingError} aria-describedby={billingError ? "pk-checkout-billing-error" : undefined} onChange={(event) => onBillingPostcodeChange(event.target.value)} maxLength={12} placeholder="e.g. E1 6AN" autoComplete="off" />{billingError && <span className="pk-checkout-error" id="pk-checkout-billing-error" role="alert">Enter a valid UK billing postcode.</span>}</div>}
    </div> : <div className="pk-checkout-wallet-detail"><span aria-hidden="true">◈</span><div><strong>Digital wallet selected</strong><p>You'll see this payment method in your order summary.</p></div></div>}
    <p className="pk-checkout-payment-demo-note">Payment options are illustrative; no charge is made. Don't enter real card details.</p>
  </section>;
}

function CheckoutConfirmation({ confirmation, onExplore }) {
  const { details, preference, summary, paymentMethod, paymentCard } = confirmation;
  const address = [details.address, details.flat, details.city, details.postcode.toUpperCase()].filter(Boolean).join(", ");
  const paymentName = paymentMethod === "wallet" ? "Digital wallet" : paymentCard === "mastercard" ? "Mastercard ending 4444" : "Visa ending 4242";
  return <div className="pk-checkout-confirmation">
    <CheckoutSteps stage={3} />
    <section className="pk-checkout-success">
      <div className="pk-checkout-success-sparkle one" aria-hidden="true">✦</div><div className="pk-checkout-success-sparkle two" aria-hidden="true">✧</div>
      <span className="pk-checkout-success-ring" aria-hidden="true">✓</span>
      <div className="pk-checkout-eyebrow">YOU'RE ALL SET</div>
      <h1>Looking good!</h1>
      <p>Everything is in place. Here's a look at your order details.</p>
      <button type="button" className="pk-checkout-explore-action" onClick={onExplore}>Browse more dishes</button>
    </section>
    <div className="pk-checkout-confirm-grid">
      <section className="pk-checkout-confirm-card"><div className="pk-checkout-confirm-card-title"><span aria-hidden="true">⌖</span><h2>Delivering to</h2></div><p><strong>{details.fullName}</strong><br />{address}</p><div className="pk-checkout-confirm-row"><span>Delivery preference</span><strong>{preference}</strong></div>{details.instructions && <div className="pk-checkout-confirm-instructions"><span>Delivery instructions</span><p>{details.instructions}</p></div>}</section>
      <section className="pk-checkout-confirm-card"><div className="pk-checkout-confirm-card-title"><span aria-hidden="true">▣</span><h2>Payment</h2></div><p><strong>{paymentName}</strong></p><p className="pk-checkout-confirm-muted">Selected payment method</p><div className="pk-checkout-confirm-row"><span>Order total</span><strong className="pk-checkout-confirm-highlight">{money(summary.totalPence)}</strong></div></section>
    </div>
    <section className="pk-checkout-confirm-items"><div className="pk-checkout-confirm-items-heading"><h2>Your order</h2><span>{summary.itemCount} item{summary.itemCount===1?"":"s"} · {summary.groups.length} restaurant{summary.groups.length===1?"":"s"}</span></div>
      {summary.groups.map((group) => <div className="pk-checkout-confirm-group" key={group.key}><div className="pk-checkout-confirm-group-heading"><RestaurantLogo name={group.restaurantName}/><strong>{group.restaurantName}</strong></div>{group.items.map((line)=><div key={line.key} className="pk-checkout-confirm-line"><span className="pk-checkout-confirm-quantity">{line.quantity}×</span><div><strong>{line.itemName}</strong><small>{groupLineChoices(line).join(" · ") || "Ingredients not listed"}</small></div><b>{money(line.linePence)}</b></div>)}<div className="pk-checkout-confirm-delivery"><span>Delivery</span><strong>{money(group.deliveryFeePence)}</strong></div></div>)}
      <div className="pk-checkout-confirm-costs"><div><span>Food subtotal</span><strong>{money(summary.foodSubtotalPence)}</strong></div><div><span>Delivery fees</span><strong>{money(summary.deliveryFeesPence)}</strong></div><div><span>Service fee</span><strong>{money(summary.serviceFeePence)}</strong></div><div className="pk-checkout-confirm-grandtotal"><span>Estimated total</span><strong>{money(summary.totalPence)}</strong></div></div>
    </section>
  </div>;
}

export default function CheckoutPage() {
  const { basketItems, demoCustomLines = {}, foodList = [], clearBasket } = useContext(StoreContext);
  const navigate = useNavigate();
  const summary = buildBasketSummary(foodList, basketItems, demoCustomLines);
  const [details, setDetails] = useState(DEFAULT_DETAILS);
  const [errors, setErrors] = useState({});
  const [preference, setPreference] = useState("Hand it to me");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [feeOpen, setFeeOpen] = useState(false);
  const [feePinned, setFeePinned] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [processing, setProcessing] = useState(false);
  const processingTimer = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentCard, setPaymentCard] = useState("visa");
  const [sameBilling, setSameBilling] = useState(true);
  const [billingPostcode, setBillingPostcode] = useState("");
  const [billingError, setBillingError] = useState(false);

  const feeAnchorRef = useRef(null);
  useEffect(() => () => window.clearTimeout(processingTimer.current), []);

  useEffect(() => {
    if (!feeOpen) return undefined;
    const onOutside = (event) => { if (!feeAnchorRef.current?.contains(event.target)) { setFeeOpen(false); setFeePinned(false); } };
    const onEscape = (event) => { if (event.key === "Escape") { setFeeOpen(false); setFeePinned(false); } };
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onEscape);
    return () => { document.removeEventListener("pointerdown", onOutside); document.removeEventListener("keydown", onEscape); };
  }, [feeOpen]);

  const updateField = (name, value) => {
    setDetails((before) => ({ ...before, [name]: value }));
    setErrors((before) => ({ ...before, [name]: undefined }));
  };
  const submitPreview = (event) => {
    event.preventDefault();
    if (processing) return;
    const validationErrors = validateDetails(details);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      document.getElementById(`pk-checkout-${REQUIRED_FIELDS.find((field) => validationErrors[field])}`)?.focus();
      return;
    }
    if (!summary.itemCount) return;
    if (paymentMethod === "card" && !sameBilling && !/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(billingPostcode.trim())) {
      setBillingError(true);
      document.getElementById("pk-checkout-billing-postcode")?.focus();
      return;
    }
    const completedOrder = { details: { ...details }, preference, summary, paymentMethod, paymentCard };
    setProcessing(true);
    window.scrollTo?.({ top: 0, behavior: "instant" });
    processingTimer.current = window.setTimeout(() => {
      setConfirmation(completedOrder);
      clearBasket();
      setProcessing(false);
      window.scrollTo?.({ top: 0, behavior: "instant" });
    }, 4000);
  };

  const browseMoreDishes = () => {
    // Keep the delivery postcode, but start a fresh search across all food categories.
    const latestSearch = getLastSearch();
    if (latestSearch) saveLastSearch({ item: "", postcode: latestSearch.postcode });
    navigate("/");
  };

  if (confirmation) return <main className="pk-checkout"><CheckoutConfirmation confirmation={confirmation} onExplore={browseMoreDishes} /></main>;
  if (processing) return <main className="pk-checkout pk-checkout-processing" role="status" aria-live="polite" aria-label="Preparing order confirmation">
    <section className="pk-checkout-processing-panel">
      <div className="pk-checkout-processing-icon" aria-hidden="true"><span>🍽️</span><i/><i/><i/></div>
      <span className="pk-checkout-payment-kicker">ALMOST DONE</span>
      <h1>Getting things ready...</h1>
      <p>Putting the finishing touches on your order.</p>
      <div className="pk-checkout-processing-track" aria-hidden="true"><span /></div>
    </section>
  </main>;
  if (!summary.itemCount) return <main className="pk-checkout pk-checkout-empty"><h1>Your basket is empty.</h1><p>Find something delicious before checking out.</p><button className="pk-checkout-primary" onClick={() => navigate("/")}>Explore food →</button></main>;

  return <main className="pk-checkout">
    <div className="pk-checkout-eyebrow">ONE LAST CHECK</div>
    <div className="pk-checkout-intro"><div><h1>Almost there.</h1><p>Just your delivery details, then we're ready.</p></div></div>
    <CheckoutSteps stage={2} />
    <div className="pk-checkout-columns">
      <div className="pk-checkout-form-column">
        <section className="pk-checkout-panel pk-checkout-form-panel">
          <div className="pk-checkout-panel-heading"><h2><span aria-hidden="true">⌖</span> Delivery details</h2></div>
          <p className="pk-checkout-muted">Where should we send your food?</p>
          <form id="pk-checkout-delivery-form" onSubmit={submitPreview} noValidate>
            <div className="pk-checkout-fields">
              <CheckoutField name="fullName" label="Full name" value={details.fullName} error={errors.fullName} onChange={updateField} autoComplete="name" placeholder="Your full name" maxLength={90} />
              <CheckoutField name="phone" label="Phone number" value={details.phone} error={errors.phone} onChange={updateField} type="tel" autoComplete="tel" placeholder="07..." maxLength={30} />
              <CheckoutField name="address" label="Address line 1" value={details.address} error={errors.address} onChange={updateField} autoComplete="address-line1" placeholder="House number and street" maxLength={130} wide />
              <CheckoutField name="flat" label="Flat / building (optional)" value={details.flat} onChange={updateField} autoComplete="address-line2" placeholder="Flat, floor, building" maxLength={90} optional />
              <CheckoutField name="city" label="Town or city" value={details.city} error={errors.city} onChange={updateField} autoComplete="address-level2" placeholder="London" maxLength={90} />
              <CheckoutField name="postcode" label="Postcode" value={details.postcode} error={errors.postcode} onChange={updateField} autoComplete="postal-code" placeholder="E.g. E1 6AN" maxLength={12} wide />
            </div>
            <h3 className="pk-checkout-subhead">Delivery preference</h3>
            <div className="pk-checkout-choices" role="group" aria-label="Delivery preference">
              {["Hand it to me", "Leave at the door"].map((choice) => <button type="button" key={choice} aria-pressed={choice === preference} className="pk-checkout-choice" onClick={() => setPreference(choice)}><span className="pk-checkout-radio" aria-hidden="true" />{choice}</button>)}
            </div>
            <div className="pk-checkout-field pk-checkout-instructions"><label htmlFor="pk-checkout-instructions">Delivery instructions <span className="pk-checkout-optional">(optional)</span></label><textarea id="pk-checkout-instructions" value={details.instructions} onChange={(event) => updateField("instructions", event.target.value)} maxLength={400} placeholder="Any directions to help your delivery arrive smoothly?" /></div>
            <p className="pk-checkout-form-hint">Your delivery preference will appear on your confirmation.</p>
          </form>
        </section>
        <PaymentMethods method={paymentMethod} onChange={setPaymentMethod} card={paymentCard} onCardChange={setPaymentCard} sameBilling={sameBilling} onSameBillingChange={(value) => { setSameBilling(value); setBillingError(false); }} billingPostcode={billingPostcode} onBillingPostcodeChange={(value) => { setBillingPostcode(value); setBillingError(false); }} billingError={billingError} />
      </div>
      <aside className="pk-checkout-summary-column" aria-label="Your order and charges">
        <div className="pk-checkout-summary-sticky">
        <section className="pk-checkout-order-review" aria-label="Your order">
          <div className="pk-checkout-summary-heading"><h2>Your order</h2><span>{summary.itemCount} item{summary.itemCount === 1 ? "" : "s"} · {summary.groups.length} restaurant{summary.groups.length === 1 ? "" : "s"}</span></div>
          <div className="pk-checkout-restaurants">
            {summary.groups.map((group) => <RestaurantOrder key={group.key} group={group} expanded={expandedGroups[group.key] === true} toggle={() => setExpandedGroups((prev) => ({ ...prev, [group.key]: !prev[group.key] }))} />)}
          </div>
        </section>
        <section className="pk-checkout-price-box">
          <div ref={feeAnchorRef} className="pk-checkout-price-heading" onMouseLeave={() => { if (!feePinned) setFeeOpen(false); }} onBlur={(event) => { if (!feePinned && !feeAnchorRef.current?.contains(event.relatedTarget)) setFeeOpen(false); }}>
            <h3>Price summary</h3><button type="button" className="pk-checkout-help" aria-label="How fees work" aria-expanded={feeOpen} aria-controls="pk-checkout-fee-details" onMouseEnter={() => setFeeOpen(true)} onFocus={() => setFeeOpen(true)} onClick={() => { const pinned = !feePinned; setFeePinned(pinned); setFeeOpen(pinned); }}>i</button>
            <FeeExplainer open={feeOpen} onClose={() => { setFeeOpen(false); setFeePinned(false); }} />
          </div>
          <div className="pk-checkout-price-line"><span>Food subtotal</span><strong>{money(summary.foodSubtotalPence)}</strong></div>
          <div className="pk-checkout-price-line"><span>Delivery fees · {summary.groups.length} restaurant{summary.groups.length === 1 ? "" : "s"}</span><strong>{money(summary.deliveryFeesPence)}</strong></div>
          <div className="pk-checkout-price-line"><span>Service fee</span><strong>{money(summary.serviceFeePence)}</strong></div>
          <div className="pk-checkout-price-total"><span>Estimated total</span><strong>{money(summary.totalPence)}</strong></div>
          <button type="submit" form="pk-checkout-delivery-form" className="pk-checkout-primary">Pay now</button>
        </section>
        </div>
      </aside>
    </div>
  </main>;
}
