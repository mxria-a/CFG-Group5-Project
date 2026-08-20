import { Link } from "react-router-dom";
import "./OrderStatus.css";

function OrderConfirmation() {
  return (
    <div className="order-status-page">
      <div className="stamp-big">Order confirmed!</div>
      <h1>Thanks — it's on its way</h1>
      <p>Your order has been placed successfully.</p>
      <p>
        <Link to="/profile">View your order history</Link>
      </p>
      <p>You can view your order status or check past orders in your account.</p>
    </div>
  );
}

export default OrderConfirmation;
