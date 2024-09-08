class Product {
    public Price: number;
    public PName: string;
    public SellerName: string;
    public Category: string;
    constructor(Price: number, PName: string, SellerName: string, Category: string)
    {
        this.Price = Price;
        this.PName = PName;
        this.SellerName = SellerName;
        this.Category = Category;
    }

}
export default Product;