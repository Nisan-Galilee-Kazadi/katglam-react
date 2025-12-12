import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import { CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />

            {/* Floating CTA */}
            <Link
                to="/client/login"
                className="fixed bottom-6 right-6 z-40 bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-full shadow-2xl animate-bounce-slow transition-transform hover:scale-110 flex items-center justify-center group"
                title="Réserver maintenant"
            >
                <CalendarClock size={28} />
                <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Réserver maintenant
                </span>
            </Link>
        </div>
    );
};

export default MainLayout;
