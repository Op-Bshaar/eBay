import { Category } from "./Category";

class Product {
    public price: string;
    public title: string;
    public id: string;
    public description: string;
    public image: string
    public seller_id: string;
    public category_id: string | null;
    public isAvailable: boolean;
    constructor(id: string, price: string, seller_id: string, title: string, description: string, image: string, isAvailable:boolean, category: Category | null = null)
    {
        this.id = id;
        this.price = price;
        this.seller_id = seller_id;
        this.title = title;
        this.description= description;
        this.image= image;
        this.isAvailable = isAvailable;
        this.category_id = category;
    }

}
/**
 * reads product from value returned from api
 * @param product_data json object returned from api call
 * @returns product object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readProduct(product_data: any): Product {
    return new Product(product_data.id,
        product_data.price,
        product_data.seller_id,
        product_data.title,
        product_data.description,
        product_data.image,
        product_data.isAvailable,
        product_data.category ?? null
    )
}
export default Product;