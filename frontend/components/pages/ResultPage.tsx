
import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const FailureIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ResultPage: React.FC = () => {
    const { bookingResult, resetToHome, navigateTo } = useAppContext();

    useEffect(() => {
        if (!bookingResult) {
            resetToHome();
        }
    }, [bookingResult, resetToHome]);

    if (!bookingResult) {
        return null;
    }

    const { success, message, bookingId, bookingDetails } = bookingResult;

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
                    <div className="flex justify-center mb-6">
                        {success ? <SuccessIcon /> : <FailureIcon />}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{success ? 'Booking Confirmed!' : 'Booking Failed'}</h1>
                    <p className="text-slate-600 text-lg mb-8">{message}</p>
                    
                    {success && bookingDetails && (
                        <div className="text-left bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4 mb-8">
                            <h3 className="font-bold text-lg text-center mb-4">Reservation Details</h3>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Booking ID:</span>
                                <span className="font-mono text-slate-800">{bookingId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Name:</span>
                                <span className="font-medium text-slate-800">{bookingDetails.userName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Experience:</span>
                                <span className="font-medium text-slate-800 text-right">{bookingDetails.experienceTitle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Date & Time:</span>
                                <span className="font-medium text-slate-800">{new Date(bookingDetails.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, {bookingDetails.slotTime}</span>
                            </div>
                        </div>
                    )}
                    
                    {success ? (
                        <button
                            onClick={resetToHome}
                            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-amber-500 text-white font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg"
                        >
                            Explore More
                        </button>
                    ) : (
                        <button
                            onClick={() => navigateTo('checkout')}
                            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ResultPage;
