import type { Experience, ExperienceDetails, Booking, BookingConfirmation, Slot } from '../types';
import { getJson, postJson } from './http';

const SIMULATED_DELAY = 500;

// In-memory store for bookings to simulate backend state for the current session
const bookings: Booking[] = [];

/**
 * Fetches the list of all experiences from the backend and maps to UI type.
 */
export const getExperiences = async (): Promise<Experience[]> => {
  const items = await getJson<any[]>(`/experiences`);
  return items.map((x: any) => ({
    id: String(x.id),
    title: x.title,
    location: x.location,
    description: x.description,
    longDescription: x.description,
    rating: 4.8,
    reviewCount: 0,
    price: Number(x.price),
    imageUrl: x.imageUrl || 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    tags: [],
  }));
};

/**
 * Fetches the detailed information for a single experience by its ID
 */
export const getExperienceDetails = async (id: string): Promise<ExperienceDetails | undefined> => {
  const x = await getJson<any>(`/experiences/${id}`);
  if (!x) return undefined;

  const today = new Date();
  const availableDates: string[] = [];
  const slotsByDate: { [date: string]: Slot[] } = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    availableDates.push(dateStr);

    try {
      const avail = await getJson<any>(`/experiences/${id}/availability?date=${dateStr}`);
      const slots = (avail?.availableSlots || avail?.timeSlots || []).map((s: any) => ({
        id: s.time,
        time: s.time.length === 5 ? s.time : s.time.slice(0, 5),
        isAvailable: Number(s.available || 0) > 0,
      }));
      slotsByDate[dateStr] = slots;
    } catch (e) {
      slotsByDate[dateStr] = [];
    }
  }

  const details: ExperienceDetails = {
    id: String(x.id),
    title: x.title,
    location: x.location,
    description: x.description,
    longDescription: x.description,
    rating: 4.8,
    reviewCount: 0,
    price: Number(x.price),
    imageUrl: x.imageUrl || 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    tags: [],
    availableDates,
    slotsByDate,
  };
  return details;
};

/**
 * Validates a promotional code using backend
 */
export const validatePromoCode = async (code: string): Promise<{ isValid: boolean; discount: number }> => {
  try {
    const promos = await getJson<any[]>(`/promo?activeOnly=true`);
    const found = promos.find(p => p.code?.toUpperCase() === code.toUpperCase());
    if (!found) return { isValid: false, discount: 0 };

    if (found.discountType === 'percentage') {
      return { isValid: true, discount: Number(found.discountValue) / 100 };
    }
    return { isValid: true, discount: Number(found.discountValue) };
  } catch (e) {
    console.error('Promo validation failed', e);
    return { isValid: false, discount: 0 };
  }
};

/**
 * Create booking
 */
export const createBooking = async (booking: Booking): Promise<BookingConfirmation> => {
  try {
    const payload = {
      experienceId: Number(booking.experienceId),
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      bookingDate: new Date(booking.date).toISOString(),
      startTime: booking.slot.time.length === 5 ? `${booking.slot.time}:00` : booking.slot.time,
      numberOfPeople: 1,
      promoCode: booking.promoCode || null,
    };

    const resp = await postJson<any>(`/bookings`, payload);
    return {
      success: true,
      bookingId: String(resp.bookingId || ''),
      message: resp.msg || 'Your booking has been confirmed.',
      bookingDetails: {
        experienceTitle: '',
        date: booking.date,
        slotTime: booking.slot.time,
        userName: booking.userName,
      },
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message || 'Failed to create booking.',
    };
  }
};
