class Product {
    public price: string;
    public title: string;
    //public SellerName: string;
    //public Category: string;
    public id: string;
    public description: string;
    public image: string
    public seller_id: string;
    constructor(id: string,price: string,seller_id: string, title: string, /**SellerName: string, Category: string, PID: string,**/ description: string, image: string)
    {
        this.id = id;
        this.price = price;
        this.seller_id = seller_id;
        this.title = title;
        this.description= description;
        this.image= image;
    }

}
export default Product;