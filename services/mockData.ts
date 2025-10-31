import type { Experience, ExperienceDetails, Slot } from '../types';

const generateSlots = (startTime: number, endTime: number, interval: number, availability: number[]): Slot[] => {
    const slots: Slot[] = [];
    for (let hour = startTime; hour < endTime; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            // Simple logic to make some slots unavailable
            const isAvailable = availability.includes(hour) && Math.random() > 0.1;
            slots.push({
                id: `slot-${hour}-${minute}`,
                time,
                isAvailable
            });
        }
    }
    return slots;
};

const today = new Date();
const generateDates = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date.toISOString().split('T')[0];
    });
};
const availableDates = generateDates(7);

const MOCK_DATA: ExperienceDetails[] = [
    {
        id: '1',
        title: 'Nandi Hills Sunrise Trek',
        location: 'Bengaluru, Karnataka',
        description: 'Witness a breathtaking sunrise from the top of Nandi Hills.',
        longDescription: 'Embark on an early morning trek to Nandi Hills and experience the serene beauty of a sunrise above the clouds. This guided trek is perfect for both beginners and experienced trekkers, offering panoramic views and a refreshing start to your day.',
        rating: 4.8,
        reviewCount: 250,
        price: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        tags: ['trekking', 'nature', 'sunrise'],
        availableDates,
        slotsByDate: availableDates.reduce((acc, date) => {
            acc[date] = generateSlots(4, 7, 30, [4, 5]); // Early morning slots
            return acc;
        }, {} as { [date: string]: Slot[] })
    },
    {
        id: '2',
        title: 'Old Delhi Food & Heritage Walk',
        location: 'Delhi, Delhi',
        description: 'Explore the bustling streets of Old Delhi and savor its culinary delights.',
        longDescription: 'A guided tour through the historic lanes of Chandni Chowk. Discover hidden architectural gems and taste authentic street food like jalebis, parathas, and chaat from iconic local vendors that have been around for centuries.',
        rating: 4.9,
        reviewCount: 421,
        price: 1800,
        imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80',
        tags: ['food', 'culture', 'history', 'city tour'],
        availableDates,
        slotsByDate: availableDates.reduce((acc, date) => {
            acc[date] = generateSlots(10, 18, 60, [10, 11, 14, 15, 16]); // Daytime slots
            return acc;
        }, {} as { [date: string]: Slot[] })
    },
    {
        id: '3',
        title: 'Goan Pottery Workshop',
        location: 'Goa',
        description: 'Learn the ancient art of pottery from local artisans in Goa.',
        longDescription: 'Get your hands dirty in this immersive pottery workshop. Learn to shape clay on the wheel and create your own unique souvenirs to take back home. This experience is a perfect relaxing and creative escape from the beach crowds.',
        rating: 4.7,
        reviewCount: 120,
        price: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80',
        tags: ['art', 'workshop', 'creative', 'craft'],
        availableDates,
        slotsByDate: availableDates.reduce((acc, date) => {
            acc[date] = generateSlots(11, 16, 120, [11, 14]); // Two long slots
            return acc;
        }, {} as { [date: string]: Slot[] })
    },
    {
        id: '4',
        title: 'Scuba Diving in Andaman',
        location: 'Havelock Island, Andaman',
        description: 'Discover the vibrant marine life of the Andaman Sea.',
        longDescription: 'A beginner-friendly scuba diving experience at Havelock Island. Get basic training from PADI-certified instructors and explore the stunning coral reefs and colorful fish in crystal clear waters. All equipment is provided.',
        rating: 4.9,
        reviewCount: 630,
        price: 3500,
        imageUrl: 'https://images.unsplash.com/photo-1577435133758-3c7b7d051f04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        tags: ['water sports', 'adventure', 'scuba', 'ocean'],
        availableDates,
        slotsByDate: availableDates.reduce((acc, date) => {
            acc[date] = generateSlots(9, 15, 60, [9, 10, 11, 13, 14]); // Water activity slots
            return acc;
        }, {} as { [date: string]: Slot[] })
    },
    {
        id: '5',
        title: 'Kerala Backwaters Houseboat Cruise',
        location: 'Alleppey, Kerala',
        description: 'Glide through serene backwaters on a traditional houseboat.',
        longDescription: 'Experience the tranquil life of the Kerala backwaters. This overnight cruise on a private Kettuvallam (houseboat) includes all meals prepared by an onboard chef. Witness lush paddy fields, coconut groves, and charming local villages.',
        rating: 4.9,
        reviewCount: 850,
        price: 7500,
        imageUrl: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        tags: ['relaxing', 'nature', 'houseboat', 'cruise', 'scenic'],
        availableDates,
        slotsByDate: availableDates.reduce((acc, date) => {
            acc[date] = generateSlots(12, 13, 60, [12]); // 12:00 PM check-in
            return acc;
        }, {} as { [date: string]: Slot[] })
    },
    {
        id: '6',
        title: 'Jaipur Hot Air Balloon Safari',
        location: 'Jaipur, Rajasthan',
        description: 'Soar above the majestic forts and palaces of the Pink City at sunrise.',
        longDescription: 'Get a bird\'s-eye view of Jaipur\'s stunning landscape, including the Amber Fort and rustic villages. This magical hot air balloon experience offers unparalleled photo opportunities and a serene adventure you\'ll never forget.',
        rating: 4.8,
        reviewCount: 310,
        price: 6000,
        imageUrl: 'https://images.unsplash.com/photo-1593835081514-22c66c373406?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        tags: ['adventure', 'scenic', 'hot air balloon', 'luxury'],
        availableDates,
        slotsByDate: availableDates.reduce((acc, date) => {
            acc[date] = generateSlots(5, 7, 30, [5, 6]); // Early morning flights
            return acc;
        }, {} as { [date: string]: Slot[] })
    },
    {
        id: '7',
        title: 'Rishikesh White Water Rafting',
        location: 'Rishikesh, Uttarakhand',
        description: 'Conquer the thrilling rapids of the Ganges River in the adventure capital.',
        longDescription: 'Challenge yourself with an exhilarating white water rafting expedition on the sacred Ganges. Navigate through exciting rapids like "Roller Coaster" and "Golf Course" with expert guides. This package includes safety briefing, equipment, and cliff jumping.',
        rating: 4.7,
        reviewCount: 980,
        price: 1600,
        imageUrl: 'https://images.unsplash.com/photo-1508858095484-54c514102c41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        tags: ['adventure', 'water sports', 'rafting', 'thrill'],
        availableDates,
        slotsByDate: availableDates.reduce((acc, date) => {
            acc[date] = generateSlots(9, 16, 60, [9, 10, 11, 13, 14, 15]);
            return acc;
        }, {} as { [date: string]: Slot[] })
    },
    {
        id: '8',
        title: 'Mumbai Bollywood Studio Tour',
        location: 'Mumbai, Maharashtra',
        description: 'Get a behind-the-scenes glimpse into the magic of Bollywood cinema.',
        longDescription: 'Visit a real Bollywood studio in Mumbai, the heart of the Indian film industry. See live film shootings, explore elaborate sets, learn about visual effects, and maybe even get a chance to see a Bollywood star in action. A must-do for any movie lover.',
        rating: 4.6,
        reviewCount: 540,
        price: 2200,
        imageUrl: 'https://images.unsplash.com/photo-1604975734958-4228423811b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        tags: ['entertainment', 'culture', 'bollywood', 'city tour'],
        availableDates,
        slotsByDate: availableDates.reduce((acc, date) => {
            acc[date] = generateSlots(11, 17, 180, [11, 14]); // Two 3-hour tours
            return acc;
        }, {} as { [date: string]: Slot[] })
    },
    {
        id: '9',
        title: 'Pangong Lake Camping Adventure',
        location: 'Leh, Ladakh',
        description: 'Camp under the stars by the stunning, color-changing Pangong Lake.',
        longDescription: 'Experience the raw beauty of Ladakh with an overnight camping trip to the breathtaking Pangong Tso. Stay in comfortable tents near the lake, enjoy delicious local food, and witness a spectacular starry night sky, far from city lights.',
        rating: 4.9,
        reviewCount: 720,
        price: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1605649487212-475ab52647c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        tags: ['nature', 'adventure', 'camping', 'scenic', 'lake'],
        availableDates,
        slotsByDate: availableDates.reduce((acc, date) => {
            acc[date] = generateSlots(15, 16, 60, [15]); // 3:00 PM check-in
            return acc;
        }, {} as { [date: string]: Slot[] })
    },
    {
        id: '10',
        title: 'Sundarbans Mangrove Safari',
        location: 'West Bengal',
        description: 'Explore the world\'s largest mangrove forest, home of the Royal Bengal Tiger.',
        longDescription: 'Embark on a thrilling boat safari through the dense Sundarbans mangroves, a UNESCO World Heritage site. Navigate the network of rivers and creeks, spot diverse wildlife including crocodiles, deer, and exotic birds, and if you are lucky, a majestic Royal Bengal Tiger.',
        rating: 4.8,
        reviewCount: 480,
        price: 5500,
        imageUrl: 'https://images.unsplash.com/photo-1615632123287-17fc5a837053?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        tags: ['nature', 'safari', 'wildlife', 'adventure', 'boating'],
        availableDates,
        slotsByDate: availableDates.reduce((acc, date) => {
            acc[date] = generateSlots(8, 9, 60, [8]); // 8:00 AM start
            return acc;
        }, {} as { [date: string]: Slot[] })
    }
];

export const MOCK_EXPERIENCES: Experience[] = MOCK_DATA;
export const MOCK_EXPERIENCE_DETAILS: ExperienceDetails[] = MOCK_DATA;


export const MOCK_PROMO_CODES: { [code: string]: { discount: number } } = {
    'SAVE10': { discount: 0.10 }, // 10% off
    'FLAT100': { discount: 100 }, // Flat 100 off
};
