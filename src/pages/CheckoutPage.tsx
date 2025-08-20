import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

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

        // Paystack Inline Checkout
        const handler = (window as any).PaystackPop.setup({
            key: 'pk_test_your_paystack_public_key_here', // Replace with your Paystack public key
            email: formData.email,
            amount: getTotal() * 100, // Amount in kobo (multiply by 100)
            currency: 'NGN',
            ref: `ORDER-${Date.now()}`, // Generate unique reference
            metadata: {
                custom_fields: [
                    {
                        display_name: "Customer Name",
                        variable_name: "customer_name",
                        value: `${formData.firstName} ${formData.lastName}`
                    },
                    {
                        display_name: "Phone Number",
                        variable_name: "phone_number",
                        value: formData.phone
                    },
                    {
                        display_name: "Items",
                        variable_name: "cart_items",
                        value: cart.map(item => `${item.name} x${item.quantity}`).join(', ')
                    }
                ]
            },
            callback: function(response: any) {
                // Payment successful
                alert(`Payment successful! Reference: ${response.reference}\\nTotal: ₦${getTotal().toLocaleString()}`);
                
                // Clear cart and redirect
                clearCart();
                navigate('/', { replace: true });
            },
            onClose: function() {
                // Payment cancelled
                alert('Payment was cancelled');
            }
        });
        
        handler.openIframe();
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
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
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
                                        className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                    >
                                        Complete Order - ₦{getTotal().toLocaleString()}
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