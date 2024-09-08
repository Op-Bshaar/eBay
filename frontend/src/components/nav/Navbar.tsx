import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../api";
import { useLogout } from "../../context/AuthenticationContext";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useRef } from "react";

function Navbar() {
    const navigate = useNavigate();
    const { user } = useAuthenticationContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const logout = useLogout();
    const isAuthenticated = useIsAuthenticated();
    const handleSearch = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const query = inputRef.current?.value;
        if (query) {
            navigate(`products/search?query=${encodeURIComponent(query)}`);
        }
        else {
            navigate('/');
        }
    };
    return (
        <>
            <nav className="navbar tajawal-extralight">
                <h1>سوق</h1>
                {user && (<span>أهلا {user.username}</span>)}
                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        id="search-by-name"
                        type="search"
                        placeholder="ابحث باسم المنتج"
                        ref={inputRef }
                    />
                    <button className="wrapper-button" type="submit"><FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} /></button>
                </form>
                <Link className="nav-link " to="/">
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
            </nav>
        </>
    );
}

export default Navbar;
