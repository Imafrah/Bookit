
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Experience, Slot, BookingConfirmation } from '../../../types';

type Page = 'home' | 'details' | 'checkout' | 'result';

interface BookingData {
  experience: Experience | null;
  date: string | null;
  slot: Slot | null;
}

interface AppState {
  currentPage: Page;
  selectedExperienceId: string | null;
  bookingData: BookingData;
  bookingResult: BookingConfirmation | null;
}

interface AppContextType extends AppState {
  navigateTo: (page: Page) => void;
  selectExperience: (id: string) => void;
  setBookingDetails: (details: Partial<BookingData>) => void;
  setBookingResult: (result: BookingConfirmation | null) => void;
  resetToHome: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  currentPage: 'home',
  selectedExperienceId: null,
  bookingData: {
    experience: null,
    date: null,
    slot: null,
  },
  bookingResult: null,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const navigateTo = (page: Page) => {
    setState(prev => ({ ...prev, currentPage: page }));
    window.scrollTo(0, 0);
  };

  const selectExperience = (id: string) => {
    setState(prev => ({ ...prev, selectedExperienceId: id, currentPage: 'details' }));
    window.scrollTo(0, 0);
  };

  const setBookingDetails = (details: Partial<BookingData>) => {
    setState(prev => ({
      ...prev,
      bookingData: { ...prev.bookingData, ...details },
    }));
  };
  
  const setBookingResult = (result: BookingConfirmation | null) => {
    setState(prev => ({ ...prev, bookingResult: result }));
  };

  const resetToHome = () => {
    setState(initialState);
    window.scrollTo(0, 0);
  };

  const value = {
    ...state,
    navigateTo,
    selectExperience,
    setBookingDetails,
    setBookingResult,
    resetToHome,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
