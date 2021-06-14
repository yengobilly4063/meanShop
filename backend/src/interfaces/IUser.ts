export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  street: string;
  apartment?: string;
  city?: string;
  zip?: string;
  country?: string;
  phone: number;
  isAdmin?: boolean;
}
