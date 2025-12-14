import React, { useState, useEffect } from "react";

const AccountDetails = ({ customerId }) => {
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    if (!customerId) return;

    fetch(`http://localhost:3001/customers/${customerId}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch((err) => console.error(err));
  }, [customerId]);

  return (
    <>
      <div className="section-heading">
        <h2>Personal Details</h2>
      </div>
      <div className="account-details">
        <label>
          First Name: <input value={customer.firstName || "N/A"} readOnly />
        </label>
        <label>
          Last Name: <input value={customer.lastName || "N/A"} readOnly />
        </label>
        <label>
          Email Address:{" "}
          <input value={customer.emailAddress || "N/A"} readOnly />
        </label>
        <label>
          Phone Number: <input value={customer.phoneNumber || "N/A"} readOnly />
        </label>
      </div>
    </>
  );
};

export default AccountDetails;
