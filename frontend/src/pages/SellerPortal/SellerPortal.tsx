﻿import {  NavLink, Outlet, useNavigate } from "react-router-dom";
import "./SellerPortal.css";
import { useEffect, useState } from "react";
import Seller from "../../utils/Seller";
import api from "../../helpers/api";
import ErrorMessage from "../../components/errorMessage/Error";
import { useRequireAuthentication } from "../login/LoginRedirect";
function SellerPortal() {
    const navigate = useNavigate();
    useRequireAuthentication();
    const { seller, messageElement } = useSeller();
    const [orderId, setOrderId] = useState("");
    const handleNavigateToOrderDetails = () => {
        if (orderId) {
            navigate(`/seller-portal/orders/${orderId}`); 
        } else {
            alert("معذره");
        }
    };
    if (messageElement) {
        return messageElement
    }
    return (
        <>
            <nav className="seller-nav">
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
                تقييمي: {seller?.rating ? `${seller.rating} / 5` : "لا توجد تقييمات بعد" }.
            </div>

            <div className="order-id-input">
                <input 
                    type="text" 
                    placeholder="أدخل رقم الطلب" 
                    value={orderId} 
                    onChange={(e) => setOrderId(e.target.value)} 
                />
                <button onClick={handleNavigateToOrderDetails} className="navigate-button">
                    عرض تفاصيل الطلب
                </button>
            </div>
            <Outlet />
        </>
    );
}
function useSeller() {
    const [seller, setSeller] = useState<Seller | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const fetchSeller = () => {
        if (!isLoading) {
            setIsLoading(true);
        }
        if (errorMessage) {
            setErrorMessage("");
        }
        if (seller) {
            setSeller(null);
        }
        api
            .get(`/seller`)
            .then((response) => {
                const data = response.data;
                if (data.seller) {
                    setSeller(data.seller);
                }
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage("حدث خطأ ما.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchSeller, []);
    let messageElement;
    if (seller) {
        messageElement = null;
    }
    else if (isLoading) {
        messageElement = (
            <div style={{marginTop:"20vh"} }>
                <div className="loader center-loader" />
            </div>
        );
    } else if (errorMessage) {
        messageElement = (
            <ErrorMessage className="center-text big-message">
                {errorMessage}
                <button className="link" onClick={() => fetchSeller()}>
                    إعادة المحاولة.
                </button>
            </ErrorMessage>
        );
    }
    return { seller, messageElement };
}
export default SellerPortal;