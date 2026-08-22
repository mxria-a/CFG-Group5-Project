import { useContext, useState } from "react";
import { StoreContext } from "../Context/shop-context";
import { Snackbar, Alert } from "@mui/material";
import { Link } from "react-router-dom";

import CheckoutItem from "../Components/CheckoutItem";
import GuestCheckout from "../Components/GuestCheckout";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { basketItems, foodList } = useContext(StoreContext);

  const [customerInfo, setCustomerInfo] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const handleCustomerInfo = (data) => {
    setCustomerInfo(data);

    fetch("https://cfg-group5-backend.onrender.com/store-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to store customer details");
        return res.json();
      })
      .then((resData) => {
        setCustomerId(resData.id);
        setNotification({
          open: true,
          message: "Details saved!",
          severity: "success",
        });
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          open: true,
          message: "Failed to store customer details",
          severity: "error",
        });
      });
  };

  const handleEditDetails = () => {
    setCustomerId(null);
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
  const detailsConfirmed = !!customerId;
  const readyToOrder = detailsConfirmed && !tooManyItemTypes && checkoutItems.length === 1;

  const handlePlaceOrder = () => {
    if (!readyToOrder) return;

    const item = checkoutItems[0];

    fetch("https://cfg-group5-backend.onrender.com/submit-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: customerId,
        item: item,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Order failed");
        return res.json();
      })
      .then((data) => {
        setOrderPlaced(true);
        setOrderNumber(data.orderNumber);

        setNotification({
          open: true,
          message: `Order placed successfully!`,
          severity: "success",
        });
      })
      .catch(() => {
        setNotification({
          open: true,
          message: "Failed to place order.",
          severity: "error",
        });
      });
  };

  return (
    <div className="checkout-container">
      {orderPlaced ? (
        <div className="order-success">
          <h2>Thank you for your order</h2>
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
              {detailsConfirmed ? (
                <div className="guest-confirmed-card">
                  <div className="confirmed-label">
                    <span className="confirmed-check">✓</span>
                    <div className="confirmed-details">
                      <p>
                        <strong>
                          {customerInfo?.firstName} {customerInfo?.lastName}
                        </strong>
                      </p>
                      <p>{customerInfo?.email}</p>
                    </div>
                  </div>
                  <button className="edit-details-btn" onClick={handleEditDetails}>
                    Edit details
                  </button>
                </div>
              ) : (
                <GuestCheckout
                  checkoutItems={checkoutItems}
                  totalPrice={totalPrice}
                  handleCustomerInfo={handleCustomerInfo}
                />
              )}

              <div className="order-checklist">
                <div className={`checklist-item ${detailsConfirmed ? "done" : "pending"}`}>
                  <span className="checklist-icon">{detailsConfirmed ? "✓" : "○"}</span>
                  {detailsConfirmed ? "Your details are ready" : "Add your details to continue"}
                </div>
                <div className={`checklist-item ${!tooManyItemTypes ? "done" : "pending"}`}>
                  <span className="checklist-icon">{!tooManyItemTypes ? "✓" : "!"}</span>
                  {!tooManyItemTypes ? "Order is ready to place" : "Only one dish type per order, for now"}
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
                  disabled={!readyToOrder}
                >
                  Place Order
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
