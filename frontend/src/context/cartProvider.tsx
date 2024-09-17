import { ReactNode, useEffect, useRef, useState } from "react";
import { CartContext } from "./CartContext";
import api,{useIsAuthenticated} from "../helpers/api";
import { CartItem } from "../utils/Cart";
import { isAxiosError } from "axios";
function CartProvider({ children }: { children: ReactNode }) {
    const [cartItemsState, setCartItemsState] = useState<CartItem[]>([]);
    const [isSynced, setIsSynced] = useState(false);
    const isAuthenticated = useIsAuthenticated();
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCartResponse = async (apiCall: () => Promise<any>) => {
        try {
            if (isLoading) {
                return;
            }
            const changesFromLastUpdateBeforeLoad = changesFromLastUpdate.current;
            setIsLoading(true);
            setErrorMessage("");
            const response = await apiCall();
            const data: CartItem[] = response.data.cart;
            // check if no updates happend while waiting for response
            if (changesFromLastUpdate.current === changesFromLastUpdateBeforeLoad) {
                setCartItemsState(data);
                setChangesFromLastUpdate(0);
            }
        }
        catch (error) {
            handleErrors(error, setErrorMessage);
        }
        finally {
            setIsLoading(false);
        }
    }
    const reloadCart = () => handleCartResponse(() => api.get('/cart'));
    const updateCart = () => handleCartResponse(() => api.put('/cart', {
        cart: cartItemsState.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity
        }))
    }));
    // load cart on first visit and when authentication changes.
    useEffect(() => {
        if (isAuthenticated) {
            reloadCart()
        }
        else {
            setCartItems([]);
            setErrorMessage("");
            setChangesFromLastUpdate(0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])
    return (
        <CartContext.Provider value={{
            cartItems: cartItemsState,
            errorMessage: errorMessage,
            isCartLoading: isLoading ,
            isCartSynced: isSynced,
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
    else {
        setErrorMessage(genericError);
    }
}
export default CartProvider;
