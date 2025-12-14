import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./basket.css";

import { StoreContext } from "../../Context/shop-context";

const Basket = () => {
  const { basketItems, foodList, removeFromBasket, getTotalBasketAmount } =
    useContext(StoreContext);

  
  const navigate = useNavigate();

  // Calculate totals safely
  const subtotal = getTotalBasketAmount() || 0;
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

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
        <br />
        <hr />

        {foodList.map((item) => {
          if (basketItems[item.itemID] > 0) {
            return (
              <div key={item.itemID}>
                <div className="basket-items-name basket-items-item">
                  <img
                    src={item.image || "https://placehold.co/50"}
                    alt={item.itemName}
                  />

                  <p>{item.itemName}</p>
                  <p>£{item.price}</p>
                  <p>{basketItems[item.itemID]}</p>
                  <p>£{(item.price * basketItems[item.itemID]).toFixed(2)}</p>

                  <p
                    onClick={() => removeFromBasket(item.itemID)}
                    className="cross"
                    style={{ cursor: "pointer", color: "red" }}
                  >
                    x
                  </p>
                </div>
                <hr />
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
            <hr />
            <div className="basket-total-details">
              <p>Delivery Fee</p>
              <p>£{deliveryFee}</p>
            </div>
            <hr />
            <div className="basket-total-details">
              <b>Total</b>
              <b>£{total.toFixed(2)}</b>
            </div>
          </div>
          <button onClick={() => navigate("/checkout")}>
            PROCEED TO CHECKOUT
          </button>
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
