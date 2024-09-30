import { createContext, useContext } from "react";
import Seller from "../../utils/Seller";

interface ISellerContext { seller: Seller | null, setSeller: (seller: Seller | null) => void }
export const SellerContext = createContext<ISellerContext | undefined>(undefined);
export function useSellerContext(): ISellerContext {
    const context = useContext(SellerContext);
    if (!context) {
        throw new Error("useSellerContext must be used within a SellerContextProviedr");
    }
    return context;
}