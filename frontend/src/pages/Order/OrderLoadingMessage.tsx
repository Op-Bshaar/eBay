﻿import Order from "../../utils/Order";
import "../../styles/Loader.css";
import "./OrderPage.css";
import "./OrderLoadingMessage.css";
import ErrorMessage from "../../components/errorMessage/Error";
interface OrderLoadingMessageProps { isLoadingOrder?:boolean, loadingOrderErrorMessage?:string, reloadOrder?:() => void, order:Order|null };
function OrderLoadingMessage({ isLoadingOrder, loadingOrderErrorMessage, reloadOrder, order }: OrderLoadingMessageProps) {
    if (isLoadingOrder) {
        return (
            <div className="center-text order-loader-container">
                <div className="loader" />
            </div>
        );
    }
    if (loadingOrderErrorMessage) {
        return (
            <ErrorMessage className="tajawal-extralight big-message absolute-center">
                {loadingOrderErrorMessage}
                {reloadOrder &&
                    <button onClick={reloadOrder} className="link">
                        أعد المحاولة.
                    </button>
                }
            </ErrorMessage>
        );
    }
    if (!order) {
        <ErrorMessage className="tajawal-extralight big-message absolute-center">
            الطلب غير موجود.
        </ErrorMessage>
    }
    return null;
}

export default OrderLoadingMessage;