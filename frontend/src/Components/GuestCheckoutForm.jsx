import { useState } from "react";

const GuestCheckoutForm = ({ handleCustomerInfo }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    postcode: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.Value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCustomerInfo(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="guest-checkout-form">
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Email address:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Postcode:</label>
        <input
          type="text"
          name="postcode"
          value={formData.postcode}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Phone number:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Confirm details</button>
    </form>
  );
};

export default GuestCheckoutForm;
