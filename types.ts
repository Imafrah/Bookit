
export interface Experience {
  id: string;
  title: string;
  location: string;
  description: string;
  longDescription: string;
  rating: number;
  reviewCount: number;
  price: number;
  imageUrl: string;
  tags: string[];
}

export interface Slot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface ExperienceDetails extends Experience {
  availableDates: string[];
  slotsByDate: { [date: string]: Slot[] };
}

export interface Booking {
  experienceId: string;
  date: string;
  slot: Slot;
  userName: string;
  userEmail: string;
  promoCode?: string;
}

export interface BookingConfirmation {
  success: boolean;
  bookingId?: string;
  message: string;
  bookingDetails?: {
    experienceTitle: string;
    date: string;
    slotTime: string;
    userName: string;
  };
}
