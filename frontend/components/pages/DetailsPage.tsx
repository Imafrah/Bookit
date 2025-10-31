
import React, { useState, useEffect } from 'react';
import { getExperienceDetails } from '../../../services/api';
import type { ExperienceDetails, Slot } from '../../../types';
import { useAppContext } from '../context/AppContext';
import Spinner from '../Spinner';

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
  
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const DetailsPage: React.FC = () => {
    const { selectedExperienceId, setBookingDetails, navigateTo, resetToHome } = useAppContext();
    const [details, setDetails] = useState<ExperienceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  
    useEffect(() => {
        if (!selectedExperienceId) {
            resetToHome();
            return;
        }

        const fetchDetails = async () => {
            try {
                setLoading(true);
                const data = await getExperienceDetails(selectedExperienceId);
                if (data) {
                    setDetails(data);
                    const firstDate = data.availableDates[0];
                    if (firstDate) {
                        setSelectedDate(firstDate);
                        const firstAvailableSlot = data.slotsByDate[firstDate]?.find(s => s.isAvailable);
                        if (firstAvailableSlot) {
                            setSelectedSlot(firstAvailableSlot);
                        }
                    }
                } else {
                    setError('Experience not found.');
                }
            } catch (err) {
                setError('Failed to fetch details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [selectedExperienceId, resetToHome]);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot(null);
    };

    const handleSlotSelect = (slot: Slot) => {
        if (slot.isAvailable) {
            setSelectedSlot(slot);
        }
    };

    const handleBookNow = () => {
        if (details && selectedDate && selectedSlot) {
            setBookingDetails({
                experience: details,
                date: selectedDate,
                slot: selectedSlot,
            });
            navigateTo('checkout');
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-96"><Spinner size="12" color="amber-500"/></div>;
    }

    if (error || !details) {
        return <div className="text-center text-red-500 mt-8">{error || 'Could not load experience details.'}</div>;
    }

    const availableSlotsForDate = selectedDate ? details.slotsByDate[selectedDate] || [] : [];
    const isBookingDisabled = !selectedDate || !selectedSlot;

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={resetToHome} className="flex items-center gap-1 text-amber-600 font-semibold hover:underline mb-6">
                    <ChevronLeftIcon />
                    Back to experiences
                </button>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-5">
                        <div className="md:col-span-3">
                            <img src={details.imageUrl} alt={details.title} className="w-full h-64 md:h-full object-cover"/>
                        </div>
                        <div className="md:col-span-2 p-6 md:p-8 flex flex-col">
                            <h1 className="text-3xl font-bold text-slate-900">{details.title}</h1>
                            <p className="text-slate-600 mt-2">{details.location}</p>
                            <div className="flex items-center mt-2">
                            <StarIcon />
                            <span className="text-slate-700 font-semibold ml-1">{details.rating}</span>
                            <span className="text-slate-500 ml-2">({details.reviewCount} reviews)</span>
                            </div>
                            <p className="text-slate-700 mt-4 text-base leading-relaxed flex-grow">{details.longDescription}</p>
                            
                            <div className="mt-8">
                                <h3 className="font-semibold text-lg text-slate-800 mb-3">Select a Date</h3>
                                <div className="flex flex-wrap gap-2">
                                    {details.availableDates.map(date => (
                                        <button 
                                            key={date}
                                            onClick={() => handleDateSelect(date)}
                                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                selectedDate === date ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-300 text-slate-700 hover:border-amber-500'
                                            }`}
                                        >
                                            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedDate && (
                                <div className="mt-6">
                                    <h3 className="font-semibold text-lg text-slate-800 mb-3">Select a Time</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {availableSlotsForDate.map(slot => (
                                            <button
                                                key={slot.id}
                                                onClick={() => handleSlotSelect(slot)}
                                                disabled={!slot.isAvailable}
                                                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                                    selectedSlot?.id === slot.id ? 'bg-amber-500 border-amber-500 text-white scale-105' : 
                                                    slot.isAvailable ? 'bg-white border-slate-300 text-slate-700 hover:border-amber-500' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                                                }`}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <span className="text-sm text-slate-600">Price per person</span>
                                    <p className="text-3xl font-bold text-slate-900">₹{details.price.toLocaleString('en-IN')}</p>
                                </div>
                                <button 
                                    onClick={handleBookNow}
                                    disabled={isBookingDisabled}
                                    className="w-full sm:w-auto px-8 py-3 rounded-lg bg-amber-500 text-white font-bold text-lg hover:bg-amber-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-500/50 disabled:shadow-none"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DetailsPage;
