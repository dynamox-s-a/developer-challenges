export interface IProduct {
  id: number;
  name: string;
  price: number;
  perishable: string;
  expirationDate: string;
  manufactureDate: string;
  quantity: number;
}

export interface IProductsState {
  products: IProduct[];
  newProduct: IProduct;
  loading: boolean;
  productID: number;
}
