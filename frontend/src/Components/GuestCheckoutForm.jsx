import { useState } from "react";
import "./GuestCheckoutForm.css";

const FIELDS = [
  { name: "firstName", label: "First name", type: "text" },
  { name: "lastName", label: "Last name", type: "text" },
  { name: "email", label: "Email address", type: "email" },
  { name: "address", label: "Address", type: "text" },
  { name: "postcode", label: "Postcode", type: "text" },
  { name: "phone", label: "Phone number", type: "text" },
];

const GuestCheckoutForm = ({ handleCustomerInfo }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    postcode: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    FIELDS.forEach((f) => {
      if (!formData[f.name].trim()) {
        newErrors[f.name] = `Please enter your ${f.label.toLowerCase()}`;
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    handleCustomerInfo(formData);
  };

  return (
    <div className="guest-checkout-form-wrapper">
      <form onSubmit={handleSubmit} className="guest-checkout-form" noValidate>
        <h2 className="guest-checkout-title">Your details</h2>

        <div className="guest-checkout-field-group">
          {FIELDS.map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name}>{f.label}:</label>
              <input
                id={f.name}
                type={f.type}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                className={errors[f.name] ? "invalid" : ""}
              />
              {errors[f.name] && (
                <span className="pk-field-error">{errors[f.name]}</span>
              )}
            </div>
          ))}
        </div>

        <div className="guest-checkout-submit-wrapper">
          <button type="submit" className="pk-btn pk-btn-primary">
            Confirm Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestCheckoutForm;
