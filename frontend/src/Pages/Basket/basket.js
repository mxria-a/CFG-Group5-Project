import React, { useContext } from 'react';
import './basket.css';
import { StoreContext } from '../../Context/shop-context';

const Basket = () => {
  const { basketItems, foodList, removeFromBasket, getTotalBasketAmount } =
    useContext(StoreContext);
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
        {foodList &&
          foodList.map((item) => {
            if (basketItems[item._id] > 0) {
              return (
                <div key={item._id}>
                  <div className="basket-items-name basket-items-item">
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                    <p>£{item.price}</p>
                    <p>{basketItems[item._id]}</p>
                    <p>£{item.price * basketItems[item._id]}</p>
                    <p
                      onClick={() => removeFromBasket(item._id)}
                      className="cross"
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
              <p>£{getTotalBasketAmount()}</p>
            </div>
            <hr />
            <div className="basket-total-details">
              <p>Delivery Fee</p>
              <p>£{2}</p>
            </div>
            <hr />
            <div className="basket-total-details">
              <b>Total</b>
              <b>£{getTotalBasketAmount() + 2}</b>
            </div>
          </div>
          <button>PROCEED TO CHECKOUT</button>
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
