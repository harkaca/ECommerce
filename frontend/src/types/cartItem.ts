export interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}