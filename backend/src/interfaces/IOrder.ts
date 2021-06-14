import { IOrderItem } from './IOrderItem';
import { IUser } from './IUser';

export interface IOrder {
  id?: string;
  orderItems: Array<IOrderItem>;
  shippingAddress1: string;
  shippingAddress2?: string;
  city: string;
  zip: string;
  country: string;
  phone: number;
  status: string;
  totalPrice: number;
  user: IUser;
  dateOrdered: Date;
}
