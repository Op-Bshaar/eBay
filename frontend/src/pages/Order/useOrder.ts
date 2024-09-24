import { useCallback, useEffect, useState } from "react";
import Order from "../../utils/Order";
import api from "../../helpers/api";
import { isAxiosError } from "axios";

function useOrder(order_id?:string) {
    const [isLoadingOrder, setIsLoading] = useState(true);
    const [loadingOrderErrorMessage, setErrorMessage] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const reloadOrder = useCallback(() => {
        setIsLoading(true);
        setErrorMessage("");
        if (!order_id) {
            setOrder(null);
            return;
        }
        api
            .get(`/orders/${order_id}`)
            .then((response) => {
                setOrder(response.data);
            })
            .catch((error) => {
                let message = "حدث خطأ ما.";
                if (isAxiosError(error)) {
                    if (error.request && !error.response) {
                        message = "تعذر الاتصال, تحقق من الشبكة.";
                    }
                    else if (error.response && error.response.status === 404) {
                        message ="لم يتم العثور على الطلب."
                    }
                }
                setErrorMessage(message);
            })
            .finally(() => setIsLoading(false));
    },[order_id]);
    useEffect(reloadOrder, [reloadOrder]);
    return { order, isLoadingOrder, loadingOrderErrorMessage, reloadOrder };
}
export default useOrder;