import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../../context/AuthenticationContext";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useEffect, useRef, useState } from "react";
import { PAGE_URLS } from "../../constants/URL";
import { APP_NAME } from "../../constants/Constants";

function Navbar() {
    const isTabletOrLarger = useMediaQuery('(min-width: 768px)');
    return isTabletOrLarger ? <DesktopNavBar /> : <MobileNavBar />;

}
function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(window.matchMedia(query).matches);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);

        // Event listener callback function to update state when the query matches or doesn't match
        const updateMatches = (event: MediaQueryListEvent) => setMatches(event.matches);

        mediaQueryList.addEventListener('change', updateMatches);

        // Cleanup event listener on unmount
        return () => mediaQueryList.removeEventListener('change', updateMatches);
    }, [query]);

    return matches;
}
function MobileNavBar() {
    return (
        <nav>
            <div className="navbar">
                <Link to={PAGE_URLS.home} className="navbar-app-name">{APP_NAME}</Link>
                <SellerPortal />
                <UserProfile />
            </div>
            <div className="navbar">
                <Search />
                <CartButton />
            </div>
        </nav>
    );
}
function DesktopNavBar() {
    return (
        <nav className="navbar">
            <Link to={PAGE_URLS.home} className="navbar-app-name">{APP_NAME}</Link>
            <Search />
            <SellerPortal />
            <CartButton />
            <UserProfile />
        </nav>
    );
}
function SellerPortal() {
    return (
        <Link className="link" to={PAGE_URLS.sellerPortal}>
            البيع في {APP_NAME }
        </Link>
    );
}
function UserProfile() {
    const { user } = useAuthenticationContext();
    const [expanded, setExpanded] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setExpanded(false);
            }
        }
        if (expanded) {
            // Attach the event listener to the document
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            // Remove the event listener if the menu is not expanded
            document.removeEventListener('mousedown', handleClickOutside);
        }
        // Cleanup function to remove the event listener on unmount or when `expanded` changes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [expanded]);
    if (!user) {
        if (expanded) {
            setExpanded(false);
        }
        return <LoginButton />
    }
    return (
        <span className="user-profile-container">
            <button onClick={() => setExpanded(prev => !prev)} className="link user-profile">
                {user.username}
            </button>
            <div ref={menuRef} className={expanded ? "user-profile-menue plain-text" : "hidden"}>
                <span className="cart-icon-container ">
                    <CartButton />
                </span>
                <Link to={PAGE_URLS.editprofile} className="link">تعديل الحساب</Link>
                <Link to={PAGE_URLS.all_orders} className="link">طلباتي</Link>
                <LogoutButton />
                <span className="close-button-container">
                    <button className="link" onClick={() => setExpanded(prev => !prev)}>غلق</button>
                </span>
            </div>

        </span>
    );
}
function CartButton() {
    return (
        <Link aria-label="السلة" to={PAGE_URLS.cart}>
            <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
        </Link>
    );
}
function LoginButton() {
    return (
        <Link style={{margin:"0" }} className="button" to="login">
            تسجيل الدخول
        </Link>
    );
}
function LogoutButton() {
    const [loggingout, setLoggingout] = useState(false);
    const logout = useLogout();
    return (
        <button onClick={() => {
            setLoggingout(true);
            logout().then(() => setLoggingout(false));
        }
        } disabled={loggingout} className="link" >
            تسجيل الخروج
        </button>
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
export default Navbar;
