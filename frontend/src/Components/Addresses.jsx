import React, { useState, useEffect } from "react";
import EditToggleButton from "./EditToggleButton";

const Addresses = ({ customerId }) => {
  const [address, setAddress] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!customerId) return;

    fetch(`https://cfg-group5-backend.onrender.com/addresses/${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        setAddress(data.address || "");
      })
      .catch((err) => console.error(err));
  }, [customerId]);

  const toggleEdit = () => setEditing((prev) => !prev);

  return (
    <>
      <div className="card-header-row">
        <div className="section-heading">
          <h2>Address</h2>
        </div>
        <EditToggleButton editing={editing} onClick={toggleEdit} />
      </div>
      <div className={`addresses${editing ? " editing" : ""}`}>
        <label>
          Address
          <input
            value={address}
            readOnly={!editing}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
      </div>
    </>
  );
};

export default Addresses;
