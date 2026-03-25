import { useState } from "react";
import API from "../services/api";
import Toast from "../components/Toast";
import "./Auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Register({ setPage }) {
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [address, setAddress]     = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [toast, setToast]         = useState(null);

  const handleRegister = async () => {
    if (!name || !email || !phone || !address || !password) {
      setToast({ message: "Please fill all fields!", type: "error" });
      return;
    }

    try {
      await API.post("/auth/register", {
        name, email, phone, address, password
      });
      setToast({ message: "Registration Successful! 🎉", type: "success" });
      setTimeout(() => setPage("login"), 1500);
    } catch (err) {
      setToast({ message: "Registration Failed. Try again!", type: "error" });
    }
  };

  return (
    <div className="auth-form">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <h2 className="title">Register</h2>

      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Phone Number"
        type="tel"
        maxLength={10}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <textarea
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="auth-textarea"
        rows={3}
      />

      <div className="password-wrapper">
        <input
          type={showPass ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="eye-toggle" onClick={() => setShowPass(!showPass)}>
          <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
        </span>
      </div>

      <button onClick={handleRegister}>Register</button>

      <p className="switch-btn" onClick={() => setPage("login")}>
        Already have an account? Login
      </p>
    </div>
  );
}

export default Register;