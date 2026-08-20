import React from 'react';
import './ItemList.css';

const ItemList = ({ items, selectedItems, onToggle }) => {

  return (
    <div className="item-list-container">
      {items.map((item) => {
        const isSelected = selectedItems.some((i) => i.itemID === item.itemID);

        return (
          <div
            key={item.itemID}
            data-testid={`food-card-${item.itemID}`}
            className={`item-card ${isSelected ? 'selected' : ''}`}
            onClick={() => {
              // Call onToggle to select the item for comparison
              onToggle(item);
            }}
          >
            <div className="card-content">
              <h3>{item.itemName}</h3>

              <div className="card-details-row">
                <span className="label">Price:</span>
                <span className="value">£{Number(item.price).toFixed(2)}</span>
              </div>

              <div className="card-details-row">
                <span className="label">Delivery:</span>
                <span className="value">{item.deliveryTime} mins</span>
              </div>

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
