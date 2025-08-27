// Product interface moved to types/product.ts
export type { Product, CartItem } from './product';

export interface Category {
    id: string;
    name: string;
    icon: string;
    link: string;
}

export interface UpdateCard {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
}