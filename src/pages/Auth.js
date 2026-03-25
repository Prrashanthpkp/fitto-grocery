import "./Auth.css";
import Login from "./Login";
import Register from "./Register";
import banner from "../assests/banner1.jpeg";
import logo from "../assests/grocery.png";

function Auth({ page, setPage }) {
  return (
    <div className="auth-container">

      {/* LEFT IMAGE */}
      <div className="auth-left">
        <img src={banner} alt="banner" />
      </div>

      <div className="auth-right-wrapper">
        <img src={logo} alt="logo" className="auth-logo-above" />

        {/* RIGHT FORM */}
        <div className={`auth-right ${page === "register" ? "flip" : ""}`}>

          <div className="card-inner">

            {/* LOGIN */}
            <div className="card-front">
              <Login setPage={setPage} />
            </div>

            {/* REGISTER */}
            <div className="card-back">
              <Register setPage={setPage} />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Auth;