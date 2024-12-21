export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  slug: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}