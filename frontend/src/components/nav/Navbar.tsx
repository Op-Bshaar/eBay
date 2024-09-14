import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
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
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(!menuOpen);
  };

    return (
        <>
            <nav className="navbar tajawal-extralight">
                <Link className="plain-text" to={PAGE_URLS.home}>
                    <h1 className="namestyle">سوق</h1>
                </Link>
                {user && <span className="namestyle">أهلا {user.username}</span>}

                <div className="menu-toggle">
                    <FontAwesomeIcon
                        icon={faBars}
                        className={`menu-icon ${menuOpen ? "hidden" : ""}`}
                        onClick={toggleMenu}
                    />
                    <FontAwesomeIcon
                        icon={faXmark}
                        className={`close-icon ${menuOpen ? "visible" : "hidden"}`}
                        onClick={toggleMenu}
                    />
                </div>

                <div className={`nav-item ${menuOpen ? "open" : ""}`}>
                    <form role="search" onSubmit={handleSearch} className="search-bar">
                        <input
                            id="search-by-name"
                            type="search"
                            aria-description="ابحث باسم المنتج"
                            placeholder="ابحث باسم المنتج"
                            ref={inputRef}
                        />
                        <button title="بحث" aria-label="بحث" className="wrapper-button" type="submit">
                            <FontAwesomeIcon
                                className="search-icon"
                                icon={faMagnifyingGlass}
                            />
                        </button>
                    </form>
                    <Link className="nav-link" to="/sell">
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
