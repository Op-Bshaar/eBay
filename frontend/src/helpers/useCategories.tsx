import { ReactNode, useEffect, useState } from "react";
import { Category } from "../utils/Category";
import api from "./api";
import { isAxiosError } from "axios";
import "../styles/Loader.css";
import ErrorMessage from "../../../admindashboard/src/components/errorMessage/Error";

function useCategories() {
    const [categories, setCategoris] = useState<Category[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const fetch = () => {
        if (!isLoading) {
            setIsLoading(true);
        }
        if (errorMessage) {
            setErrorMessage("");
        }
        if (categories) {
            setCategoris(null);
        }
        api.get('/categories').then(response => {
            const data = response.data;
            setCategoris(data);
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
    let messageElement:ReactNode = null;
    if (isLoading) {
        messageElement = <div className="loader center-loader" />
    }
    else if (errorMessage) {
        messageElement = <ErrorMessage>
            {errorMessage}
            <button className="link" onClick={fetch }>إعادة الاتصال.</button>
        </ErrorMessage>;
    }
    return { categories, messageElement };
}
export default useCategories;