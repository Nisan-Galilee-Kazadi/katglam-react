import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Merci ${formData.name} ! Votre message a été envoyé (Simulation).`);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 md:p-8 pt-24 md:pt-32">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">

                {/* Visual Side */}
                <div className="w-full md:w-1/2 relative bg-warm-black min-h-[300px] md:min-h-full flex flex-col justify-end">
                    <img
                        src="/Images/image.jpeg"
                        alt="Contact KatGlamour"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=Contact' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-warm-black/90 to-transparent"></div>

                    <div className="relative z-10 p-8 md:p-12 text-white">
                        <h2 className="text-3xl font-serif font-bold mb-4">Restons connectés</h2>
                        <p className="text-pink-200 mb-8">
                            Une question ? Un projet ? <br />
                            N'hésitez pas à m'écrire, je réponds personnellement à toutes les demandes.
                        </p>
                        <div className="space-y-4">
                            <a href="tel:+243827433351" className="flex items-center gap-4 hover:text-pink-300 transition">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm"><Phone size={18} /></div>
                                +243 82 743 33 51
                            </a>
                            <a href="mailto:contact@katglamour.com" className="flex items-center gap-4 hover:text-pink-300 transition">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm"><Mail size={18} /></div>
                                contact@katglamour.com
                            </a>
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm"><MapPin size={18} /></div>
                                Kinshasa, RDC
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <a href="#" className="p-2 bg-pink-600 rounded-full hover:bg-pink-500 transition"><Instagram size={20} /></a>
                            <a href="#" className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition"><Facebook size={20} /></a>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-16 bg-white">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Envoyez-moi un message</h3>
                        <p className="text-gray-500 mb-8 text-sm">Je vous répondrai sous 24h.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all"
                                    placeholder="Votre nom"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all resize-none"
                                    placeholder="Comment puis-je vous aider ?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-warm-black text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <span className="group-hover:translate-x-[-2px] transition-transform">Envoyer le message</span>
                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
