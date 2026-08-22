import { useContext, useState } from "react";
import { StoreContext } from "../Context/shop-context";
import { Snackbar, Alert } from "@mui/material";
import { Link } from "react-router-dom";

import CheckoutItem from "../Components/CheckoutItem";
import GuestCheckoutForm from "../Components/GuestCheckoutForm";
import "./CheckoutPage.css";

const FIELD_LABELS = {
  firstName: "your first name",
  lastName: "your last name",
  email: "your email",
  address: "your address",
  postcode: "your postcode",
  phone: "your phone number",
};

const PAYMENT_OPTIONS = [
  { id: "card", label: "Card", icon: "\u{1F4B3}" },
  { id: "paypal", label: "PayPal", icon: "\u{1F17F}\uFE0F" },
  { id: "cash", label: "Cash on delivery", icon: "\u{1F4B5}" },
];

const CheckoutPage = () => {
  const { basketItems, foodList, clearBasket } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    postcode: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentError, setPaymentError] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [placing, setPlacing] = useState(false);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkoutItems = foodList
    .filter((item) => basketItems[item.itemID] > 0)
    .map((item) => ({
      itemID: item.itemID,
      name: item.itemName,
      price: Number(item.price),
      quantity: basketItems[item.itemID],
      image: item.image,
    }));

  const totalPrice = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tooManyItemTypes = checkoutItems.length > 1;

  const handlePlaceOrder = () => {
    if (checkoutItems.length === 0 || tooManyItemTypes || placing) return;

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = `Please enter ${FIELD_LABELS[key]}`;
      }
    });
    setErrors(newErrors);

    const missingPayment = !paymentMethod;
    setPaymentError(missingPayment);

    if (Object.keys(newErrors).length > 0 || missingPayment) return;

    setPlacing(true);

    fetch("https://cfg-group5-backend.onrender.com/store-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to store customer details");
        return res.json();
      })
      .then((resData) => {
        const customerId = resData.id;
        const item = checkoutItems[0];

        return fetch("https://cfg-group5-backend.onrender.com/submit-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId, item }),
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Order failed");
        return res.json();
      })
      .then((data) => {
        setOrderPlaced(true);
        setOrderNumber(data.orderNumber);
        clearBasket();
        setNotification({
          open: true,
          message: "Order placed successfully!",
          severity: "success",
        });
      })
      .catch(() => {
        setNotification({
          open: true,
          message: "Failed to place order. Please try again.",
          severity: "error",
        });
      })
      .finally(() => setPlacing(false));
  };

  return (
    <div className="checkout-container">
      {orderPlaced ? (
        <div className="order-success">
          <h2>Thank you for your order!</h2>
            <h2>Your food is on the way.</h2>
          <p>Your order number is {orderNumber}</p>
        </div>
      ) : (
        <>
          <h2>Checkout</h2>

          {checkoutItems.length === 0 ? (
            <p className="empty-msg">Your basket is empty.</p>
          ) : (
            <>
              {tooManyItemTypes && (
                <div className="checkout-limit-banner">
                  Checkout currently only supports one dish at a time. Please{" "}
                  <Link to="/basket">go back to your basket</Link> and remove
                  the extra dish types before continuing (quantity of the
                  same dish is fine).
                </div>
              )}

              <h3 className="step-heading">Your order</h3>
              <div className="basket-items">
                {checkoutItems.map((item) => (
                  <CheckoutItem key={item.itemID} item={item} />
                ))}
              </div>

              <h3 className="step-heading">Your details</h3>
              <GuestCheckoutForm
                formData={formData}
                errors={errors}
                onChange={handleFieldChange}
              />

              <h3 className="step-heading">Payment (demo only)</h3>
              <div className="payment-options">
                {PAYMENT_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    className={`payment-option ${paymentMethod === option.id ? "selected" : ""}`}
                    onClick={() => {
                      setPaymentMethod(option.id);
                      setPaymentError(false);
                    }}
                  >
                    <span className="payment-icon">{option.icon}</span>
                    {option.label}
                  </div>
                ))}
              </div>
              {paymentError && (
                <span className="pk-field-error">Please choose a payment method</span>
              )}

              <div className="order-checklist">
                <div className={`checklist-item ${!tooManyItemTypes ? "done" : "pending"}`}>
                  <span className="checklist-icon">{!tooManyItemTypes ? "✓" : "!"}</span>
                  {!tooManyItemTypes ? "Order is ready" : "Only one dish type per order, for now"}
                </div>
              </div>

              <div className="checkout-summary">
                <div className="total-row">
                  <span>Total:</span>
                  <span>£{totalPrice.toFixed(2)}</span>
                </div>

                <button
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={tooManyItemTypes || placing}
                >
                  {placing ? "Placing order..." : "Place Order"}
                </button>
              </div>
            </>
          )}
        </>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification((p) => ({ ...p, open: false }))}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CheckoutPage;
