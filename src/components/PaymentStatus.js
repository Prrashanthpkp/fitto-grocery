import "./PaymentStatus.css";

function PaymentStatus({ type, message, onClose }) {
  return (
    <div className="ps-overlay">
      <div className={`ps-modal ps-${type}`}>

        {/* ANIMATED CIRCLE */}
        <div className="ps-circle">
          <svg viewBox="0 0 100 100" className="ps-svg">
            <circle cx="50" cy="50" r="45"
              className="ps-ring" />
            {type === "success" ? (
              <polyline points="25,52 42,68 75,35"
                className="ps-checkmark" />
            ) : (
              <>
                <line x1="30" y1="30" x2="70" y2="70" className="ps-cross" />
                <line x1="70" y1="30" x2="30" y2="70" className="ps-cross" />
              </>
            )}
          </svg>
        </div>

        <h3 className="ps-title">
          {type === "success" ? "Payment Successful!" : "Payment Failed!"}
        </h3>
        <p className="ps-message">{message}</p>

        <button className="ps-btn" onClick={onClose}>
          {type === "success" ? "View Orders" : "Try Again"}
        </button>

      </div>
    </div>
  );
}

export default PaymentStatus;