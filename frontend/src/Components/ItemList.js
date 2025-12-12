import React, { useContext } from 'react';
import { StoreProvider } from './Context/shop-context';
import './ItemList.css';

// ItemList component to display list of items with selection checkboxes
const ItemList = ({ items, selectedItems, onToggle }) => {
  return (
    <div className="item-list-container">
      {items.map((item) => {
        const isSelected = selectedItems.some((i) => i.itemID === item.itemID);

        return (
          <div
            key={item.itemID}
            // to pass test id for testing purposes
            data-testid={`food-card-${item.itemID}`}
            className={`item-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onToggle(item)}
          >
            {/* LEFT SIDE: Text Info */}
            <div className="card-content">
              <h3>{item.itemName}</h3>

              <div className="card-details-row">
                <span className="label">Price:</span>
                <span className="value">£{item.price}</span>
              </div>

              <div className="card-details-row">
                <span className="label">Delivery:</span>
                <span className="value">{item.deliveryTime} mins</span>
              </div>

              {/* Distance */}
              {item.distance && (
                <div className="card-details-row">
                  <span className="label">Distance:</span>
                  <span className="value">{item.distance.toFixed(1)} km</span>
                </div>
              )}

              <div className="restaurant-subtext">
                from {item.restaurantName}
              </div>
            </div>

            {/* Big Checkbox on the right side */}
            <div className="card-action">
              <div
                className={`custom-checkbox ${isSelected ? 'checked' : ''}`}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItemList;
