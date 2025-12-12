import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, GraduationCap, Users, Heart, Star } from 'lucide-react';

const Formations = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return (
        <div className="bg-pink-50 min-h-screen pb-12 w-full">
            {/* Header Image */}
            <div className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src="/Images/image2.jpeg"
                    alt="Formations Makeup"
                    className="absolute inset-0 w-full h-full object-cover animate-float blur-[2px]"
                    style={{ animationDuration: '20s' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x800?text=Formations' }}
                />
                <div className="relative z-20 text-center px-4 animate-fade-in-up">
                    <span className="bg-white/20 backdrop-blur border border-white/50 text-white uppercase tracking-widest text-xs font-bold px-4 py-2 rounded-full mb-4 inline-block">Académie KatGlamour</span>
                    <h1 className="text-4xl md:text-7xl font-serif font-bold text-white drop-shadow-2xl mb-6">
                        Maîtrisez l'Art<br /> du <span className="text-pink-300 italic">Maquillage</span>
                    </h1>
                    <p className="text-lg text-gray-200 max-w-2xl mx-auto font-light">
                        De l'auto-maquillage aux techniques professionnelles, révélez votre potentiel créatif.
                    </p>
                </div>
            </div>

            <section className="max-w-6xl mx-auto px-4 py-20 relative">
                {/* Decorative Elements */}
                <div className="absolute top-10 left-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-30 -z-10"></div>
                <div className="absolute bottom-10 right-0 w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-30 -z-10"></div>

                {/* Intro Text */}
                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up delay-100">
                    <h2 className="text-3xl font-serif text-warm-black mb-6">Nos Cursus de Formation</h2>
                    <p className="text-xl text-warm-gray font-light">
                        Des programmes conçus pour s'adapter à votre rythme et vos ambitions.
                    </p>
                </div>

                {/* FORMATIONS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {/* Basic Formation */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col transform hover:-translate-y-2 transition duration-500 border border-pink-50 animate-fade-in-up delay-200">
                        <div className="bg-pink-100 p-8 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-pink-500 transform -skew-y-6 origin-top-left scale-y-0 group-hover:scale-y-100 transition-transform duration-500 opacity-10"></div>
                            <h2 className="text-2xl font-bold font-serif text-pink-600 relative z-10">Maquillage de Base</h2>
                            <p className="text-pink-400 text-sm font-semibold tracking-wide uppercase relative z-10">Auto-Make Up</p>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <p className="text-gray-600 mb-8 flex-1 leading-relaxed">
                                Idéal pour celles qui veulent se sentir belles au quotidien. Apprenez les bases : traçage de sourcils, teint uniforme et techniques simples pour un look frais.
                            </p>
                            <ul className="space-y-4 mb-8 text-gray-700">
                                <li className="flex items-center gap-3"><div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div> <span><strong>Durée :</strong> 2 semaines (5 séances)</span></li>
                                <li className="flex items-center gap-3"><div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div> <span><strong>Niveau :</strong> Débutant</span></li>
                                <li className="flex items-center gap-3"><div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div> <span><strong>Investissement :</strong> 100$</span></li>
                            </ul>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full bg-pink-50 text-pink-600 font-bold py-4 rounded-xl hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                            >
                                S'inscrire à ce module
                            </button>
                        </div>
                    </div>

                    {/* Pro Formation */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col transform hover:-translate-y-2 transition duration-500 border-2 border-yellow-400 relative animate-fade-in-up delay-300">
                        <div className="absolute top-6 right-6 bg-yellow-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow uppercase tracking-wider">
                            Recommandé
                        </div>
                        <div className="bg-warm-black p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-pink-500/20"></div>
                            <h2 className="text-2xl font-bold font-serif text-white relative z-10 flex items-center justify-center gap-2">
                                <Star className="text-yellow-400" size={20} fill="currentColor" /> Formation Pro
                            </h2>
                            <p className="text-gray-300 text-sm font-semibold tracking-wide uppercase relative z-10">Carrière d'Artiste</p>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Un cursus intensif pour devenir maquilleuse professionnelle. De la préparation de la peau aux techniques de contouring avancées et looks sophistiqués.
                            </p>
                            <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase">Programme</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">• Préparation & Hygiène Pro</li>
                                    <li className="flex items-center gap-2">• Colorimétrie & Morphologie</li>
                                    <li className="flex items-center gap-2">• Looks: Nude, Glam, Mariée</li>
                                </ul>
                            </div>
                            <ul className="space-y-4 mb-8 text-gray-700">
                                <li className="flex items-center gap-3"><div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div> <span><strong>Durée :</strong> 1 Mois (3x / semaine)</span></li>
                                <li className="flex items-center gap-3"><div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div> <span><strong>Prix :</strong> 150$</span></li>
                            </ul>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full bg-gradient-to-r from-warm-black to-warm-gray text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02]"
                            >
                                Candidater maintenant
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ SECTION */}
                <div className="max-w-3xl mx-auto animate-fade-in-up delay-300">
                    <h2 className="text-3xl font-serif text-warm-black font-bold text-center mb-10">Questions Fréquentes</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Faut-il apporter ses propres produits ?", a: "Pour la formation Pro, une liste de matériel indispensable vous sera fournie à l'inscription. Pour l'auto-maquillage, venez avec votre trousse personnelle pour apprendre à l'utiliser !" },
                            { q: "Y a-t-il des facilités de paiement ?", a: "Oui, nous comprenons que c'est un investissement. Le paiement en 2 fois est possible pour la formation complète." },
                            { q: "Est-ce qu'il y a un certificat ?", a: "Absolument. Un certificat de fin de formation 'KatGlamour Academy' vous sera remis lors de la dernière séance." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-gray-800 hover:bg-pink-50/50 transition"
                                >
                                    {item.q}
                                    {activeFaq === idx ? <ChevronUp size={20} className="text-pink-500" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                <div
                                    className={`px-6 text-gray-600 bg-pink-50/30 transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-40 py-5 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                                >
                                    {item.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2 text-center">Pré-inscription</h2>
                        <p className="text-gray-500 text-center mb-8 text-sm">Rejoignez l'aventure KatGlamour.</p>

                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Nom" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-500 outline-none transition" required />
                                <input type="text" placeholder="Prénom" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-500 outline-none transition" required />
                            </div>
                            <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-500 outline-none transition" required />
                            <input type="tel" placeholder="Téléphone" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-500 outline-none transition" required />

                            <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-500 outline-none transition appearance-none">
                                <option>Maquillage de Base</option>
                                <option>Formation Pro Complète</option>
                            </select>

                            <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-pink-500/30 transition transform active:scale-95 mt-4">
                                Valider ma demande
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Formations;
