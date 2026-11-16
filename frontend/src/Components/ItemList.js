import React from "react";
import FoodCardIllustration from "./FoodCardIllustration";
import RestaurantLogo from "./RestaurantLogo";
import { getItemDisplayPrice } from "../utils/menuDisplayPrice";
import "./ItemList.css";

const IMAGE_COLOURS = ["#C93F45", "#2F6B4F", "#7A4A8C", "#C27A1E", "#3F5E91", "#8B3D2D"];
const hasNumber = (value) => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));

function FoodPicture({ item, index }) {
  return (
    <div className="pk-result-picture" style={{ background: IMAGE_COLOURS[index % IMAGE_COLOURS.length] }}>
      <FoodCardIllustration name={item.itemName} />
      <span className="pk-result-price">{getItemDisplayPrice(item)}</span>
      {item.highlight && <span className={`pk-result-highlight pk-result-highlight-${item.highlight.kind}`}>{item.highlight.text}</span>}
    </div>
  );
}

/**
 * Opening details and selecting for comparison are separate actions.
 * The card's main button opens details; the comparison button only toggles selection.
 */
export default function ItemList({ items = [], selectedItems = [], onToggle, onViewDetails }) {
  return (
    <div className="item-list-container pk-result-grid">
      {items.map((item, index) => {
        const isSelected = selectedItems.some((selected) => selected.itemID === item.itemID);
        return (
          <article
            key={item.itemID}
            data-testid={`food-card-${item.itemID}`}
            className={`item-card pk-result-card${isSelected ? " selected" : ""}`}
          >
            <button
              type="button"
              className="pk-result-card-main"
              onClick={() => onViewDetails?.(item)}
              aria-label={`View details for ${item.itemName} from ${item.restaurantName || "restaurant"}`}
            >
              <div className="pk-result-restaurant"><RestaurantLogo name={item.restaurantName} /><span className="pk-result-restaurant-name">{item.restaurantName || "Restaurant"}</span></div>
              <FoodPicture item={item} index={index} />
              <div className="pk-result-card-body">
                <h3>{item.itemName}</h3>
                <div className="pk-result-meta">
                  {hasNumber(item.deliveryTime) && <span><span aria-hidden="true">◷</span> {item.deliveryTime} mins</span>}
                  {hasNumber(item.distance) && <span><span aria-hidden="true">⌖</span> {(Number(item.distance) * 0.621371).toFixed(1)} mi</span>}
                  {hasNumber(item.avRating) && <span><span aria-hidden="true">☆</span> {Number(item.avRating).toFixed(1)}</span>}
                </div>
              </div>
            </button>
            <div className="pk-result-card-actions">
              <button
                type="button"
                className="pk-result-view-details"
                onClick={() => onViewDetails?.(item)}
              >
                View details <span aria-hidden="true">↗</span>
              </button>
              <button
                type="button"
                className={`pk-result-select${isSelected ? " is-selected" : ""}`}
                onClick={() => onToggle(item)}
                aria-pressed={isSelected}
                aria-label={`${isSelected ? "Remove" : "Add"} ${item.itemName} ${isSelected ? "from" : "to"} comparison`}
              >
                <span aria-hidden="true">{isSelected ? "✓" : "+"}</span> {isSelected ? "Selected" : "Add to compare"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
