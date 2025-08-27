// Product interface moved to types/product.ts
export type { Product, CartItem } from './product';

export interface Category {
    id: string;
    name: string;
    slug?: string;
    icon: string;
    link?: string;
    image?: string;
}

export interface UpdateCard {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
}