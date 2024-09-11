import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../api";
import { useLogout } from "../../context/AuthenticationContext";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useRef, useState } from "react";
import { PAGE_URLS } from "../../constants/URL";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuthenticationContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const logout = useLogout();
  const isAuthenticated = useIsAuthenticated();
  const [menuopen, setMenuOpen] = useState(false);

  const handleSearch = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const query = inputRef.current?.value;
    if (query) {
      navigate(`products/search?query=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuopen);
  };
  return (
    <>
      <nav className="navbar tajawal-extralight">
        <Link className="plain-text" to={PAGE_URLS.home}>
          <h1>سوق</h1>
        </Link>
        {user && <span>أهلا {user.username}</span>}

        <FontAwesomeIcon
          icon={faBars}
          className="menu-icon"
          onClick={toggleMenu}
        />
        <div className={`nav-item ${menuopen ? "open" : ""}`}>
          <form onSubmit={handleSearch} className="search-bar">
            <input
              id="search-by-name"
              type="search"
              placeholder="ابحث باسم المنتج"
              ref={inputRef}
            />
            <button className="wrapper-button" type="submit">
              <FontAwesomeIcon
                className="search-icon"
                icon={faMagnifyingGlass}
              />
            </button>
          </form>
          <Link className="nav-link " to="/sell">
            البيع في سوق
          </Link>
          {isAuthenticated ? (
            <button onClick={logout} className="button">
              تسجيل الخروج
            </button>
          ) : (
            <Link className="button" to="login">
              تسجيل الدخول
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
