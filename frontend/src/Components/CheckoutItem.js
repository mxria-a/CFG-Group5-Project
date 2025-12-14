import "./CheckoutItem.css";

const CheckoutItem = ({ item }) => {
  return (
    <div className="checkout-item">
      <img
        src={item.image || "https://placehold.co/60"}
        alt={item.name}
        className="checkout-item-img"
      />

      <div className="checkout-item-details">
        <p className="checkout-item-name">{item.name}</p>
        <p className="checkout-item-price">
          £{item.price.toFixed(2)} × {item.quantity}
        </p>
      </div>

      <div className="checkout-item-total">
        £{(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CheckoutItem;
