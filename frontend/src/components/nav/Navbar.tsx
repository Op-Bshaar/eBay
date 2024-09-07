import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useIsAuthenticated } from "../../api";
import { useLogout } from "../../context/AuthenticationContext";
import { useAuthenticationContext } from "../../context/AuthenticationContext";
import { useState } from "react";
import { BASE_URL } from "../../constants/BaseUrl";

function Navbar() {
    const { user } = useAuthenticationContext();
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const logout = useLogout();
    const isAuthenticated = useIsAuthenticated();
    const handleSearch = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/api/products/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Fetch error:", error);
            setError("An error occurred while fetching products.");
        }
    };
    return (
        <>
            <nav className="navbar tajawal-extralight">
                <h1>سوق</h1>
                {user ? (
                    <li style={{ listStyleType: "none" }}>
                        <span>أهلا {user.username}</span>
                    </li>
                ) : (
                    <Link to="/register">سجل دخول</Link>
                )}
                <div onSubmit={handleSearch} className="search-bar">
                    <input
                        id="search-by-name"
                        type="search"
                        placeholder="ابحث باسم المنتج"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
                </div>
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
