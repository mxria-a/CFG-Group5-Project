import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./basket.css";

import { StoreContext } from "../../Context/shop-context";

const Basket = () => {
  const {
    basketItems,
    foodList,
    addToBasket,
    removeFromBasket,
    removeItemFromBasket,
    getTotalBasketAmount,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const subtotal = getTotalBasketAmount() || 0;
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  const distinctItemCount = foodList.filter(
    (item) => basketItems[item.itemID] > 0
  ).length;
  const tooManyItemTypes = distinctItemCount > 1;

  return (
    <div className="basket">
      <div className="basket-items">
        <div className="basket-items-name">
          <p>Items</p>
          <p>Name</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        {foodList.map((item) => {
          if (basketItems[item.itemID] > 0) {
            return (
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

                  <p>{item.itemName}</p>
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
            );
          }
          return null;
        })}
      </div>

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