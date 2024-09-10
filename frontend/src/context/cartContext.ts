import { createContext, useContext } from "react";
import { CartItem } from "../utils/itemdata";


interface ICart{
    CartItem:CartItem[];
    price:number,
    addItemToCart:( productId:string)=>void;
    updateItemToCart:( productId:string,quantity:number)=>void;
    removeItemToCart:( productId:string)=>void;
    // clearCart:()=>void;
}

export const CartContext = createContext<ICart>({
    CartItem:[],
    price:0,
    addItemToCart:()=>{},
    updateItemToCart:()=>{},
    removeItemToCart:()=>{},
})

export const useCart = ()=>useContext(CartContext);