import { useContext, useState } from "react";
import { StoreContext } from "../Context/shop-context";
import { Snackbar, Alert } from "@mui/material";

import CheckoutItem from "../Components/CheckoutItem";
import GuestCheckout from "../Components/GuestCheckout";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { basketItems, foodList } = useContext(StoreContext);

const [, setCustomerInfo] = useState({
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  postcode: "",
  phone: "",
});

  const [customerId, setCustomerId] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  //Get customer details from the guest checkout
  const handleCustomerInfo = (data) => {
    //store info
    setCustomerInfo(data);

    //send guest details to backend
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
          message: "Customer details stored",
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

  //get checkout item
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

  //Place order -only works when one item in basket
  const handlePlaceOrder = () => {
    if (!customerId) {
      setNotification({
        open: true,
        message: "Please fill out the guest checkout first",
        severity: "error",
      });
      return;
    }

    //check basket length -it currently only works to push one item to the orders at a time
    if (checkoutItems.length > 1) {
      setNotification({
        open: true,
        message: "Please only checkout with one item at a time",
        severity: "error",
      });
      return;
    }

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
      {/* SAVE FOR SUCCESS SCREEN */}
      {orderPlaced ? (
        <div className="order-success">
          <h2>Thank you for your order</h2>
          <p>Your order number is {orderNumber}</p>
        </div>
      ) : (
        <>
          <h2>Your Basket</h2>

          {/* GUEST CHECKOUT */}
          {checkoutItems.length > 0 && (
            <GuestCheckout
              checkoutItems={checkoutItems}
              totalPrice={totalPrice}
              handleCustomerInfo={handleCustomerInfo}
            />
          )}

          {/* ERROR HANDLING */}
          {checkoutItems.length === 0 ? (
            <p className="empty-msg">Your basket is empty.</p>
          ) : (
            <div className="basket-items">
              {checkoutItems.map((item) => (
                <CheckoutItem key={item.itemID} item={item} />
              ))}
            </div>
          )}

          {/* TOTAL + BUTTON */}
          {checkoutItems.length > 0 && (
            <div className="checkout-summary">
              <div className="total-row">
                <span>Total:</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>

              <button
                className="primary-btn place-order-btn"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          )}
        </>
      )}

      {/* Snackbar MUST be inside the same return */}
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
