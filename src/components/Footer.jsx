import React from 'react';
import { Facebook, Instagram, Phone, MapPin, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-warm-black text-white pt-16 flex flex-col border-t border-pink-500/20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-serif font-bold text-white tracking-wide">KatGlamour</h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Sublimer votre beauté naturelle avec élégance et passion. Maquilleuse professionnelle à Kinshasa.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <SocialLink href="https://www.facebook.com/profile.php?id=100088676958695" icon={<Facebook size={18} />} />
                            <SocialLink href="https://www.instagram.com/kat_glamour_?igsh=MWlxYzc2bW8xdTI1eA==" icon={<Instagram size={18} />} />
                            <SocialLink href="https://wa.me/243827433351" icon={<Phone size={18} />} />
                            <SocialLink href="https://vm.tiktok.com/ZMSne9RYv/" icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>} />
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-pink-500">Navigation</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><Link to="/" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Accueil</Link></li>
                            <li><Link to="/about" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Mon Histoire</Link></li>
                            <li><Link to="/portfolio" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Portfolio</Link></li>
                            <li><Link to="/formations" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Académie</Link></li>
                            <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-pink-500">Infos Contact</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-pink-500 mt-1 flex-shrink-0" />
                                <span>Kinshasa, RDC<br />Disponible pour déplacement</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-pink-500 flex-shrink-0" />
                                <span>+243 82 743 33 51</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-pink-500 flex-shrink-0" />
                                <span>contact@katglamour.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-full bg-black/30 backdrop-blur-sm border-t border-gray-800 text-xs text-gray-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center bg-transparent">
                    <p>&copy; {new Date().getFullYear()} KatGlamour. Tous droits réservés.</p>
                    <p className="mt-2 md:mt-0 flex items-center gap-1">
                        par <a href="https://galileokazadidev.netlify.app" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-white transition-colors">Nisan-Galilée Kazadi</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 text-gray-400">
        {icon}
    </a>
);

export default Footer;
