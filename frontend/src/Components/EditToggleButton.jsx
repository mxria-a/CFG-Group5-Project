const EditToggleButton = ({ editing, onClick }) => (
  <button
    type="button"
    className={`edit-toggle-btn${editing ? " editing" : ""}`}
    onClick={onClick}
    aria-label={editing ? "Save" : "Edit"}
  >
    {editing ? (
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          fill="currentColor"
        />
      </svg>
    )}
  </button>
);

export default EditToggleButton;
