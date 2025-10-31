
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { createBooking, validatePromoCode } from '../../../services/api';
import type { Booking } from '../../../types';
import Spinner from '../Spinner';

const CheckoutPage: React.FC = () => {
    const { bookingData, setBookingResult, navigateTo, resetToHome } = useAppContext();
    const { experience, date, slot } = bookingData;

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!experience || !date || !slot) {
            resetToHome();
        }
    }, [experience, date, slot, resetToHome]);

    if (!experience || !date || !slot) {
        return null;
    }
    
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required.';
                if (value.trim().length < 2) return 'Name must be at least 2 characters.';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required.';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid.';
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setTouched(prev => ({ ...prev, [id]: true }));
        const error = validateField(id, value);
        setErrors(prev => ({ ...prev, [id]: error }));
    };
    
    const validateForm = () => {
        const nameError = validateField('name', userName);
        const emailError = validateField('email', userEmail);

        const newErrors = {
            ...(nameError && { name: nameError }),
            ...(emailError && { email: emailError }),
        };
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleApplyPromo = async () => {
        if (!promoCode) return;
        setIsProcessing(true);
        setPromoMessage(null);
        const result = await validatePromoCode(promoCode);
        if (result.isValid) {
            setPromoDiscount(result.discount);
            setPromoMessage('Promo code applied successfully!');
        } else {
            setPromoDiscount(0);
            setPromoMessage('Invalid promo code.');
        }
        setIsProcessing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, email: true });

        if (!validateForm() || isProcessing) return;

        setIsProcessing(true);
        const bookingDetails: Booking = {
            experienceId: experience.id,
            date,
            slot,
            userName,
            userEmail,
            promoCode: promoDiscount > 0 ? promoCode : undefined
        };
        const result = await createBooking(bookingDetails);
        setBookingResult(result);
        navigateTo('result');
        setIsProcessing(false);
    };

    const subtotal = experience.price;
    const discountAmount = promoDiscount > 0 
        ? (promoDiscount < 1 ? subtotal * promoDiscount : promoDiscount) 
        : 0;
    const total = Math.max(0, subtotal - discountAmount);
    
    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>
                    <div className="flex gap-4">
                        <img src={experience.imageUrl} alt={experience.title} className="w-24 h-24 rounded-lg object-cover" />
                        <div>
                            <h3 className="font-bold text-lg">{experience.title}</h3>
                            <p className="text-slate-600 text-sm mt-1">{experience.location}</p>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-slate-200 pt-6 space-y-3">
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Date:</span>
                            <span className="font-medium text-slate-800">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Time:</span>
                            <span className="font-medium text-slate-800">{slot.time}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Price per person:</span>
                            <span className="font-medium text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-slate-200 pt-6 space-y-3">
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Subtotal:</span>
                            <span className="font-medium text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        {promoDiscount > 0 && (
                            <div className="flex justify-between items-center text-green-600">
                                <span>Discount:</span>
                                <span className="font-medium">-₹{discountAmount.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center font-bold text-xl mt-2">
                            <span>Total:</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Your Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" id="name" value={userName} onChange={e => setUserName(e.target.value)} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.name && touched.name ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500`} />
                            {errors.name && touched.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" id="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.email && touched.email ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500`} />
                            {errors.email && touched.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="promo" className="block text-sm font-medium text-slate-700">Promo Code</label>
                            <div className="flex gap-2 mt-1">
                                <input type="text" id="promo" value={promoCode} onChange={e => setPromoCode(e.target.value)} className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                                <button type="button" onClick={handleApplyPromo} disabled={isProcessing || !promoCode} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-300">Apply</button>
                            </div>
                            {promoMessage && <p className={`text-sm mt-1 ${promoDiscount > 0 ? 'text-green-600' : 'text-red-500'}`}>{promoMessage}</p>}
                        </div>
                        <div className="pt-4">
                            <button type="submit" disabled={isProcessing} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-300">
                                {isProcessing ? <Spinner size="6" color="white" /> : 'Confirm Booking'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default CheckoutPage;
