import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Upload, Image as ImageIcon, X, Edit } from 'lucide-react';
import axios from 'axios';

const PortfolioManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [editingId, setEditingId] = useState(null); // ID of item being edited
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        section: '',
    });

    // Image State
    const [existingImagesList, setExistingImagesList] = useState([]); // Paths of existing images when editing
    const [selectedFiles, setSelectedFiles] = useState([]); // New files to upload
    const [previewUrls, setPreviewUrls] = useState([]); // Previews for NEW files

    useEffect(() => {
        fetchRealisations();
    }, []);

    const fetchRealisations = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/realisations`);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching realisations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);

            // Create previews
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            // Revoke URL to avoid memory leaks
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImagesList(prev => prev.filter((_, i) => i !== index));
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData({
            title: item.title,
            description: item.description,
            section: item.section
        });
        setExistingImagesList(item.images || []);
        setSelectedFiles([]);
        setPreviewUrls([]);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', section: '' });
        setExistingImagesList([]);
        setSelectedFiles([]);
        setPreviewUrls([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation: Must have title, section, and at least one image (old or new)
        if (!formData.title.trim() || !formData.section) {
            alert('Titre et Section sont obligatoires.');
            return;
        }
        if (existingImagesList.length === 0 && selectedFiles.length === 0) {
            alert('Vous devez avoir au moins une image.');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('section', formData.section);

        // Append existing images (if any)
        existingImagesList.forEach(img => {
            data.append('existingImages', img);
        });

        // Append new files
        selectedFiles.forEach(file => {
            data.append('images', file);
        });

        try {
            if (editingId) {
                // Update
                await axios.put(`${import.meta.env.VITE_API_URL}/api/realisations/${editingId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Create
                await axios.post(`${import.meta.env.VITE_API_URL}/api/realisations`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            // Reset form
            handleCancelEdit();
            fetchRealisations();
        } catch (error) {
            console.error('Error saving realisation:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette réalisation ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/realisations/${id}`);
                fetchRealisations();
            } catch (error) {
                console.error('Error deleting realisation:', error);
            }
        }
    };

    // Helper to resolve image URL
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        if (path.startsWith('/Images')) return path; // Served by Frontend Public
        return `${import.meta.env.VITE_API_URL}${path}`; // Served by Backend Uploads
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Add/Edit Form */}
            <div className={`bg-white p-6 rounded-xl shadow-sm border ${editingId ? 'border-yellow-200' : 'border-gray-100'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-yellow-700">
                        {editingId ? 'Modifier la réalisation' : 'Ajouter une réalisation'}
                    </h3>
                    {editingId && (
                        <button onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-700">
                            Annuler l'édition
                        </button>
                    )}
                </div>

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
                            Images <span className="text-gray-400 text-xs">(fichiers, max 5MB)</span>
                        </label>

                        {/* Existing Images (Edit Mode) */}
                        {existingImagesList.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2">Images existantes :</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {existingImagesList.map((img, idx) => (
                                        <div key={`exist-${idx}`} className="relative group">
                                            <img src={getImageUrl(img)} alt="" className="w-full h-16 object-cover rounded border" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExistingImage(idx)}
                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center bg-pink-50/30 relative">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="pointer-events-none">
                                <ImageIcon size={48} className="mx-auto text-pink-400 mb-3" />
                                <p className="text-sm text-pink-600 font-medium mb-1">Ajouter des photos</p>
                                <p className="text-xs text-gray-500">JPG, PNG, WEBP</p>
                            </div>
                        </div>

                        {/* New Upload Previews */}
                        {previewUrls.length > 0 && (
                            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                                <p className="text-xs text-green-600 font-medium">Nouvelles images à uploader :</p>
                                {previewUrls.map((url, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                                        <img src={url} alt="" className="w-10 h-10 object-cover rounded" />
                                        <span className="flex-1 text-xs text-gray-600 truncate">Image {idx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(idx)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-4 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 shadow disabled:opacity-50 ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-pink-600 hover:bg-pink-700'}`}
                        >
                            <Plus size={18} />
                            {loading ? 'Traitement...' : (editingId ? 'Mettre à jour' : 'Ajouter la réalisation')}
                        </button>
                    </div>
                </form>
            </div>

            {/* List of Realizations */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-yellow-700 mb-4">Liste des réalisations</h3>

                {items.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 italic">Aucune réalisation ajoutée ou chargement en cours...</p>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item._id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition group">
                                {/* Thumbnail */}
                                <div className="flex-shrink-0 cursor-pointer" onClick={() => handleEdit(item)}>
                                    <img
                                        src={getImageUrl(item.images[0])}
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
                                        <div className="flex-1 cursor-pointer" onClick={() => handleEdit(item)}>
                                            <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">{item.title}</h4>
                                            {item.description && (
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                            )}
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">
                                                    {item.section}
                                                </span>
                                                <span>{item.images.length} image(s)</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-gray-300 hover:text-yellow-600 transition p-2"
                                                title="Modifier"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="text-gray-300 hover:text-red-500 transition p-2"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
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
