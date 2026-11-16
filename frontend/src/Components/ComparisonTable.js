import React, { useContext, useEffect, useMemo, useState } from "react";
import FoodCardIllustration from "./FoodCardIllustration";
import RestaurantLogo from "./RestaurantLogo";
import { getItemComparablePrice, getItemDisplayPrice } from "../utils/menuDisplayPrice";
import { StoreContext } from "../Context/shop-context";
import "./ComparisonTable.css";

const PALETTE = ["#C93F45", "#2F6B4F", "#7A4A8C"];

const hasValue = (value) => value !== null && value !== undefined && String(value).trim() !== "";
const hasNumber = (value) => hasValue(value) && Number.isFinite(Number(value));
const formattedMinutes = (minutes) => hasNumber(minutes) ? `${Number(minutes)} mins` : "Not available";
const formattedRating = (rating) => hasNumber(rating) ? Number(rating).toFixed(1) : "Not available";
const formattedMiles = (distance) => hasNumber(distance) ? `${(Number(distance) * 0.621371).toFixed(1)} mi` : "Not available";
const formattedCalories = (calories) => hasNumber(calories) ? `${Number(calories).toLocaleString("en-GB")} kcal` : "Not provided";

const getDietaryStatus = (value) => {
  if (!hasValue(value)) return null;
  const normalized = String(value).toLowerCase();
  if (value === true || value === 1 || normalized === "true" || normalized === "1") return true;
  if (value === false || value === 0 || normalized === "false" || normalized === "0") return false;
  return null;
};

const ingredientList = (value) => {
  if (!hasValue(value)) return [];
  const pieces = Array.isArray(value) ? value : String(value).split(/[,;]+/);
  return pieces.map((part) => String(part).trim()).filter(Boolean);
};

const getWinners = (items, field, direction = "min") => {
  const withValues = items.filter((item) => hasNumber(field === "price" ? getItemComparablePrice(item) : item[field]));
  if (withValues.length < 2) return [];
  const numbers = withValues.map((item) => Number(field === "price" ? getItemComparablePrice(item) : item[field]));
  const target = direction === "max" ? Math.max(...numbers) : Math.min(...numbers);
  return withValues.filter((item) => Number(field === "price" ? getItemComparablePrice(item) : item[field]) === target).map((item) => item.itemID);
};

function FactTile({ label, value, highlighted = false, highlightLabel, icon, fullWidth = false }) {
  return (
    <div className={`pk-showdown-fact${highlighted ? " is-highlighted" : ""}${fullWidth ? " is-wide" : ""}`}>
      <span className="pk-showdown-fact-label"><span aria-hidden="true">{icon}</span> {label}</span>
      <strong>{value}</strong>
      {highlighted && <small>{highlightLabel}</small>}
    </div>
  );
}

function IngredientSection({ label, values, itemID, expandable = false, expanded, onToggle }) {
  const shouldCollapse = expandable && values.length > 4;
  const displayed = shouldCollapse && !expanded ? values.slice(0, 4) : values;
  const listID = `pk-showdown-ingredients-${itemID}`;
  const emptyMessage = label === "Reported allergens"
    ? "Allergen information unavailable"
    : "Ingredient information unavailable";

  return (
    <div className="pk-showdown-info" data-testid={expandable ? `ingredients-${itemID}` : undefined}>
      <h3>{label}</h3>
      {values.length ? (
        <div className="pk-showdown-tags" id={listID}>
          {displayed.map((entry, i) => <span key={`${entry}-${i}`}>{entry}</span>)}
        </div>
      ) : <p className="pk-showdown-unknown">{emptyMessage}</p>}
      {shouldCollapse && (
        <button
          type="button"
          className="pk-showdown-view-more"
          aria-controls={listID}
          aria-expanded={Boolean(expanded)}
          onClick={onToggle}
        >
          {expanded ? "Show fewer" : "View all ingredients"}
        </button>
      )}
    </div>
  );
}

const ComparisonTable = ({ items = [], onSelectWinner, onCustomiseDish }) => {
  const { addToBasket } = useContext(StoreContext);
  const [expandedIngredients, setExpandedIngredients] = useState({});
  const [basketNotice, setBasketNotice] = useState(null);

  const winners = useMemo(() => ({
    price: getWinners(items, "price"),
    delivery: getWinners(items, "deliveryTime"),
    rating: getWinners(items, "avRating", "max"),
  }), [items]);

  useEffect(() => {
    if (!basketNotice) return undefined;
    const timer = window.setTimeout(() => setBasketNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [basketNotice]);

  const chooseDish = (item) => {
    if (onCustomiseDish) { onCustomiseDish(item); return; }
    addToBasket(item.itemID);
    if (onSelectWinner) onSelectWinner(item);
    setBasketNotice({ name: item.itemName, time: Date.now() });
  };

  const highlightSummary = [
    { field: "price", text: "Lowest starting price", icon: "◇" },
    { field: "delivery", text: "Fastest delivery", icon: "◷" },
    { field: "rating", text: "Top rated", icon: "☆" },
  ];

  const winnerItems = (ids) => items.filter((item) => ids.includes(item.itemID));

  if (!items.length) return <div className="pk-showdown-empty">No dishes selected for comparison.</div>;

  return (
    <section className="pk-showdown" aria-labelledby="pk-showdown-heading">
      <header className="pk-showdown-heading-area">
        <h1 id="pk-showdown-heading">The showdown</h1>
        <p>{items.length} dishes side by side · Your picks, your decision</p>
        <div className="pk-showdown-insights" role="region" aria-label="At a glance">
          <h2 className="pk-showdown-insights-heading">
            At a glance <span>· The standouts from your picks</span>
          </h2>
          <div className="pk-showdown-insights-list">
            {highlightSummary.map(({ field, text, icon }) => {
              const selectedWinners = winnerItems(winners[field]);
              return (
                <div className="pk-showdown-insight" key={field}>
                  <span className="pk-showdown-insight-label">
                    <span aria-hidden="true">{icon}</span>
                    {selectedWinners.length > 1 ? `Joint ${text.toLowerCase()}` : text}
                  </span>
                  {selectedWinners.length ? (
                    <div className="pk-showdown-insight-dishes">
                      {selectedWinners.map((item) => (
                        <div className="pk-showdown-insight-dish" key={item.itemID}>
                          <strong>{item.itemName || "Unnamed dish"}</strong>
                          <span className="pk-showdown-insight-restaurant">
                            {item.restaurantName || "Restaurant unavailable"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : <strong>Not enough data</strong>}
                </div>
              );
            })}
          </div>
          <p className="pk-showdown-explainer">
            Based on available starting prices, estimated delivery times and ratings. No overall winner — that's your call.
          </p>
        </div>
      </header>

      <div className={`pk-showdown-grid ${items.length === 2 ? "has-two" : ""}`}>
        {items.map((item, index) => {
          const ingredients = ingredientList(item.ingredients);
          const allergens = ingredientList(item.allergens);
          const vegan = getDietaryStatus(item.isVegan);
          const isExpanded = !!expandedIngredients[item.itemID];
          return (
            <article className="pk-showdown-card" key={item.itemID}>
              <div className="pk-showdown-restaurant">
                <RestaurantLogo name={item.restaurantName} />
                <span>{item.restaurantName || "Restaurant name unavailable"}</span>
              </div>
              <div className="pk-showdown-art" style={{ backgroundColor: PALETTE[index % PALETTE.length] }}>
                <FoodCardIllustration name={item.itemName} />
              </div>
              <div className="pk-showdown-body">
                <h2>{item.itemName || "Unnamed dish"}</h2>
                <div className="pk-showdown-facts">
                  <FactTile label="Starting price" icon="◇" value={getItemDisplayPrice(item)} highlighted={winners.price.includes(item.itemID)} highlightLabel={winners.price.length > 1 ? "Joint lowest dish price" : "Lowest starting price"} />
                  <FactTile label="Delivery" icon="◷" value={formattedMinutes(item.deliveryTime)} highlighted={winners.delivery.includes(item.itemID)} highlightLabel={winners.delivery.length > 1 ? "Joint fastest" : "Fastest"} />
                  <FactTile label="Rating" icon="☆" value={formattedRating(item.avRating)} highlighted={winners.rating.includes(item.itemID)} highlightLabel={winners.rating.length > 1 ? "Joint top rated" : "Top rated"} />
                  <FactTile label="Distance" icon="⌖" value={formattedMiles(item.distance)} />
                  <FactTile label="Calories" icon="♨" value={formattedCalories(item.calories)} fullWidth />
                </div>

                <IngredientSection label="Reported allergens" values={allergens} itemID={item.itemID} />
                {vegan === true && <p className="pk-showdown-dietary">Vegan · <strong>Yes</strong></p>}
                {vegan === false && <p className="pk-showdown-dietary">Not vegan</p>}
                {vegan === null && <p className="pk-showdown-dietary">Vegan status not provided</p>}
                <IngredientSection
                  label="What's inside"
                  values={ingredients}
                  itemID={item.itemID}
                  expandable
                  expanded={isExpanded}
                  onToggle={() => setExpandedIngredients((prev) => ({ ...prev, [item.itemID]: !prev[item.itemID] }))}
                />
                <div className="pk-showdown-spacer" />
                <button
                  type="button"
                  className="pk-showdown-choose"
                  onClick={() => chooseDish(item)}
                  aria-label={onCustomiseDish ? `Customise ${item.itemName} and add to basket` : `Choose ${item.itemName} and add to basket`}
                  data-testid={`add-to-cart-${item.itemID}`}
                >
                  {onCustomiseDish ? "Customise & add to basket" : "Choose & add to basket"} <span aria-hidden="true">↗</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="pk-showdown-pricing-note">
        <span aria-hidden="true">ⓘ</span> Starting prices shown exclude extras, delivery, service and other fees.
      </p>
      <p className="pk-showdown-allergen-note">
        Allergen and ingredient details are reported by restaurants where available. Missing information does not mean a dish is allergen-free. Always confirm directly with the restaurant before ordering.
      </p>
      {basketNotice && (
        <div className="pk-showdown-toast" role="status" key={basketNotice.time}>
          <span className="pk-showdown-toast-icon" aria-hidden="true">✓</span>
          <span><strong>Added to basket!</strong><small>{basketNotice.name} is in your basket.</small></span>
          <button type="button" aria-label="Dismiss basket message" onClick={() => setBasketNotice(null)}>×</button>
        </div>
      )}
    </section>
  );
};

export default ComparisonTable;
