import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useIsAuthenticated } from "../../api";
import { useLogout } from "../../context/AuthenticationContext";

function Navbar() {
    const logout = useLogout();
    const isAuthenticated = useIsAuthenticated();
    return (
        <>
            <nav className="navbar tajawal-extralight">
                <h1>سوق</h1>
                <div className="search-bar">
                    <input id="search-by-name" type="search" placeholder="ابحث باسم المنتج" />
                    <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
                </div>
                <Link className="nav-link " to="/" >البيع في سوق</Link>
                {
                    isAuthenticated ?
                        <button onClick={logout} className="button" >تسجيل الخروج</button> :
                        <Link className="button" to="login">تسجيل الدخول</Link>
                }

            </nav>
        </>
    );
}

export default Navbar;
