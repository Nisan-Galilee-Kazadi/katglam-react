import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Heart } from 'lucide-react';
import axios from 'axios';

const Portfolio = () => {
    const [realisations, setRealisations] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // Now stores { src, title, description, section }

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/realisations`);
                // Map realisations to include all necessary info
                const mappedRealisations = response.data.flatMap(realisation =>
                    realisation.images.map(img => {
                        let imgUrl = img;
                        if (!img) return null;
                        if (!img.startsWith('http') && !img.startsWith('/Images')) {
                            imgUrl = `${import.meta.env.VITE_API_URL}${img}`;
                        }
                        return {
                            src: imgUrl,
                            title: realisation.title,
                            description: realisation.description,
                            section: realisation.section
                        };
                    }).filter(Boolean)
                );

                setRealisations(mappedRealisations);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
            }
        };

        fetchPortfolio();
    }, []);

    return (
        <div className="bg-pink-50 min-h-screen pt-28 pb-12">
            {/* Header */}
            <div className="text-center max-w-4xl mx-auto px-4 mb-16 animate-fade-in-up">
                <h2 className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-2">Portfolio</h2>
                <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-6">L'Art de la Révélation</h1>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Chaque visage raconte une histoire. Voici quelques chapitres que nous avons eus l'honneur d'écrire.
                </p>
            </div>

            {/* Masonry-style Grid */}
            <div className="max-w-7xl mx-auto px-4 columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {realisations.map((item, index) => (
                    <div
                        key={index}
                        className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer break-inside-avoid animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => setSelectedItem(item)}
                    >
                        <img
                            src={item.src}
                            alt={item.title || `Réalisation ${index + 1}`}
                            className="w-full h-auto transform transition duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=Image+Missing' }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <ZoomIn size={24} />
                            </div>
                        </div>
                        {/* Like Button decoration */}
                        <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
                            <Heart size={16} fill="currentColor" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal with Details */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}>
                    <button className="absolute top-6 right-6 text-white text-4xl hover:text-pink-500 transition z-50">
                        <X />
                    </button>

                    {/* Image with overlay details */}
                    <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedItem.src}
                            alt={selectedItem.title}
                            className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
                        />

                        {/* Details Overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent rounded-b-xl p-8 pt-16">
                            <div className="space-y-3">
                                {/* Section Badge */}
                                <div>
                                    <span className="inline-block bg-pink-500/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                        {selectedItem.section}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-lg">
                                    {selectedItem.title}
                                </h3>

                                {/* Description */}
                                {selectedItem.description && (
                                    <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-3xl drop-shadow">
                                        {selectedItem.description}
                                    </p>
                                )}

                                {/* CTA Button */}
                                <div className="pt-4">
                                    <a
                                        href="/contact"
                                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg"
                                    >
                                        <Heart size={18} fill="currentColor" />
                                        Réserver une séance similaire
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA */}
            <div className="text-center mt-20 animate-fade-in-up delay-300">
                <p className="text-gray-600 mb-6 text-lg">Envie d'être la prochaine ?</p>
                <a
                    href="/contact"
                    className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-pink-500/40 hover:-translate-y-1 transition-all"
                >
                    Réserver ma séance
                </a>
            </div>
        </div>
    );
};

export default Portfolio;
