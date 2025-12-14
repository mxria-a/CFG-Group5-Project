const GuestCheckoutButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#ff6b35",
        color: "#fff",
        border: "none",
        padding: "14px 28px",
        borderRadius: "14px",
        fontSize: "1rem",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 6px 15px rgba(255, 107, 53, 0.35)"
      }}
    >
      Continue as guest
    </button>
  );
};

export default GuestCheckoutButton;
