export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    backImage?: string;
    badge?: 'NEW' | 'SALE' | 'HOT' | 'SOLD OUT';
    discount?: number;
    colors?: string[];
}

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