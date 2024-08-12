interface Product {
  productId: string;
  variantId: string;
}

interface OrderOption {
  amount: string;
  currency: string;
  notes: {
    products: Product[];
  };
}

export type { OrderOption, Product }