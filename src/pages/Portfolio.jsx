import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Heart } from 'lucide-react';

const Portfolio = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const storedImages = JSON.parse(localStorage.getItem('portfolioImages')) || [];
        // Default images if empty
        const defaultImages = [
            '/Images/image3.jpeg',
            '/Images/image2.jpeg',
            '/Images/image.jpeg',
            '/Images/heroImg.jpg',
            '/Images/babysitter2.jpg',
        ];
        if (storedImages.length === 0) {
            setImages(defaultImages);
        } else {
            setImages(storedImages);
        }
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
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer break-inside-avoid animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => setSelectedImage(src)}
                    >
                        <img
                            src={src}
                            alt={`Réalisation ${index + 1}`}
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

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-6 right-6 text-white text-4xl hover:text-pink-500 transition">
                        <X />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Zoom"
                        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
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
