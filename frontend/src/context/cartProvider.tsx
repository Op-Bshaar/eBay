import { ReactNode, useRef, useState } from "react";
import { CartContext } from "./CartContext";
import api from "../api";
import { CartItem } from "../Cart";
import { isAxiosError } from "axios";
function CartProvider({ children }: { children: ReactNode }) {
    const [cartItemsState, setCartItemsState] = useState<CartItem[]>([]);
    const [isSynced, setIsSynced] = useState(true);
    const changesFromLastUpdate = useRef(0);
    const setChangesFromLastUpdate = (changes: number) => {
        changesFromLastUpdate.current = changes;
        const _isSynced = changes === 0;
        if (isSynced !== _isSynced) {
            setIsSynced(_isSynced);
        }
    }
    const setCartItems = (cartItems: CartItem[]) => {
        setCartItemsState(cartItems);
        setChangesFromLastUpdate(changesFromLastUpdate.current + 1);
    }
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading , setIsLoading] = useState(false);

    const reloadCart = async () => {
        try {
            const changesFromLastUpdateBeforeLoad = changesFromLastUpdate.current;
            setIsLoading(true);
            setErrorMessage("");
            const response = await api.get('/cart');
            const data: CartItem[] = response.data;
            // check if no updates happend while waiting for response
            if (changesFromLastUpdate.current === changesFromLastUpdateBeforeLoad) {
                setCartItemsState(data);
                setChangesFromLastUpdate(0);
            }
        }
        catch (error) {
            handleErrors (error, setErrorMessage);
        }
        finally {
            setIsLoading(false);
        }
    }
    const updateCart = async () => {
        try {
            const changesFromLastUpdateBeforeLoad = changesFromLastUpdate.current;
            setIsLoading(true);
            setErrorMessage("");
            const response = await api.put('/cart');
            const data: CartItem[] = response.data;
            // check if no updates happend while waiting for response
            if (changesFromLastUpdate.current === changesFromLastUpdateBeforeLoad) {
                setCartItemsState(data);
                setChangesFromLastUpdate(0);
            }
        }
        catch (error) {
            handleErrors (error, setErrorMessage);
        }
        finally {
            setIsLoading(false);
        }
    }
    return (
        <CartContext.Provider value={{
            cartItems: cartItemsState,
            errorMessage: errorMessage,
            isLoading: isLoading ,
            isSynced: isSynced,
            setCartItems: setCartItems,
            reloadCart: reloadCart,
            updateCart: updateCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleErrors (error: any, setErrorMessage: (errorMessage: string) => void) {
    const genericError = "حدث خطأ ما.";
    if (isAxiosError(error)) {
        if (error.request && !error.response) {
            setErrorMessage("تعذر الاتصال, تحقق من الاتصال بالشبكة.");
        }
        else if (error.response) {
            // Unautherized
            if (error.response.status === 401) {
                setErrorMessage("قم بتسجيل الدخول لعرض السلة.");
            }
            else {
                setErrorMessage(genericError);
            }
        }
        else {
            setErrorMessage(genericError);
        }
    }
}
export default CartProvider;
