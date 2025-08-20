import { useState, useEffect } from 'react';

const WISHLIST_KEY = 'nevelline_wishlist';

export const useWishlist = () => {
    const [wishlist, setWishlist] = useState<string[]>([]);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem(WISHLIST_KEY);
        if (savedWishlist) {
            try {
                setWishlist(JSON.parse(savedWishlist));
            } catch (error) {
                console.error('Error loading wishlist:', error);
            }
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (productId: string) => {
        setWishlist(prev => [...prev, productId]);
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist(prev => prev.filter(id => id !== productId));
    };

    const toggleWishlist = (productId: string) => {
        if (wishlist.includes(productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.includes(productId);
    };

    return {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length
    };
};