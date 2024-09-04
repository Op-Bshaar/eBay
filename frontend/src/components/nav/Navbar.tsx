import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Hero from "../../pages/Hero/hero";

function Navbar() {
  return (
    <>
      <nav className="nav">
        <h1>سوق</h1>
        <div className="icon-container">
          <input
            className="input-style"
            type="text"
            placeholder="ابحث باسم المنتج"
          />
          <FontAwesomeIcon
            style={{
              backgroundColor: "blue",
              cursor: "pointer",
              color: "white",
              padding: "5px",
              borderRadius: "50%",
              fontSize: "25px",
            }}
            icon={faMagnifyingGlass}
          />
        </div>
        <p>البيع في سوق</p>
        <Link className="nav-button" to="login">
          <h3>تسجيل الدخول</h3>
        </Link>
      </nav>
      <Hero/>
    </>
  );
}

export default Navbar;
