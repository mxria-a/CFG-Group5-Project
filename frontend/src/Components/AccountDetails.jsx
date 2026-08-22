import React, { useState, useEffect } from "react";
import EditToggleButton from "./EditToggleButton";

const AccountDetails = ({ customerId }) => {
  const [customer, setCustomer] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!customerId) return;

    fetch(`https://cfg-group5-backend.onrender.com/customers/${customerId}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch((err) => console.error(err));
  }, [customerId]);

  const handleChange = (field) => (e) => {
    setCustomer((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // NOTE: there's no update/PATCH endpoint on the backend yet, so "Save"
  // here only returns the fields to read-only locally — it does not
  // persist changes. Wire this up to a real endpoint once one exists.
  const toggleEdit = () => setEditing((prev) => !prev);

  return (
    <>
      <div className="card-header-row">
        <div className="section-heading">
          <h2>Personal Details</h2>
        </div>
        <EditToggleButton editing={editing} onClick={toggleEdit} />
      </div>
      <div className={`account-details${editing ? " editing" : ""}`}>
        <label>
          First Name:{" "}
          <input
            value={customer.firstName || (editing ? "" : "N/A")}
            readOnly={!editing}
            onChange={handleChange("firstName")}
          />
        </label>
        <label>
          Last Name:{" "}
          <input
            value={customer.lastName || (editing ? "" : "N/A")}
            readOnly={!editing}
            onChange={handleChange("lastName")}
          />
        </label>
        <label>
          Email Address:{" "}
          <input
            value={customer.emailAddress || (editing ? "" : "N/A")}
            readOnly={!editing}
            onChange={handleChange("emailAddress")}
          />
        </label>
        <label>
          Phone Number:{" "}
          <input
            value={customer.phoneNumber || (editing ? "" : "N/A")}
            readOnly={!editing}
            onChange={handleChange("phoneNumber")}
          />
        </label>
      </div>
    </>
  );
};

export default AccountDetails;
