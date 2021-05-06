export interface Category {
  id: string,
  name: string,
  slug: string,
  icon: string
}

export interface IVenture {
  id: string;
  account: string;
  phone: string;
  category?: string;
}
