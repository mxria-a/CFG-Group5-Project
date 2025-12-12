import React, { useState, useEffect } from "react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const customerId = 1;

  useEffect(() => {
    fetch(`http://localhost:3001/orders/${customerId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, [customerId]);

  return (
    <>
      <div className="section-heading">
      <h2>Order History</h2>
      </div>
    <div className="order-history">
    {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.orderID}>
                {order.itemName} - £{order.totalPrice}
              </li>
            ))}
          </ul>
        )}
      </div>
      </>
  );
};

export default OrderHistory;
