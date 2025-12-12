import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Upload, Image as ImageIcon, X } from 'lucide-react';

const REALIZATIONS_KEY = 'realizations';

const PortfolioManager = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        section: '',
        images: []
    });
    const [imageInput, setImageInput] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem(REALIZATIONS_KEY);
        if (saved) {
            setItems(JSON.parse(saved));
        }
    }, []);

    const saveItems = (newItems) => {
        setItems(newItems);
        localStorage.setItem(REALIZATIONS_KEY, JSON.stringify(newItems));
    };

    const handleAddImage = () => {
        if (imageInput.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, imageInput.trim()]
            }));
            setImageInput('');
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim() || formData.images.length === 0) return;

        const newRealization = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };

        saveItems([newRealization, ...items]);
        setFormData({ title: '', description: '', section: '', images: [] });
    };

    const handleDelete = (id) => {
        saveItems(items.filter(item => item.id !== id));
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Add Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-yellow-700 mb-6">Ajouter une réalisation</h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                                placeholder="Description de la réalisation..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                value={formData.section}
                                onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                                required
                            >
                                <option value="">Choisir une section</option>
                                <option value="mariage">Mariage</option>
                                <option value="soiree">Soirée</option>
                                <option value="naturel">Naturel</option>
                                <option value="artistique">Artistique</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Column - Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Images <span className="text-gray-400 text-xs">(plusieurs possibles)</span>
                        </label>

                        <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center bg-pink-50/30">
                            <ImageIcon size={48} className="mx-auto text-pink-400 mb-3" />
                            <p className="text-sm text-pink-600 font-medium mb-1">Téléverser des fichiers ou glisser-déposer</p>
                            <p className="text-xs text-gray-500 mb-4">PNG, JPG, GIF jusqu'à 10MB</p>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="URL de l'image"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm"
                                >
                                    Ajouter
                                </button>
                            </div>

                            {/* Image Preview List */}
                            {formData.images.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                                            <img src={img} alt="" className="w-10 h-10 object-cover rounded" onError={(e) => e.target.src = 'https://via.placeholder.com/40'} />
                                            <span className="flex-1 text-xs text-gray-600 truncate">{img}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 shadow"
                        >
                            <Plus size={18} />
                            Ajouter la réalisation
                        </button>
                    </div>
                </form>
            </div>

            {/* List of Realizations */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-yellow-700 mb-4">Liste des réalisations</h3>

                {items.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 italic">Aucune réalisation ajoutée</p>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition group">
                                {/* Thumbnail */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.images[0]}
                                        alt={item.title}
                                        className="w-20 h-20 object-cover rounded-lg border-2 border-pink-200"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                                    />
                                    {item.images.length > 1 && (
                                        <span className="text-xs text-gray-500 mt-1 block text-center">+{item.images.length - 1}</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                                            {item.description && (
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                            )}
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">
                                                    {item.section}
                                                </span>
                                                <span>{item.images.length} image{item.images.length > 1 ? 's' : ''}</span>
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 p-2"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioManager;
