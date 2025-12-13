function OrderTracking() {
  const currentStatus = "Preparing your order";

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Track your order</h1>
      <p>Current status:</p>
      <p><strong>{currentStatus}</strong></p>
    </div>
  );
}

export default OrderTracking;
