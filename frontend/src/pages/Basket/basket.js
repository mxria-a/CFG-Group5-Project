import React from 'react';

const basket = () => {
  const { cartItems, foodList, removeFromBasket } = useContext(StoreContext);
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
        {food}
      </div>
    </div>
  );
};

export default basket;
