import type { Product, Category, UpdateCard } from '../types';

export const trendingProducts: Product[] = [
    {
        id: '1',
        name: 'Half Running Set',
        price: 99,
        originalPrice: 129,
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=500&fit=crop',
        badge: 'SALE',
        colors: ['#FFFFFF', '#FFD700', '#000000'],
        rating: 4,
        reviewCount: 12
    },
    {
        id: '2',
        name: 'Formal Men Lowers',
        price: 99,
        originalPrice: 129,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
        badge: 'NEW',
        colors: ['#FF4500', '#4169E1'],
        rating: 5,
        reviewCount: 8
    },
    {
        id: '3',
        name: 'Half Running Suit',
        price: 99,
        originalPrice: 129,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop',
        colors: ['#40E0D0', '#FFA500'],
        rating: 4,
        reviewCount: 15
    },
    {
        id: '4',
        name: 'Half Fancy Lady Dress',
        price: 99,
        originalPrice: 129,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
        badge: 'HOT',
        colors: ['#9ACD32', '#4169E1', '#FF6347'],
        rating: 5,
        reviewCount: 32
    }
];

export const featuredProducts: Product[] = [
    {
        id: '5',
        name: 'Women Striped Shirt Dress',
        price: 99,
        originalPrice: 129,
        image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop',
        badge: 'HOT',
        rating: 4,
        reviewCount: 5
    },
    {
        id: '6',
        name: 'Boys Solid Sweatshirt',
        price: 129,
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop',
        badge: 'NEW',
        discount: 40,
        rating: 0,
        reviewCount: 0
    },
    {
        id: '7',
        name: 'Girls Floral Print Jumpsuit',
        price: 99,
        originalPrice: 129,
        image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=500&fit=crop',
        badge: 'SOLD OUT',
        rating: 5,
        reviewCount: 32
    },
    {
        id: '8',
        name: 'Girls Solid A-Line Dress',
        price: 50,
        originalPrice: 149,
        image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=500&fit=crop',
        badge: 'NEW',
        discount: 55,
        rating: 0,
        reviewCount: 0
    }
];

export const categories: Category[] = [
    {
        id: '1',
        name: "Men's Wear",
        icon: '👔',
        link: '/category/mens-wear'
    },
    {
        id: '2',
        name: "Kid's Wear",
        icon: '👕',
        link: '/category/kids-wear'
    },
    {
        id: '3',
        name: 'Accessories',
        icon: '🎒',
        link: '/category/accessories'
    },
    {
        id: '4',
        name: "Men's Shoes",
        icon: '👟',
        link: '/category/mens-shoes'
    },
    {
        id: '5',
        name: 'Television',
        icon: '📺',
        link: '/category/television'
    },
    {
        id: '6',
        name: "Men's Pants",
        icon: '👖',
        link: '/category/mens-pants'
    }
];

export const updates: UpdateCard[] = [
    {
        id: '1',
        title: 'Look with New Style at 15% Awesome Vacation',
        description: 'Discover our latest collection with amazing discounts for your perfect vacation wardrobe.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop',
        link: '/updates/1'
    },
    {
        id: '2',
        title: 'High Style at 35% Off - Limited Time Offer',
        description: 'Elevate your fashion game with our premium collection now at incredible prices.',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
        link: '/updates/2'
    },
    {
        id: '3',
        title: 'Bring the Spring with our 40% Sale',
        description: 'Fresh new arrivals for the spring season with unbeatable discounts.',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
        link: '/updates/3'
    }
];

// Additional products for different categories
export const mensProducts: Product[] = [
    {
        id: 'm1',
        name: "Men's Classic Polo",
        price: 79,
        originalPrice: 99,
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=500&fit=crop',
        badge: 'SALE',
        rating: 4,
        reviewCount: 24
    },
    {
        id: 'm2',
        name: "Men's Casual Shirt",
        price: 89,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop',
        badge: 'NEW',
        rating: 5,
        reviewCount: 18
    },
    {
        id: 'm3',
        name: "Men's Denim Jacket",
        price: 129,
        originalPrice: 169,
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop',
        rating: 4,
        reviewCount: 45
    },
    {
        id: 'm4',
        name: "Men's Sport Shorts",
        price: 49,
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop',
        badge: 'HOT',
        rating: 4,
        reviewCount: 67
    }
];

export const womensProducts: Product[] = [
    {
        id: 'w1',
        name: "Women's Summer Dress",
        price: 119,
        originalPrice: 149,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop',
        badge: 'SALE',
        colors: ['#FF69B4', '#87CEEB', '#98FB98'],
        rating: 5,
        reviewCount: 89
    },
    {
        id: 'w2',
        name: "Women's Blazer",
        price: 159,
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop',
        badge: 'NEW',
        rating: 4,
        reviewCount: 34
    },
    {
        id: 'w3',
        name: "Women's Casual Top",
        price: 59,
        originalPrice: 79,
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop',
        colors: ['#FFFFFF', '#000000', '#FF0000'],
        rating: 4,
        reviewCount: 156
    },
    {
        id: 'w4',
        name: "Women's Jeans",
        price: 99,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
        badge: 'HOT',
        rating: 5,
        reviewCount: 203
    }
];

export const kidsProducts: Product[] = [
    {
        id: 'k1',
        name: "Kids Rainbow T-Shirt",
        price: 29,
        originalPrice: 39,
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
        badge: 'SALE',
        rating: 5,
        reviewCount: 45
    },
    {
        id: 'k2',
        name: "Kids Denim Overalls",
        price: 49,
        image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=500&fit=crop',
        badge: 'NEW',
        rating: 4,
        reviewCount: 28
    },
    {
        id: 'k3',
        name: "Kids Sport Set",
        price: 39,
        originalPrice: 59,
        image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop',
        colors: ['#FF1493', '#00CED1', '#FFD700'],
        rating: 5,
        reviewCount: 67
    },
    {
        id: 'k4',
        name: "Kids Winter Jacket",
        price: 79,
        image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&h=500&fit=crop',
        badge: 'HOT',
        rating: 4,
        reviewCount: 92
    }
];