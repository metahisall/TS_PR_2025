// Типи
type BaseProduct = {
  id: number;
  name: string;
  price: number;
};

type Books = BaseProduct & {
  category: "books";
  autor: string | string[];
};

type Clothing = BaseProduct & {
  category: "clothing";
  size: "S" | "M" | "L" | "XL";
  color: string;
};

type Electronics = BaseProduct & {
  category: "electronics";
  type: "phone" | "laptop" | "tablet";
};

type CartItem<T> = {
  product: T;
  quantity: number;
};

// кошик

const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
  return cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

const addToCart = <T extends BaseProduct>(
  cart: CartItem<T>[],
  product: T | undefined,
  quantity: number
): CartItem<T>[] => {
  if (product) {
    const findItem = cart.find((item) => item.product.id === product.id);
    if (findItem) {
      findItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
  }
  return cart;
};

// Фільтрація та пошук
const filterByPrice = <T extends BaseProduct>(
  products: T[],
  maxPrice: number
): T[] => {
  return products.filter((product) => product.price <= maxPrice);
};

const findProduct = <T extends BaseProduct>(
  products: T[],
  id: number
): T | undefined => {
  return products.find((product) => product.id === id);
};

function test(): void {
  console.log("Test");

  // Створення тестових даних
  const electronics: Electronics[] = [
    {
      id: 1,
      name: "Телефон",
      price: 10000,
      category: "electronics",
      type: "phone",
    },
  ];
  const books: Books[] = [
    {
      id: 2,
      name: "Книга",
      price: 500,
      category: "books",
      autor: "Автор",
    },
  ];
  const clothing: Clothing[] = [
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
  const cart: CartItem<BaseProduct>[] = addToCart([], phone, 1);
  const total = calculateTotal(cart);

  console.log("Загальна вартість кошика:", total);

  addToCart(cart, findProduct(books, 2), 1);
  addToCart(cart, findProduct(clothing, 3), 2);

  console.log("Кошик після додавання товарів:", cart);

  const filteredProducts = filterByPrice(
    [...electronics, ...books, ...clothing],
    1000
  );

  console.log(calculateTotal(cart));

  console.log("Товари з ціною до 1000:", filteredProducts);
}

test();
