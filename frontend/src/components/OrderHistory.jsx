import React from "react";

const OrderHistory = () => {
    const orders = [
        "Cheeseburger | Honest Burgers | £12.49 | 11 Nov",
        "Pepporoni Pizza | Dominos | £14 | 20 Nov",
        "Chicken Chow Mein | Jasmine Garden | £7.99 | 29 Nov"
    ];

  return (
    <>
      <div className="section-heading">
      <h2>Order History</h2>
      </div>
    <div className="order-history">
      <ul>
        {orders.map(order => 
          <li>{order}</li>
        )}
      </ul>
      </div>
      </>
  );
};

export default OrderHistory;
