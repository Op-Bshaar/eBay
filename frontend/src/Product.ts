class Product {
    public Price: number;
    public PName: string;
    public SellerName: string;
    public Category: string;
    public PID: string;
    constructor(Price: number, PName: string, SellerName: string, Category: string, PID: string)
    {
        this.Price = Price;
        this.PName = PName;
        this.SellerName = SellerName;
        this.Category = Category;
        this.PID = PID;
    }

}
export default Product;