import React from 'react';

const Basket = () => {
  const { basketItems, foodList, removeFromBasket } = useContext(StoreContext);
  return (
    <div class="basket">
      <div class="basket-items">
        <div class="basket-items-name">
          <p>Items</p>
          <p>Name</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {foodList.map((item, index) => {
          if (basketItems[item._id] > 0) {
            return (
              <div>
                <div classname="basket-items-name basket-items-item">
                  <img src="{item.image" alt="" />
                  <p>{item.name}</p>
                  <p>£{item.price}</p>
                  <p>{basketItems[item._id]}</p>
                  <p>£{item.price * basketItems[item._id]}</p>
                  <p
                    onClick={() => removeFromBasket(item._id)}
                    classname="cross"
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Basket;
