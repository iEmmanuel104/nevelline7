import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Product } from '../types';

export interface CartItem extends Product {
    quantity: number;
    selectedColor?: string;
}

interface CartState {
    cart: CartItem[];
}

type CartAction = 
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' };

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingItemIndex = state.cart.findIndex(
                item => item.id === action.payload.id && item.selectedColor === action.payload.selectedColor
            );
            
            if (existingItemIndex > -1) {
                const updatedCart = [...state.cart];
                updatedCart[existingItemIndex].quantity += action.payload.quantity;
                return { cart: updatedCart };
            }
            
            return { cart: [...state.cart, action.payload] };
        }
        
        case 'REMOVE_FROM_CART':
            return {
                cart: state.cart.filter(item => item.id !== action.payload)
            };
            
        case 'UPDATE_QUANTITY': {
            if (action.payload.quantity <= 0) {
                return {
                    cart: state.cart.filter(item => item.id !== action.payload.id)
                };
            }
            
            return {
                cart: state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        }
        
        case 'CLEAR_CART':
            return { cart: [] };
            
        default:
            return state;
    }
}

const CART_STORAGE_KEY = 'Nevelline_cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { cart: [] });

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart)) {
                    parsedCart.forEach(item => {
                        dispatch({ type: 'ADD_TO_CART', payload: item });
                    });
                }
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    }, [state.cart]);

    const addToCart = (item: CartItem) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
    };

    const removeFromCart = (id: string) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const updateQuantity = (id: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getTotal = () => {
        return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getItemCount = () => {
        return state.cart.reduce((count, item) => count + item.quantity, 0);
    };

    const value: CartContextType = {
        cart: state.cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}