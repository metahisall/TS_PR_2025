"use strict";
// кошик
const calculateTotal = (cart) => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};
const addToCart = (cart, product, quantity) => {
    if (product) {
        const findItem = cart.find((item) => item.product.id === product.id);
        if (findItem) {
            findItem.quantity += quantity;
        }
        else {
            cart.push({ product, quantity });
        }
    }
    return cart;
};
// Фільтрація та пошук
const filterByPrice = (products, maxPrice) => {
    return products.filter((product) => product.price <= maxPrice);
};
const findProduct = (products, id) => {
    return products.find((product) => product.id === id);
};
function test() {
    console.log("Test");
    // Створення тестових даних
    const electronics = [
        {
            id: 1,
            name: "Телефон",
            price: 10000,
            category: "electronics",
            type: "phone",
        },
    ];
    const books = [
        {
            id: 2,
            name: "Книга",
            price: 500,
            category: "books",
            autor: "Автор",
        },
    ];
    const clothing = [
        {
            id: 3,
            name: "Футболка",
            price: 300,
            category: "clothing",
            size: "M",
            color: "Червоний",
        },
    ];
    // Тестування функцій
    const phone = findProduct(electronics, 1);
    const cart = addToCart([], phone, 1);
    const total = calculateTotal(cart);
    console.log("Загальна вартість кошика:", total);
    addToCart(cart, findProduct(books, 2), 1);
    addToCart(cart, findProduct(clothing, 3), 2);
    console.log("Кошик після додавання товарів:", cart);
    const filteredProducts = filterByPrice([...electronics, ...books, ...clothing], 1000);
    console.log(calculateTotal(cart));
    console.log("Товари з ціною до 1000:", filteredProducts);
}
test();
