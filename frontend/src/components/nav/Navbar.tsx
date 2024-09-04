import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Hero from "../../pages/Hero/Hero";

function Navbar() {
    return (
        <>
        <nav className="nav tajawal-extralight">
            <h1>سوق</h1>
            <div className="search-bar">
                <input type="search" placeholder="ابحث باسم المنتج" />
                <FontAwesomeIcon tabIndex={0} role="button" className="search-icon" icon={faMagnifyingGlass} />
            </div>
            <Link className="nav-link " to="/" >البيع في سوق</Link>
            <Link className="button nav-button" to="login">تسجيل الدخول</Link>
            </nav>
        <Hero/>
        </>
    );
}

export default Navbar;
