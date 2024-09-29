import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faShoppingCart,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../helpers/api";
import { useLogout } from "../../context/AuthenticationContext";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useRef, useState } from "react";
import { PAGE_URLS } from "../../constants/URL";
import { APP_NAME } from "../../constants/Constants";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useAuthenticationContext();
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return <DesktopNavBar/>
    return (
        <>
            <nav className="navbar">
                <Link className="plain-text" to={PAGE_URLS.home}>
                    {APP_NAME}
                </Link>
                    <Link className="link" to={PAGE_URLS.all_orders}>طلباتي</Link>
                    <Link aria-label="السلة" to={PAGE_URLS.cart}>
                        <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                    </Link>

                {user && <span className="namestyle">أهلا {user.username}</span>}
                <Link className="link" to={PAGE_URLS.editprofile}>
                    تعديل الحساب
                    </Link>

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
                    

                    <Link className="link" to={"/seller-portal"}>
                        البيع في سوق
                    </Link>
                    
                </div>
            </nav>
        </>
    );
}
function LoginButton(){
    const isAuthenticated = useIsAuthenticated();
    const [loggingout, setLoggingout] = useState(false);
    const logout = useLogout();
    return isAuthenticated ? (
        <button onClick={() => {
            setLoggingout(true);
            logout().then(() => setLoggingout(false));
        }
        } disabled={loggingout} className="button btn" >
            تسجيل الخروج
        </button>
    ) : (
        <Link className="button" to="login">
            تسجيل الدخول
        </Link>
    );
}
function Search(){
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const handleSearch = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const query = inputRef.current?.value.trim();
        if (query) {
            navigate(`products/search?query=${encodeURIComponent(query)}`);
        } else {
            navigate("/");
        }
    };
    return (
    <form role="search" onSubmit={handleSearch} className="search-bar">
                        <input
                            id="search-by-name"
                            type="search"
                            aria-description="ابحث باسم المنتج"
                            placeholder="ابحث باسم المنتج"
                            ref={inputRef}
                        />
                        <button
                            title="بحث"
                            aria-label="بحث"
                            className="wrapper-button"
                            type="submit"
                        >
                            <FontAwesomeIcon
                                className="search-icon"
                                icon={faMagnifyingGlass}
                            />
                        </button>
                    </form>
    );
}
function DesktopNavBar(){
    return(
        <nav className="navbar">
            <span>{APP_NAME}</span>
            <Search/>
            <LoginButton/>
        </nav>
    );
}
export default Navbar;
