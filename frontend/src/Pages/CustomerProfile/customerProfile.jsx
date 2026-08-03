import React, { useState, useEffect } from "react";
import AccountDetails from "../../Components/AccountDetails";
import OrderHistory from "../../Components/OrderHistory";
import Preferences from "../../Components/Preferences";
import Addresses from "../../Components/Addresses";
import "../../Pages/CustomerProfile/customerProfile.css";

const CustomerProfile = () => {
  const [email, setEmail] = useState("");
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    if (!email) return;

    fetch(`https://cfg-group5-backend.onrender.com/customers/email/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.customerID) {
          setCustomerId(data.customerID);
        } else {
          setCustomerId(null);
        }
      })
      .catch((err) => console.error(err));
  }, [email]);

  return (
    <div className="customer-profile">
      <h1>Customer Profile</h1>

      {/* Show email input only if customerId is not found yet */}
      {!customerId && (
        <label>
          Enter your email to load profile
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
          />
        </label>
      )}

      {customerId ? (
        <>
          <OrderHistory customerId={customerId} />
          <AccountDetails customerId={customerId} />
          <Preferences customerId={customerId} />
          <Addresses customerId={customerId} />
        </>
      ) : email ? (
        <p>No customer found with this email</p>
      ) : (
        <p>Please enter your email to view your profile</p>
      )}
    </div>
  );
};

export default CustomerProfile;
