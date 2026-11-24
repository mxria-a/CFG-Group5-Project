import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../Context/shop-context";
import "./BasketAddedToast.css";

export default function BasketAddedToast() {
  const { basketToast, clearBasketToast } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!basketToast) return undefined;
    const timeout = window.setTimeout(clearBasketToast, 4500);
    return () => window.clearTimeout(timeout);
  }, [basketToast, clearBasketToast]);

  if (!basketToast) return null;
  const { quantity, name, price } = basketToast;
  const formattedPrice = Number.isFinite(Number(price)) && price != null
    ? ` · £${Number(price).toFixed(2)}` : "";
  return <aside className="pk-added-toast" role="status" aria-live="polite">
    <span className="pk-added-toast-check" aria-hidden="true">✓</span>
    <span className="pk-added-toast-copy">
      <strong>Added to your basket!</strong>
      <span>{quantity} × {name}{formattedPrice}</span>
    </span>
    <button className="pk-added-toast-view" type="button" onClick={() => { clearBasketToast(); navigate("/basket"); }}>View basket →</button>
    <button className="pk-added-toast-close" type="button" aria-label="Dismiss notification" onClick={clearBasketToast}>×</button>
  </aside>;
}
