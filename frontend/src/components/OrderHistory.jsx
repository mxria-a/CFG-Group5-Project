import React, { useState, useEffect } from "react";

const OrderHistory = ({ customerId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!customerId) return;

    fetch(`https://cfg-group5-backend.onrender.com/orders/${customerId}`)
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
                {order.restaurantName} | {order.itemName} | £{order.totalPrice}{" "}
                | {new Date(order.orderTime).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
