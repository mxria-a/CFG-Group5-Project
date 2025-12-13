function OrderHistory() {
  const orders = [
    {
      id: 1,
      item: "Cheeseburger",
      restaurant: "Burger Place",
      status: "Delivered"
    },
    {
      id: 2,
      item: "Pasta",
      restaurant: "Italian Kitchen",
      status: "Delivered"
    }
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Order history</h1>

      {orders.map(order => (
        <div key={order.id} style={{ marginBottom: "1rem" }}>
          <p><strong>{order.item}</strong></p>
          <p>{order.restaurant}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;
