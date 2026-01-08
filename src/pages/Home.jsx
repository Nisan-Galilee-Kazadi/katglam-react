import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const Home = () => {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [pricingData, setPricingData] = useState({
        wedding: [],
        package: null,
        general: []
    });

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/realisations`);
                // Get most recent 4 items
                const recentItems = response.data.slice(0, 4);

                // Map to get the first image of each item
                const mappedItems = recentItems.map(item => {
                    const img = item.images && item.images.length > 0 ? item.images[0] : null;
                    if (!img) return null;

                    let src = img;
                    if (!src.startsWith('http') && !src.startsWith('/Images')) {
                        src = `${import.meta.env.VITE_API_URL}${src}`;
                    }
                    return { src, id: item._id };
                }).filter(Boolean);

                setPortfolioItems(mappedItems);
            } catch (error) {
                console.error('Error fetching portfolio for home:', error);
            }
        };

        fetchPortfolio();
    }, []);

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pricing`);
                const allPricing = response.data;

                // Group by category
                const wedding = allPricing.filter(p => p.category === 'wedding');
                const packageItem = allPricing.find(p => p.category === 'package' && p.featured);
                const general = allPricing.filter(p => p.category === 'general');

                setPricingData({ wedding, package: packageItem, general });
            } catch (error) {
                console.error('Error fetching pricing:', error);
            }
        };

        fetchPricing();
    }, []);

    return (
        <div className="w-full">
            {/* HERO SECTION */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105 blur-[2px]"
                    style={{ backgroundImage: "url('/Images/heroImg.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-warm-black/50 via-warm-black/20 to-pink-900/40"></div>

                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-20 md:pt-0">
                    <div className="mb-4 inline-block px-4 py-1 border border-white/30 rounded-full backdrop-blur-sm animate-fade-in-up">
                        <span className="uppercase tracking-widest text-sm font-medium">Beauty & Event Artist</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-2xl leading-tight animate-fade-in-up delay-100">
                        Révélez votre <br />
                        <span className="text-pink-300 italic">Éclat Naturel</span>
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 drop-shadow font-light max-w-2xl mx-auto animate-fade-in-up delay-200">
                        L'excellence du maquillage professionnel à Kinshasa. <br />
                        Pour vos mariages, soirées et moments d'exception.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
                        <Link
                            to="/portfolio"
                            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-pink-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <Sparkles size={18} />
                            Découvrir mon art
                        </Link>
                        <Link
                            to="/client/login"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/50 text-white font-semibold px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2"
                        >
                            Prendre rendez-vous
                        </Link>
                    </div>
                </div>
            </section>

            {/* INTRODUCTION / PHILOSOPHY - White Background */}
            <section className="py-20 bg-white relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-50"></div>

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-sm font-bold tracking-widest text-pink-500 uppercase">À propos de KatGlamour</h2>
                            <h3 className="text-3xl md:text-4xl font-serif text-warm-black leading-snug">
                                "La beauté n'est pas une transformation, c'est une <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-600 italic">révélation.</span>"
                            </h3>
                            <p className="text-warm-gray text-lg leading-relaxed">
                                Bienvenue dans mon univers. Je suis Kat Rosette, et je crois fermement que le maquillage doit sublimer sans masquer.
                                Mon approche allie techniques modernes et écoute attentive pour créer des looks qui vous ressemblent, qu'ils soient naturels ou sophistiqués.
                            </p>
                            <ul className="space-y-3">
                                {['Maquillage Professionnel', 'Vente de cosmétiques', 'Formations certifiantes'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-warm-gray font-medium">
                                        <span className="p-1 bg-pink-100 rounded-full text-pink-500"><CheckCircle2 size={16} /></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/about" className="inline-flex items-center gap-2 text-pink-600 font-semibold hover:text-pink-700 group mt-4">
                                En savoir plus sur mon parcours <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 bg-yellow-400 rounded-2xl transform rotate-3 opacity-20 translate-x-4 translate-y-4"></div>
                            <img src="/Images/image1.jpeg" alt="Kat Rosette" className="rounded-2xl shadow-xl w-full object-cover relative z-10 aspect-[4/5]" />
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-20 flex items-center gap-4 animate-float">
                                <div className="bg-pink-100 p-2 rounded-full text-pink-500">
                                    <Star size={24} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="font-bold text-warm-black">Expertise</p>
                                    <p className="text-xs text-gray-500">Certifiée & Passionnée</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PORTFOLIO HIGHLIGHTS - Pink Background */}
            <section className="py-20 bg-pink-50/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif text-warm-black mb-4">Nos plus belles créations</h2>
                        <p className="text-warm-gray max-w-2xl mx-auto">Découvrez un aperçu de nos réalisations. Chaque visage est une toile unique.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {portfolioItems.length > 0 ? (
                            portfolioItems.map((item, i) => (
                                <Link
                                    to="/portfolio"
                                    key={i}
                                    className={`group relative overflow-hidden rounded-2xl shadow-md cursor-pointer ${i % 2 === 0 ? 'md:translate-y-8' : ''}`}
                                >
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                                    <img src={item.src} className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700" alt="Portfolio" />
                                    <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        <span className="bg-white/90 backdrop-blur text-pink-600 text-xs font-bold px-3 py-1 rounded-full">Voir détails</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-400 italic">Chargement du portfolio...</p>
                        )}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/portfolio" className="inline-block px-8 py-3 border-2 border-pink-500 text-pink-600 font-bold rounded-full hover:bg-pink-500 hover:text-white transition-colors">
                            Explorer tout le portfolio
                        </Link>
                    </div>
                </div>
            </section>

            {/* PRICING SECTION - RESTRUCTURED */}
            <div className="bg-warm-black text-white py-20">
                {/* Wedding Header */}
                <div className="text-center mb-16 max-w-4xl mx-auto px-4">
                    <div className="inline-block p-3 bg-yellow-500/10 rounded-full text-yellow-500 mb-4">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Sublimez votre grand jour</h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-sm">Des forfaits sur-mesure pour que vous soyez la plus belle. Déplacement inclus dans nos tarifs.</p>
                </div>

                {/* Wedding Grid */}
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                    {/* Left: Price List */}
                    <div className="space-y-4">
                        {pricingData.wedding.map((item, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 flex justify-between items-center hover:bg-white/10 transition duration-300">
                                <span className="font-medium text-gray-200">{item.name}</span>
                                <span className="font-bold text-yellow-500 text-xl">{item.price}</span>
                            </div>
                        ))}
                    </div>

                    {/* Right: Premium Package Card */}
                    {pricingData.package && (
                        <div className="bg-gradient-to-br from-[#2c1810] to-[#1a0f0a] border border-yellow-500/30 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl shadow-yellow-900/20">
                            {/* Glow effect */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.6)]"></div>

                            <h3 className="text-white font-bold text-xl uppercase tracking-widest mb-1">{pricingData.package.name}</h3>
                            <p className="text-xs text-gray-400 mb-8 uppercase tracking-wide">{pricingData.package.description || "L'expérience complète"}</p>

                            <div className="text-6xl font-serif font-bold text-white mb-8">
                                {pricingData.package.price}
                            </div>

                            <ul className="text-gray-300 text-sm space-y-3 mb-10 text-left w-fit mx-auto">
                                {pricingData.package.packageIncludes && pricingData.package.packageIncludes.map((inc, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <Heart size={14} className="text-yellow-500 fill-yellow-500" /> {inc}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/client/login" className="block w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform transform hover:scale-[1.02]">
                                Réserver ce Pack
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* General Offers - White Background */}
            <div className="bg-white py-20">
                <div className="text-center mb-16">
                    <span className="text-pink-500 font-bold uppercase tracking-widest text-xs">Nos Offres</span>
                    <h2 className="text-4xl font-serif font-bold text-gray-800 mt-2">Tarifs Généraux</h2>
                    <p className="text-gray-500 mt-2">Des prestations de qualité adaptées à tous vos besoins.</p>
                </div>

                <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pricingData.general.map((item, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm flex gap-6 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center">
                                    <Star size={20} />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                                    <span className="font-bold text-pink-500 text-xl">{item.price}</span>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.description}</p>
                                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                    <CheckCircle2 size={12} /> Produits professionnels
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA SECTION */}
            <section className="py-24 bg-warm-black relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/Images/image1.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-warm-black to-warm-gray/90"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Prête à sublimer votre beauté ?</h2>
                    <p className="text-pink-100 text-lg mb-10 max-w-2xl mx-auto">
                        Que ce soit pour apprendre à vous maquiller ou pour briller lors d'un événement, je suis là pour vous accompagner.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/contact" className="bg-white text-warm-black font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition shadow-lg">
                            Contactez-moi
                        </Link>
                        <Link to="/formations" className="bg-transparent border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition">
                            Voir les formations
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
