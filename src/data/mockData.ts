import type { Product, Category, UpdateCard } from '../types';

export const trendingProducts: Product[] = [
    {
        id: '1',
        name: 'Women Printed Gown',
        price: 25000,
        originalPrice: 35000,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
        badge: 'SALE',
        colors: ['#FF69B4', '#FFB6C1', '#FFC0CB']
    },
    {
        id: '2',
        name: 'Light Blue Shirt',
        price: 18000,
        originalPrice: 22000,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop',
        badge: 'NEW',
        colors: ['#87CEEB', '#4682B4']
    },
    {
        id: '3',
        name: 'Woman T-Shirt',
        price: 15000,
        originalPrice: 20000,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop',
        colors: ['#FFB6C1', '#98FB98', '#DDA0DD']
    },
    {
        id: '4',
        name: 'Yellow Casual Sweater',
        price: 28000,
        originalPrice: 35000,
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=500&fit=crop',
        badge: 'HOT',
        colors: ['#FFD700', '#FFA500', '#FF6347']
    }
];

export const featuredProducts: Product[] = [
    {
        id: '5',
        name: 'Frock Dress',
        price: 32000,
        originalPrice: 45000,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
        badge: 'SALE'
    },
    {
        id: '6',
        name: 'Mini Silver Dress',
        price: 38000,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop',
        badge: 'NEW',
        discount: 40
    },
    {
        id: '7',
        name: 'Gray Shrug',
        price: 12000,
        originalPrice: 18000,
        image: 'https://images.unsplash.com/photo-1445384763658-0400939829cd?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop'
    },
    {
        id: '8',
        name: 'Sleeveless Dress',
        price: 22000,
        originalPrice: 35000,
        image: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop',
        badge: 'HOT',
        discount: 35
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
        name: "Kids Wear",
        icon: '👶',
        link: '/category/kids-wear'
    },
    {
        id: '3',
        name: 'Accessories',
        icon: '👜',
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
        name: 'Beautician',
        icon: '💄',
        link: '/category/beautician'
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
        title: 'Look with Jing offer an 11% awesome Vacation',
        description: 'Discover our latest collection with amazing discounts for your perfect vacation wardrobe. Get ready for summer with style.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop',
        link: '/blog/vacation-offers'
    },
    {
        id: '2',
        title: 'Look with Jing offer an 11% awesome Vacation',
        description: 'Elevate your fashion game with our premium collection now at incredible prices. Limited time offer.',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
        link: '/blog/premium-collection'
    },
    {
        id: '3',
        title: 'Look with Jing offer an 11% awesome Vacation',
        description: 'Fresh new arrivals for the spring season with unbeatable discounts. Shop now and save big.',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
        link: '/blog/spring-arrivals'
    }
];

// Men's products
export const mensProducts: Product[] = [
    {
        id: 'm1',
        name: "Formal Denim Jeans",
        price: 25000,
        originalPrice: 32000,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=500&fit=crop',
        badge: 'SALE'
    },
    {
        id: 'm2',
        name: "Formal Straight Jeans",
        price: 22000,
        image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
        badge: 'NEW'
    },
    {
        id: 'm3',
        name: "Slim Fit Dress Shirt",
        price: 35000,
        originalPrice: 45000,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'
    },
    {
        id: 'm4',
        name: "Casual Polo Shirt",
        price: 18000,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1506629905898-b9b1f03b5b84?w=400&h=500&fit=crop',
        badge: 'HOT'
    }
];

export const womensProducts: Product[] = [
    {
        id: 'w1',
        name: "Women Black T-Shirt",
        price: 12000,
        originalPrice: 18000,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        badge: 'SALE',
        colors: ['#000000', '#FFFFFF', '#FF69B4']
    },
    {
        id: 'w2',
        name: "Fashion Yellow Top",
        price: 15000,
        image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
        badge: 'NEW'
    },
    {
        id: 'w3',
        name: "Printed Girls T-shirt",
        price: 10000,
        originalPrice: 14000,
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop',
        colors: ['#FF69B4', '#87CEEB', '#98FB98']
    },
    {
        id: 'w4',
        name: "Casual Summer Dress",
        price: 28000,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop',
        badge: 'HOT'
    }
];

export const kidsProducts: Product[] = [
    {
        id: 'k1',
        name: "Kids Rainbow T-Shirt",
        price: 8000,
        originalPrice: 12000,
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop',
        badge: 'SALE'
    },
    {
        id: 'k2',
        name: "Kids Denim Overalls",
        price: 15000,
        image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&h=500&fit=crop',
        badge: 'NEW'
    },
    {
        id: 'k3',
        name: "Kids Sport Set",
        price: 12000,
        originalPrice: 18000,
        image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
        colors: ['#FF1493', '#00CED1', '#FFD700']
    },
    {
        id: 'k4',
        name: "Kids Winter Jacket",
        price: 25000,
        image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&h=500&fit=crop',
        backImage: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=500&fit=crop',
        badge: 'HOT'
    }
];