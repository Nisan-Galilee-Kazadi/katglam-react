import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit, DollarSign, X } from 'lucide-react';
import axios from 'axios';

const PricingManager = () => {
    const [pricingItems, setPricingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'general',
        isPackage: false,
        packageIncludes: '',
        featured: false,
        order: 0
    });

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pricing`);
            setPricingItems(response.data);
        } catch (error) {
            console.error('Error fetching pricing:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData({
            name: item.name,
            price: item.price,
            description: item.description || '',
            category: item.category,
            isPackage: item.isPackage || false,
            packageIncludes: item.packageIncludes ? item.packageIncludes.join('\n') : '',
            featured: item.featured || false,
            order: item.order || 0
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            name: '',
            price: '',
            description: '',
            category: 'general',
            isPackage: false,
            packageIncludes: '',
            featured: false,
            order: 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = { ...formData };

        if (formData.isPackage && formData.packageIncludes) {
            dataToSend.packageIncludes = formData.packageIncludes.split('\n').filter(line => line.trim());
        } else {
            dataToSend.packageIncludes = [];
        }

        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/pricing/${editingId}`, dataToSend);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/pricing`, dataToSend);
            }

            handleCancelEdit();
            fetchPricing();
        } catch (error) {
            console.error('Error saving pricing:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce tarif ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/pricing/${id}`);
                fetchPricing();
            } catch (error) {
                console.error('Error deleting pricing:', error);
            }
        }
    };

    const groupedItems = {
        wedding: pricingItems.filter(item => item.category === 'wedding'),
        package: pricingItems.filter(item => item.category === 'package'),
        general: pricingItems.filter(item => item.category === 'general')
    };

    const renderForm = (isModal = false) => (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du service</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
                    <input
                        type="text"
                        placeholder="25$"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        required
                    >
                        <option value="wedding">Mariage</option>
                        <option value="general">Général</option>
                        <option value="package">Package</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                        placeholder="Description du service..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id={isModal ? "isPackageModal" : "isPackage"}
                        checked={formData.isPackage}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPackage: e.target.checked }))}
                        className="w-4 h-4 text-pink-600 rounded"
                    />
                    <label htmlFor={isModal ? "isPackageModal" : "isPackage"} className="text-sm font-medium text-gray-700">C'est un package</label>
                </div>

                {formData.isPackage && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Inclus (une ligne par service)
                            </label>
                            <textarea
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none font-mono text-sm"
                                placeholder="Maquillage Civil&#10;Maquillage Religieux&#10;Retouche"
                                value={formData.packageIncludes}
                                onChange={(e) => setFormData(prev => ({ ...prev, packageIncludes: e.target.value }))}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={isModal ? "featuredModal" : "featured"}
                                checked={formData.featured}
                                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                className="w-4 h-4 text-pink-600 rounded"
                            />
                            <label htmlFor={isModal ? "featuredModal" : "featured"} className="text-sm font-medium text-gray-700">Mettre en avant (Premium)</label>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-4 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 shadow disabled:opacity-50 ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-pink-600 hover:bg-pink-700'}`}
                >
                    <DollarSign size={18} />
                    {loading ? 'Traitement...' : (editingId ? 'Mettre à jour' : 'Ajouter le tarif')}
                </button>
            </div>
        </form>
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Add Form - Top (Creation Only) */}
            {!editingId && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-pink-700">
                            Ajouter un tarif
                        </h3>
                    </div>
                    {renderForm(false)}
                </div>
            )}

            {/* Edit Modal */}
            {editingId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={handleCancelEdit}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-xl z-10">
                            <h3 className="text-xl font-bold text-yellow-700">
                                Modifier le tarif
                            </h3>
                            <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            {renderForm(true)}
                        </div>
                    </div>
                </div>
            )}

            {/* List of Pricing Items */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">Mariage</span>
                        <span className="text-sm text-gray-500">({groupedItems.wedding.length})</span>
                    </h3>
                    <div className="space-y-2">
                        {groupedItems.wedding.map((item) => (
                            <PricingItem key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">Packages</span>
                        <span className="text-sm text-gray-500">({groupedItems.package.length})</span>
                    </h3>
                    <div className="space-y-2">
                        {groupedItems.package.map((item) => (
                            <PricingItem key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">Tarifs Généraux</span>
                        <span className="text-sm text-gray-500">({groupedItems.general.length})</span>
                    </h3>
                    <div className="space-y-2">
                        {groupedItems.general.map((item) => (
                            <PricingItem key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PricingItem = ({ item, onEdit, onDelete }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition group">
            {/* Mobile: Price and Icons Row at Top */}
            <div className="flex md:hidden items-center justify-between mb-3 pb-3 border-b border-gray-200">
                <span className="font-bold text-pink-500 text-xl">{item.price}</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="text-gray-300 hover:text-yellow-600 transition p-2"
                        title="Modifier"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(item._id)}
                        className="text-gray-300 hover:text-red-500 transition p-2"
                        title="Supprimer"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Content Section (clickable for edit) */}
            <div className="flex-1 cursor-pointer" onClick={() => onEdit(item)}>
                {/* Desktop: Title and Price in Row */}
                <div className="hidden md:flex items-center gap-3">
                    <h4 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">{item.name}</h4>
                    <span className="font-bold text-pink-500 text-lg">{item.price}</span>
                    {item.featured && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">★ Premium</span>
                    )}
                </div>

                {/* Mobile: Title Only */}
                <div className="md:hidden">
                    <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
                    {item.featured && (
                        <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold mb-2">★ Premium</span>
                    )}
                </div>

                {/* Description (same for both) */}
                {item.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 md:line-clamp-1">{item.description}</p>
                )}

                {/* Package Includes */}
                {item.isPackage && item.packageIncludes && item.packageIncludes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {item.packageIncludes.map((inc, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {inc}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop: Action Buttons */}
            <div className="hidden md:flex gap-2 ml-4">
                <button
                    onClick={() => onEdit(item)}
                    className="text-gray-300 hover:text-yellow-600 transition p-2"
                    title="Modifier"
                >
                    <Edit size={18} />
                </button>
                <button
                    onClick={() => onDelete(item._id)}
                    className="text-gray-300 hover:text-red-500 transition p-2"
                    title="Supprimer"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default PricingManager;
