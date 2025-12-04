import React from 'react';

const basket = () => {
  const { basketItems, Foodlist, removeFromBasket } = useContext(StoreContext);

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
      </div>
    </div>
  );
};

export default basket;
