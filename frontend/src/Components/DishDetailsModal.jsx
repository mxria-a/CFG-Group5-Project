import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FoodCardIllustration from "./FoodCardIllustration";
import { getDishCategory, pluralCategory } from "../utils/menuDiscovery";
import "./DishDetailsModal.css";

const available = (value) => value !== undefined && value !== null && String(value).trim() !== "";
const isNumber = (value) => available(value) && Number.isFinite(Number(value));
const textValue = (value) => Array.isArray(value) ? value.filter(available).join(", ") : String(value || "");
const formatPrice = (value) => isNumber(value) ? `£${Number(value).toFixed(2)}` : "Price unavailable";
const veganStatus = (value) => {
  if (!available(value)) return null;
  const normalized = String(value).toLowerCase();
  if (value === true || value === 1 || normalized === "1" || normalized === "true") return "Vegan";
  if (value === false || value === 0 || normalized === "0" || normalized === "false") return "Not vegan";
  return null;
};

/** Details shown here are taken directly from the selected backend item. */
export default function DishDetailsModal({ item, onClose, onAddToBasket, onCustomise, similarItems = [], onViewSimilar, onBrowseSimilar, onViewAllSimilar, onToggleCompare, selected, selectedCount, maxCompare = 3 }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [added, setAdded] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!item) return undefined;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = Array.from(dialogRef.current.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === "function") previouslyFocused.focus();
    };
  }, [item]);

  useEffect(() => { setAdded(false); setLimitReached(false); }, [item]);
  if (!item) return null;

  const handleCompare = () => {
    if (!selected && selectedCount >= maxCompare) {
      setLimitReached(true);
      return;
    }
    setLimitReached(false);
    onToggleCompare(item);
  };
  const handleBasket = () => { if (onCustomise) onCustomise(item); else { onAddToBasket?.(item); setAdded(true); } };
  const vegan = veganStatus(item.isVegan);
  const ingredients = available(item.ingredients) ? textValue(item.ingredients) : null;
  const allergens = available(item.allergens) ? textValue(item.allergens) : null;
  const description = available(item.description) ? textValue(item.description) : null;

  return createPortal(
    <div
      className="pk-detail-backdrop"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section className="pk-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="pk-detail-title" aria-describedby="pk-detail-subtitle" ref={dialogRef}>
        <button type="button" ref={closeRef} className="pk-detail-close" aria-label="Close dish details" onClick={onClose}>×</button>
        <div className="pk-detail-illustration">
          <span className="pk-detail-illustration-label">GOOD FOOD, BETTER CHOICES</span>
          <FoodCardIllustration name={item.itemName} />
          <span className="pk-detail-art-caption">Pickier illustration · not a product photo</span>
        </div>
        <div className="pk-detail-content">
          <p id="pk-detail-subtitle" className="pk-detail-restaurant">{item.restaurantName || "Restaurant"}</p>
          <h2 id="pk-detail-title">{item.itemName}</h2>
          <p className="pk-detail-price">{formatPrice(item.price)}</p>
          {description && <p className="pk-detail-description">{description}</p>}
          <div className="pk-detail-facts" aria-label="Dish information">
            {isNumber(item.deliveryTime) && <span><span aria-hidden="true">◷</span> {item.deliveryTime} mins delivery</span>}
            {isNumber(item.distance) && <span><span aria-hidden="true">⌖</span> {(Number(item.distance) * 0.621371).toFixed(1)} mi away</span>}
            {isNumber(item.avRating) && <span><span aria-hidden="true">★</span> {Number(item.avRating).toFixed(1)} rating</span>}
            {isNumber(item.calories) && <span><span aria-hidden="true">◉</span> {item.calories} kcal</span>}
            {vegan && <span><span aria-hidden="true">◈</span> {vegan}</span>}
          </div>
          <div className="pk-detail-info-section">
            <h3>What's in it?</h3>
            <p>{ingredients || "Ingredients haven't been provided for this dish."}</p>
          </div>
          <div className="pk-detail-info-section">
            <h3>Reported allergens</h3>
            <p>{allergens || "Allergen information hasn't been provided for this dish."}</p>
            <small>Please confirm allergens with the restaurant before ordering, especially if you have an allergy.</small>
          </div>
          <div className="pk-detail-similar pk-detail-info-section">
            <div className="pk-detail-similar-heading">
              <h3>More like this</h3>
              <span>SAME RESTAURANT</span>
            </div>
            {similarItems.length > 0 ? (
              <>
                <p className="pk-detail-similar-caption">Other dishes from {item.restaurantName || "this restaurant"}</p>
                <div className="pk-detail-similar-grid">
                  {similarItems.map((similar) => (
                    <button type="button" key={similar.itemID} className="pk-detail-similar-card" onClick={() => onViewSimilar?.(similar)} aria-label={`View details for ${similar.itemName}`}>
                      <span className="pk-detail-similar-art"><FoodCardIllustration name={similar.itemName} /></span>
                      <span className="pk-detail-similar-meta"><strong>{similar.itemName}</strong><small>{similar.price != null && Number.isFinite(Number(similar.price)) ? `£${Number(similar.price).toFixed(2)}` : "Price unavailable"}</small><em>View details ↗</em></span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="pk-detail-similar-empty">
                <span className="pk-detail-similar-empty-icon" aria-hidden="true">✳</span>
                <div>
                  <strong>No other matching dishes from this restaurant yet.</strong>
                  <p>We couldn't find another similar dish from {item.restaurantName || "this restaurant"} in the available menu.</p>
                  {onBrowseSimilar && <button type="button" className="pk-detail-similar-browse" onClick={onBrowseSimilar}>Explore other results →</button>}
                </div>
              </div>
            )}
          </div>
          {getDishCategory(item) && onViewAllSimilar && (
            <button type="button" className="pk-detail-view-all" onClick={onViewAllSimilar}>
              View all {pluralCategory(getDishCategory(item)).toLowerCase()} at {item.restaurantName || "this restaurant"}
              <span aria-hidden="true">→</span>
            </button>
          )}
          {limitReached && <p className="pk-detail-inline-note" role="alert">Full plate! 🍽️ You've already picked {maxCompare} dishes. Remove one to make room for this one.</p>}
          {added && <p className="pk-detail-added-note" role="status">✓ Added to your basket! You can add another if you'd like.</p>}
          <div className="pk-detail-actions">
            <button type="button" className={`pk-detail-compare${selected ? " is-selected" : ""}`} onClick={handleCompare} aria-pressed={selected}>
              {selected ? "✓ Remove from compare" : "+ Add to compare"}
            </button>
            <button type="button" className="pk-detail-basket" onClick={handleBasket}>{onCustomise ? "Customise & add to basket" : "Add to basket"} <span aria-hidden="true">↗</span></button>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}
