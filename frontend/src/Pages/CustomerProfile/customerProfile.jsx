import React from "react";
import AccountDetails from "../../components/AccountDetails"
import OrderHistory from "../../components/OrderHistory"
// import PaymentMethods from "../components/PaymentMethods"
import Preferences from "../../components/Preferences"
import Addresses from "../../components/Addresses"
import "../styles/customerProfile.css";

const CustomerProfile = () => {
  return (
    <div className="customer-profile">
      <h1>Customer Profile</h1>
      <OrderHistory />
      <AccountDetails />
      <Preferences />
      <Addresses />
      {/* <PaymentMethods /> */}
    </div>
  );
};

export default CustomerProfile;