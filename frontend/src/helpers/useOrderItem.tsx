﻿import { useEffect, useState } from "react";
import { OrderItem } from "../utils/Order";
import api from "./api";
import { isAxiosError } from "axios";
import ErrorMessage from "../components/errorMessage/Error";

function useOrderItem(order_id?: string) {
    const [order, setOrder] = useState<OrderItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const fetchOrder = (order_id?: string) => {
        if (order_id) {
            if (!isLoading) {
                setIsLoading(true);
            }
            if (errorMessage) {
                setErrorMessage("");
            }
            if (order) {
                setOrder(null);
            }
            api
                .get(`/sellers/orders/${order_id}`)
                .then((response) => {
                    const data = response.data;
                    setOrder(data.order);
                })
                .catch((error) => {
                    console.log(error);
                    if (isAxiosError(error) && error.response?.status === 404) {
                        /* empty */
                    } else {
                        setErrorMessage("حدث خطأ ما.");
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchOrder(order_id), [order_id]);
    let messageElement;
    if (order) {
        messageElement = null;
    }
    else if (!order_id || (!order && !errorMessage && !isLoading)) {
        messageElement = (
            <ErrorMessage className="center-text big-message" >
                الطلب غير موجود.
            </ErrorMessage>
        );
    } else if (isLoading) {
        messageElement = (
            <div>
                <div className="loader center-loader" />
            </div>
        );
    } else if (errorMessage) {
        messageElement = (
            <ErrorMessage className="center-text big-message" >
                {errorMessage}
                < button className="link" onClick={() => fetchOrder(order_id)
                }>
                    إعادة المحاولة.
                </button>
            </ErrorMessage>
        );
    }
    return { order, messageElement };
}
export default useOrderItem;