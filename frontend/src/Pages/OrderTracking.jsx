import "./OrderStatus.css";

function OrderTracking() {
  const currentStatus = "Preparing your order";

  return (
    <div className="order-status-page">
      <h1>Track your order</h1>
      <p>Current status:</p>
      <span className="status-value">{currentStatus}</span>
    </div>
  );
}

export default OrderTracking;
