import { Link } from "react-router-dom";
function OrderConfirmation() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Order confirmed</h1>
      <p>Your order has been placed successfully.</p>
      <p>
  <Link to="/orders">View your order history</Link>
</p>
      <p>You can view your order status or check past orders in your account.</p>
    </div>
  );
}

export default OrderConfirmation;
