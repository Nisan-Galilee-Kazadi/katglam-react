import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X, BookOpen, Clock, Euro } from 'lucide-react';
import axios from 'axios';

const FormationsManager = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFormation, setCurrentFormation] = useState({
        title: '',
        description: '',
        price: '',
        duration: '',
        isActive: true
    });

    const fetchFormations = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/formations`);
            setFormations(response.data);
        } catch (error) {
            console.error('Error fetching formations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFormations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentFormation._id) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/formations/${currentFormation._id}`, currentFormation);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/formations`, currentFormation);
            }
            setIsModalOpen(false);
            setCurrentFormation({ title: '', description: '', price: '', duration: '', isActive: true });
            fetchFormations();
        } catch (error) {
            console.error('Error saving formation:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/formations/${id}`);
                fetchFormations();
            } catch (error) {
                console.error('Error deleting formation:', error);
            }
        }
    };

    const openEdit = (formation) => {
        setCurrentFormation(formation);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Gestion des Formations</h2>
                    <p className="text-gray-500">Gérez vos sessions d'automaquillage et cours.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentFormation({ title: '', description: '', price: '', duration: '', isActive: true });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                >
                    <Plus size={20} />
                    Nouvelle Formation
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formations.map((f) => (
                        <div key={f._id} className={`bg-white rounded-2xl shadow-sm border ${f.isActive ? 'border-gray-100' : 'border-gray-200 opacity-75'} overflow-hidden flex flex-col`}>
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                                        <BookOpen size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(f)} className="p-2 text-gray-400 hover:text-pink-600 transition">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(f._id)} className="p-2 text-gray-400 hover:text-red-600 transition">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{f.description}</p>

                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1 font-medium">
                                        <Euro size={16} className="text-pink-500" />
                                        {f.price} €
                                    </div>
                                    <div className="flex items-center gap-1 font-medium">
                                        <Clock size={16} className="text-pink-500" />
                                        {f.duration}
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                <span className={`text-xs px-2 py-1 rounded-full ${f.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {f.isActive ? 'Active' : 'Désactivée'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {currentFormation._id ? 'Modifier Formation' : 'Créer Formation'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Titre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                    value={currentFormation.title}
                                    onChange={(e) => setCurrentFormation({ ...currentFormation, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                    value={currentFormation.description}
                                    onChange={(e) => setCurrentFormation({ ...currentFormation, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Prix (€)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                        value={currentFormation.price}
                                        onChange={(e) => setCurrentFormation({ ...currentFormation, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Durée</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 2h"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                        value={currentFormation.duration}
                                        onChange={(e) => setCurrentFormation({ ...currentFormation, duration: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                    checked={currentFormation.isActive}
                                    onChange={(e) => setCurrentFormation({ ...currentFormation, isActive: e.target.checked })}
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Formation active</label>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition">
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormationsManager;
