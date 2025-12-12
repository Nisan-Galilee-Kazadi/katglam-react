import React from 'react';
import { Heart, Star, Award, Sparkles } from 'lucide-react';

const About = () => {
    return (
        <div className="w-full bg-pink-50 min-h-screen">
            {/* HEADER */}
            <div className="bg-white pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-pink-500 mb-6 animate-fade-in-up">
                        À propos de KatGlamour
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
                        Plongez dans l'univers de Kat Rosette, maquilleuse autodidacte, où
                        passion, apprentissage et élégance façonnent chaque regard.
                    </p>
                </div>
            </div>

            {/* PRESENTATION */}
            <section className="max-w-5xl mx-auto py-12 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center transform hover:scale-[1.01] transition duration-500">
                    <img
                        src="/Images/image1.jpeg"
                        alt="Portrait Maquilleuse KatGlamour"
                        className="w-64 h-64 object-cover rounded-full shadow-2xl border-4 border-pink-100"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Portrait' }}
                    />
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-pink-600">
                            Une passion pour la beauté et l'élégance
                        </h2>
                        <div className="text-lg text-gray-700 space-y-4 leading-relaxed">
                            <p>
                                Je m'appelle <strong>Kat Rosette</strong>, maquilleuse autodidacte
                                et fondatrice de KatGlamour. C'est à travers une démarche personnelle,
                                passionnée et rigoureuse que j'ai appris l'art du maquillage.
                            </p>
                            <p>
                                Ce sont des heures passées devant le miroir, des essais ratés, des
                                découvertes, des erreurs et des réussites qui ont façonné la
                                professionnelle que je suis aujourd'hui.
                            </p>
                            <p>
                                Avec le temps, j'ai affiné ma technique, développé mon style et
                                appris à sublimer chaque visage avec justesse et élégance. J'ai même
                                eu l'opportunité de participer à un concours de beauté, une
                                expérience qui a renforcé ma confiance et ma passion.
                            </p>
                            <p className="italic text-pink-500 font-medium">
                                KatGlamour, c'est le fruit de cette évolution : un espace où chaque femme
                                peut se sentir belle, confiante et mise en lumière.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALEURS */}
            <section className="max-w-6xl mx-auto py-12 px-4">
                <h2 className="text-3xl font-serif text-pink-500 mb-10 text-center font-bold">Mes Valeurs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ValueCard
                        icon={<Heart size={32} />}
                        title="Écoute & Personnalisation"
                        desc="Parce qu'aucun visage ne se ressemble, je prends le temps de comprendre vos envies pour offrir un maquillage sur mesure."
                    />
                    <ValueCard
                        icon={<Award size={32} />}
                        title="Excellence"
                        desc="Je me forme continuellement aux nouvelles techniques pour garantir un résultat soigné et conforme aux normes d'hygiène."
                    />
                    <ValueCard
                        icon={<Sparkles size={32} />}
                        title="Confiance & Douceur"
                        desc="Je travaille avec respect et discrétion pour vous offrir un moment unique, où vous repartirez avec le sourire."
                    />
                    <ValueCard
                        icon={<Star size={32} />}
                        title="Créativité"
                        desc="Chaque prestation est une invitation à l'innovation. Du naturel au sophistiqué, je révèle votre personnalité."
                    />
                </div>
            </section>

            {/* PARCOURS & VISION */}
            <section className="max-w-4xl mx-auto py-12 px-4 space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8 border-l-8 border-pink-400">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Mon Parcours</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Sans formation classique, j'ai forgé mon expertise grâce à ma passion,
                        à la pratique et à des collaborations enrichissantes. Chaque projet — shootings,
                        événements spéciaux, prestations privées — a enrichi mon expérience et affiné
                        mon approche centrée sur la valorisation authentique.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border-r-8 border-yellow-500 text-right">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Ma Vision</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Avec KatGlamour, je souhaite offrir bien plus qu'un simple service de
                        maquillage : une expérience de confiance. Mon ambition est de vous accompagner
                        dans tous les moments importants de votre vie.
                    </p>
                </div>
            </section>
        </div>
    );
};

const ValueCard = ({ icon, title, desc }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center text-center group">
        <div className="p-4 bg-pink-50 text-pink-500 rounded-full mb-4 group-hover:bg-pink-500 group-hover:text-white transition duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
    </div>
);

export default About;
