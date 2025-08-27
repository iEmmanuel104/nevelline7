import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';

export function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    });
    
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);

    // Create order mutation
    const createOrderMutation = useMutation({
        mutationFn: async (orderData: any) => {
            const { data } = await api.post('/orders', orderData);
            return data.data;
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        if (isProcessingOrder || createOrderMutation.isPending) {
            return;
        }

        setIsProcessingOrder(true);

        try {
            // 1. First create the order on the server
            const orderData = {
                customerName: `${formData.firstName} ${formData.lastName}`.trim(),
                customerEmail: formData.email,
                customerPhone: formData.phone,
                customerAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
                items: cart.map(item => ({
                    productId: item._id || item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    color: item.selectedColor,
                    size: (item as any).selectedSize
                })),
                subtotal: getTotal(),
                shipping: 0, // Free shipping for now
                total: getTotal(),
                paymentMethod: 'paystack',
                status: 'pending',
                paymentStatus: 'pending'
            };

            const order = await createOrderMutation.mutateAsync(orderData);
            const paymentReference = `ORDER-${order.orderNumber}-${Date.now()}`;

            // 2. Initialize Paystack payment with order reference
            const handler = (window as any).PaystackPop.setup({
                key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
                email: formData.email,
                amount: getTotal() * 100, // Amount in kobo
                currency: 'NGN',
                ref: paymentReference,
                metadata: {
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    custom_fields: [
                        {
                            display_name: "Customer Name",
                            variable_name: "customer_name",
                            value: orderData.customerName
                        },
                        {
                            display_name: "Phone Number",
                            variable_name: "phone_number",
                            value: formData.phone
                        },
                        {
                            display_name: "Order Number",
                            variable_name: "order_number",
                            value: order.orderNumber
                        }
                    ]
                },
                callback: function(response: any) {
                    // Payment successful - redirect to success page
                    console.log('Payment successful:', response);
                    
                    // Clear cart
                    clearCart();
                    
                    // Redirect to success page with payment reference
                    navigate(`/payment-success?reference=${response.reference}`, { replace: true });
                },
                onClose: function() {
                    // Payment was cancelled or closed
                    console.log('Payment cancelled');
                    setIsProcessingOrder(false);
                }
            });
            
            // Open Paystack payment modal
            handler.openIframe();

        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
            setIsProcessingOrder(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to your cart to checkout</p>
                    <button 
                        onClick={() => navigate('/collections')}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Shop Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.selectedColor || 'default'}`} className="flex items-center gap-4 p-4 border rounded-lg">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-gray-600">₦{item.price.toLocaleString()}</p>
                                            {item.selectedColor && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-gray-500">Color:</span>
                                                    <div 
                                                        className="w-4 h-4 rounded-full border"
                                                        style={{ backgroundColor: item.selectedColor }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => updateQuantity((item._id || item.id)!, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity((item._id || item.id)!, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => removeFromCart((item._id || item.id)!)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total: ₦{getTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                            
                            <form onSubmit={handlePayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Zip Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isProcessingOrder || createOrderMutation.isPending}
                                        className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isProcessingOrder || createOrderMutation.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            `Pay Now - ₦${getTotal().toLocaleString()}`
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}