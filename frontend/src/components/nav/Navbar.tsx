import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <>
        <nav className="nav tajawal-extralight">
            <h1>سوق</h1>
            <div className="search-bar">
                <input id = "search-by-name" type="search" placeholder="ابحث باسم المنتج" />
                <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
            </div>
            <Link className="nav-link " to="/" >البيع في سوق</Link>
            <Link className="button nav-button" to="login">تسجيل الدخول</Link>
            </nav>
        </>
    );
}

export default Navbar;
