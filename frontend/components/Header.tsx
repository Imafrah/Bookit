
import React from 'react';
import { useAppContext } from './context/AppContext';

const Header: React.FC = () => {
    const { resetToHome } = useAppContext();
    return (
        <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={resetToHome}
                    aria-label="Back to homepage"
                >
                    <h1 className="text-2xl font-extrabold text-white tracking-wider">BookIt</h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
