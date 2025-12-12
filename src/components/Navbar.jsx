import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Phone } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isTransparentPage = location.pathname === '/' || location.pathname === '/formations';
    const showSolid = scrolled || isOpen || !isTransparentPage;

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${showSolid ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <NavLink to="/" className="flex-shrink-0 flex items-center gap-3 group">
                        <img src="/Images/logo1.jpg" alt="Logo" className="h-12 w-12 rounded-full object-cover border-2 border-pink-500 group-hover:scale-105 transition-transform" />
                        <div className="flex flex-col">
                            <span className={`font-serif font-bold text-2xl tracking-tight leading-none ${showSolid ? 'text-gray-800' : 'text-white drop-shadow-md'}`}>
                                <span className="text-pink-500">K</span>at<span className="text-yellow-500">G</span>lamour
                            </span>
                            <span className={`text-[10px] uppercase tracking-widest ${showSolid ? 'text-gray-500' : 'text-gray-200'}`}>Makeup Artist</span>
                        </div>
                    </NavLink>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLinks scrolled={showSolid} />

                        {/* Social Icons Desktop */}
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-300/30">
                            <SocialIcon Icon={Instagram} href="https://www.instagram.com/kat_glamour_?igsh=MWlxYzc2bW8xdTI1eA==" scrolled={showSolid} color="hover:text-pink-500" />
                            <SocialIcon Icon={Facebook} href="https://www.facebook.com/profile.php?id=100088676958695" scrolled={showSolid} color="hover:text-blue-600" />
                            <SocialIcon Icon={Phone} href="https://wa.me/243827433351" scrolled={showSolid} color="hover:text-green-500" />
                            {/* TikTok Icon (Custom SVG) */}
                            <a href="https://vm.tiktok.com/ZMSne9RYv/" target="_blank" rel="noopener noreferrer" className={`transition-colors duration-300 ${showSolid ? 'text-gray-600 hover:text-black' : 'text-white hover:text-pink-200'}`}>
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1.4rem] h-[1.4rem]"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                            </a>
                        </div>

                        <NavLink
                            to="/client/login"
                            className={`px-6 py-2 rounded-full font-semibold transition-all shadow-lg ${scrolled
                                ? 'bg-pink-500 text-white hover:bg-pink-600'
                                : 'bg-white text-pink-500 hover:bg-pink-50'
                                }`}
                        >
                            Réserver
                        </NavLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`focus:outline-none transition-colors ${showSolid ? 'text-gray-800' : 'text-white'
                                }`}
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Mobile Sidebar */}
            <div
                className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-pink-500 to-pink-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/Images/logo1.jpg" alt="Logo" className="h-10 w-10 rounded-full object-cover border-2 border-white" />
                                <div className="flex flex-col">
                                    <span className="font-serif font-bold text-xl text-white leading-none">
                                        <span className="text-yellow-200">K</span>at<span className="text-yellow-200">G</span>lamour
                                    </span>
                                    <span className="text-[10px] uppercase tracking-widest text-pink-100">Makeup Artist</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/10 p-2 rounded-lg transition"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6">
                        <div className="flex flex-col space-y-2 px-4">
                            <NavLinks mobile />
                        </div>
                    </nav>

                    {/* Sidebar Footer - Social Icons */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Suivez-nous</p>
                        <div className="flex gap-4 justify-center">
                            <SocialIcon Icon={Instagram} href="https://www.instagram.com/kat_glamour_?igsh=MWlxYzc2bW8xdTI1eA==" scrolled={true} color="text-pink-500" />
                            <SocialIcon Icon={Facebook} href="https://www.facebook.com/profile.php?id=100088676958695" scrolled={true} color="text-blue-600" />
                            <SocialIcon Icon={Phone} href="https://wa.me/243827433351" scrolled={true} color="text-green-500" />
                            <a href="https://vm.tiktok.com/ZMSne9RYv/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors duration-300">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLinks = ({ scrolled, mobile }) => {
    const baseClass = mobile
        ? "w-full text-left px-4 py-3 font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all"
        : `font-medium transition-colors hover:text-pink-400 ${scrolled ? 'text-gray-600' : 'text-white/90'}`; // White text on transparent, Gray on scrolled

    const links = [
        { name: 'Accueil', path: '/' },
        { name: 'À Propos', path: '/about' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Formations', path: '/formations' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            {links.map((link) => (
                <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                        `${baseClass} ${isActive && !mobile ? 'text-pink-500 font-bold' : ''} ${isActive && mobile ? 'bg-pink-100 text-pink-600 font-semibold' : ''}`
                    }
                >
                    {link.name}
                </NavLink>
            ))}
        </>
    );
};

const SocialIcon = ({ Icon, href, scrolled, color }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`transition-colors duration-300 ${scrolled ? `text-gray-600 ${color}` : 'text-white hover:text-pink-200'}`}>
        <Icon size={20} />
    </a>
)

export default Navbar;
