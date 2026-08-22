import "./GuestCheckoutForm.css";

const FIELDS = [
  { name: "firstName", label: "First name", type: "text" },
  { name: "lastName", label: "Last name", type: "text" },
  { name: "email", label: "Email address", type: "email", full: true },
  { name: "address", label: "Address", type: "text", full: true },
  { name: "postcode", label: "Postcode", type: "text" },
  { name: "phone", label: "Phone number", type: "text" },
];

const GuestCheckoutForm = ({ formData, errors, onChange }) => {
  return (
    <div className="guest-checkout-form">
      <div className="guest-checkout-field-group">
        {FIELDS.map((f) => (
          <div key={f.name} className={f.full ? "field-full" : ""}>
            <label htmlFor={f.name}>{f.label}</label>
            <input
              id={f.name}
              type={f.type}
              name={f.name}
              value={formData[f.name]}
              onChange={(e) => onChange(f.name, e.target.value)}
              className={errors[f.name] ? "invalid" : ""}
            />
            {errors[f.name] && (
              <span className="pk-field-error">{errors[f.name]}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestCheckoutForm;
