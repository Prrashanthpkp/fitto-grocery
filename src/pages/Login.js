import { useState } from "react";
import API from "../services/api";
import Toast from "../components/Toast";
import "./Auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login({ setPage }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast]       = useState(null);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.role === "ADMIN") {
        setToast({ message: "Welcome Admin! 👋", type: "success" });
        setTimeout(() => setPage("admin"), 1000);
      } else {
        setToast({ message: "Login Successful! Welcome back 🛒", type: "success" });
        setTimeout(() => setPage("products"), 1500);
      }
    } catch (err) {
      setToast({ message: "Invalid credentials! Please try again.", type: "error" });
    }
  };

  return (
    <div className="auth-form">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <h2 className="title">Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      <button onClick={handleLogin}>Login</button>

      <p className="switch-btn" onClick={() => setPage("register")}>
        Don't have an account? Register
      </p>
    </div>
  );
}

export default Login;