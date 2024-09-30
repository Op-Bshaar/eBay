import { ReactNode, useState } from "react";
import Seller from "../../utils/Seller";
import { SellerContext } from "./SellerContext";

function SellerProvider({ children }: { children: ReactNode }) {
    const [seller, setSeller] = useState<Seller | null>(null);
    return (
        <SellerContext.Provider value={{ seller, setSeller }} >
            {children}
        </SellerContext.Provider>
    );
}
export default SellerProvider;
