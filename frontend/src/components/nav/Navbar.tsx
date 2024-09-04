import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="nav">
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
      <p style={{ cursor: "pointer" }}>البيع في سوق</p>
      <p style={{ cursor: "pointer" }}>المدونه</p>
      <button className="button">
        <h3 style={{ color: "white" }}>تسجيل الدخول</h3>
      </button>
    </div>
  );
}

export default Navbar;
