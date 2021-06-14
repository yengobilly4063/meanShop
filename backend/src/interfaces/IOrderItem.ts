import { IProduct } from './IProduct';

export interface IOrderItem {
  id?: string;
  product: IProduct;
  quantity: number;
}
