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
          <div className="order-history-row">
            {orders.map((order) => (
              <div className="order-card-h" key={order.orderID}>
                <div className="order-thumb">🍽️</div>
                <div className="order-restaurant">{order.restaurantName}</div>
                <div className="order-items">{order.itemName}</div>
                <div className="order-date">
                  {new Date(order.orderTime).toLocaleString()}
                </div>
                <div className="order-card-bottom">
                  <div className="order-price">£{order.totalPrice}</div>
                  {/* Visual only for now — no reorder endpoint exists yet */}
                  <button className="order-reorder-btn">Reorder</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
