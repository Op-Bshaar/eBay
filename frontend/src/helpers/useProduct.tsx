import { ReactNode, useEffect, useState } from "react";
import api from "./api";
import { isAxiosError } from "axios";
import "../styles/Loader.css";
import Product from "../utils/Product";
import ErrorMessage from "../components/errorMessage/Error";

function useProduct(productId:string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const fetch = () => {
        if (!isLoading) {
            setIsLoading(true);
        }
        if (errorMessage) {
            setErrorMessage("");
        }
        if (product) {
            setProduct(null);
        }
        api.get(`/products/${productId}`).then(response => {
            const data = response.data;
            setProduct(data);
        }).catch(error => {
            let message = 'حدث خطأ ما.'
            if (isAxiosError(error) && error.request && !error.response) {
                message = 'تعذر الاتصال, تحقق من الشبكة.';
            }
            setErrorMessage(message);
        }).finally(() =>
            setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetch, []);
    let messageElement: ReactNode = null;
    if (isLoading) {
        messageElement = <div className="loader center-loader" />
    }
    else if (errorMessage) {
        messageElement = <ErrorMessage>
            {errorMessage}
            <button className="link" onClick={fetch}>إعادة الاتصال.</button>
        </ErrorMessage>;
    }
    return { product, messageElement };
}
export default useProduct;