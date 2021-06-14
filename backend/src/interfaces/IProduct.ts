import { ICategory } from './ICategory';

export interface IProduct {
  id?: string;
  name: string;
  image: string;
  brand: string;
  price: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  description: string;
  category: ICategory;
  // reviews: Array<Object>;
  countInStock: number;
  richDescription: string;
  images: Array<string>;
  dateCreated: Date;
}
