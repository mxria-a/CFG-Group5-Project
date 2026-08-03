import React, { useState, useEffect } from "react";

const Addresses = ({ customerId }) => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!customerId) return;

    fetch(`https://cfg-group5-backend.onrender.com/addresses/${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        setAddress(data.address || "");
      })
      .catch((err) => console.error(err));
  }, [customerId]);

  return (
    <>
      <div className="section-heading">
        <h2>Address</h2>
      </div>
      <div className="addresses">
        <label>
          Address
          <input value={address} readOnly />
        </label>
      </div>
    </>
  );
};

export default Addresses;
