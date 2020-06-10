class Product {
    constructor(name, description, image, price, quantity) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }
}
const productConverter = {
    toFirestore(product) {
        return {
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
            quantity: product.quantity,
        }
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return new Product(data.name, data.description, data.image, data.price, data.quantity)
    }
};
export default  Product;
export {productConverter}