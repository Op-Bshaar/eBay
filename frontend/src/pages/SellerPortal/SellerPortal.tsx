import {  NavLink, Outlet } from "react-router-dom";
import "./SellerPortal.css";
function SellerPortal() {
    return (
        <>
            <nav className="seller-nav tajawal-extralight">
                <NavLink
                    className={() => location.pathname.startsWith('/seller-portal/products') ? "seller-nav-sellected" : ""}
                    to="products">
                    منتجاتي
                </NavLink>
                <NavLink
                    className={() => location.pathname.startsWith('/seller-portal/orders') ? "seller-nav-sellected" : ""}
                    to="orders">
                    طلباتي
                </NavLink>
                <NavLink
                    className={() => location.pathname.startsWith('/seller-portal/add-product') ? "seller-nav-sellected" : ""}
                    to="add-product">
                    إضافة منتج
                </NavLink>
            </nav>
            <div className="seller-rating">
                تقييمي: لا يوجد تقييم.
            </div>
            <Outlet />
        </>
    );
}

export default SellerPortal;