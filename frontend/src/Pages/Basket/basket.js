import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./basket.css";

import { StoreContext } from "../../Context/shop-context";

const Basket = () => {
  const {
    basketItems,
    demoCustomLines = {},
    foodList,
    addToBasket,
    removeFromBasket,
    removeItemFromBasket,
    changeDemoCustomQuantity,
    removeDemoCustomLine,
    getTotalBasketAmount,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const subtotal = getTotalBasketAmount() || 0;
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  const itemsInBasket = foodList.filter((item) => basketItems[item.itemID] > 0);
  const distinctItemCount = itemsInBasket.length;
  const demoLines = Object.values(demoCustomLines);
  const tooManyItemTypes = distinctItemCount + demoLines.length > 1;

  if (distinctItemCount === 0 && demoLines.length === 0) {
    return (
      <div className="basket">
        <h2 className="basket-page-title">Basket</h2>
        <div className="pk-empty-state">
          <h2>Your basket is empty</h2>
          <p>Find something tasty and it'll show up here.</p>
          <button
            className="pk-btn pk-btn-primary"
            style={{ marginTop: "16px" }}
            onClick={() => navigate("/")}
          >
            Browse takeaways
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="basket">
      <h2 className="basket-page-title">Basket</h2>
      <div className="basket-items">
        <div className="basket-items-name">
          <p>Items</p>
          <p>Name</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        {itemsInBasket.map((item) => (
          <div key={item.itemID}>
            <div className="basket-items-name basket-items-item">
              {item.image ? (
                <img src={item.image} alt={item.itemName} />
              ) : (
                <div
                  className="basket-thumb-emoji"
                  role="img"
                  aria-label={item.itemName}
                >
                  🍽️
                </div>
              )}

              <div className="basket-item-name-cell">
                <p className="basket-item-name">{item.itemName}</p>
                {item.restaurantName && (
                  <p className="basket-item-restaurant">{item.restaurantName}</p>
                )}
              </div>

              <p>£{item.price}</p>

              <div className="qty-stepper">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${item.itemName}`}
                  onClick={() => removeFromBasket(item.itemID)}
                >
                  −
                </button>
                <span>{basketItems[item.itemID]}</span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${item.itemName}`}
                  onClick={() => addToBasket(item.itemID)}
                >
                  +
                </button>
              </div>

              <p>£{(item.price * basketItems[item.itemID]).toFixed(2)}</p>

              <button
                type="button"
                onClick={() => removeItemFromBasket(item.itemID)}
                className="cross"
                aria-label={`Remove ${item.itemName} from basket`}
              >
                x
              </button>
            </div>
          </div>
        ))}
        {demoLines.map((line) => (
          <div key={line.key} className="basket-items-name basket-items-item pk-demo-basket-line">
            <div className="basket-thumb-emoji" role="img" aria-label="Dish illustration">🍽️</div>
            <div className="basket-item-name-cell">
              <p className="basket-item-name">{line.itemName} <span className="pk-demo-basket-tag">Customised</span></p>
              <p className="basket-item-restaurant">{line.restaurantName}</p>
              {line.size && <p className="pk-demo-basket-choices">Size: {line.size.name}</p>}
              {line.removed.length > 0 && <p className="pk-demo-basket-choices">No {line.removed.join(", no ").toLowerCase()}</p>}
              {line.extras.length > 0 && <p className="pk-demo-basket-choices">Extras: {line.extras.map((extra) => extra.name).join(", ")}</p>}
            </div>
            <p>£{line.unitPrice.toFixed(2)}</p>
            <div className="qty-stepper">
              <button type="button" aria-label={`Decrease quantity of ${line.itemName}`} onClick={() => changeDemoCustomQuantity(line.key, -1)}>−</button>
              <span>{line.quantity}</span>
              <button type="button" aria-label={`Increase quantity of ${line.itemName}`} onClick={() => changeDemoCustomQuantity(line.key, 1)}>+</button>
            </div>
            <p>£{(line.unitPrice * line.quantity).toFixed(2)}</p>
            <button type="button" className="cross" aria-label={`Remove customised ${line.itemName}`} onClick={() => removeDemoCustomLine(line.key)}>×</button>
          </div>
        ))}
      </div>
      {demoLines.length > 0 && <div className="pk-demo-basket-warning" role="note">
        <strong>Customised dishes in your basket</strong>
        <p>Your selected sizes, extras and removals are included in the prices shown. Checkout for customised dishes isn't available yet. Remove these items to check out standard dishes.</p>
      </div>}

      <div className="basket-bottom">
        <div className="basket-total">
          <h2>Basket Total</h2>
          <div>
            <div className="basket-total-details">
              <p>Subtotal</p>
              <p>£{subtotal.toFixed(2)}</p>
            </div>
            <div className="basket-total-details">
              <p>Delivery Fee</p>
              <p>£{deliveryFee}</p>
            </div>
            <div className="basket-total-details">
              <b>Total</b>
              <b>£{total.toFixed(2)}</b>
            </div>
          </div>
          <button onClick={() => navigate("/checkout")}>
            PROCEED TO CHECKOUT
          </button>
          {tooManyItemTypes && (
            <p className="basket-limit-warning">
              Heads up — checkout currently only supports one dish at a time.
              You can keep multiple of the same item, but please remove the
              others before checking out.
            </p>
          )}
        </div>

        <div className="basket-promocode">
          <p>Add promo code</p>
          <div className="basket-promocode-input">
            <input type="text" placeholder="Promo Code" />
            <button>Apply Code</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket;