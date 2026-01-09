import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Calendar, ClipboardList, AlertCircle, Search, Filter, MoreVertical, Edit2, Trash2, CheckCircle, XCircle, Clock, Info, Plus, X } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // New Client related states
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newClientData, setNewClientData] = useState({
        name: '', phone: '', email: '', address: '', allergies: '', notes: ''
    });

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
            setClients(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, newClientData);
            setClients(prev => {
                const exists = prev.find(c => c._id === response.data._id);
                if (exists) {
                    return prev.map(c => c._id === response.data._id ? response.data : c);
                }
                return [response.data, ...prev];
            });
            setIsAddingNew(false);
            setNewClientData({ name: '', phone: '', email: '', address: '', allergies: '', notes: '' });
            setSelectedClient(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Erreur inconnue';
            alert(`Erreur lors de l'ajout: ${errorMsg}`);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateClient = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            
            // Ajouter tous les champs de texte
            Object.entries(editData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && key !== 'photo') {
                    formData.append(key, value);
                }
            });

            // Ajouter la photo si sélectionnée
            if (photoFile) {
                formData.append('photo', photoFile);
            }

            // Configurer les en-têtes pour le téléchargement de fichiers
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/users/${selectedClient._id}`, 
                formData,
                config
            );

            // Mettre à jour l'état avec les nouvelles données
            const updatedClient = response.data;
            setSelectedClient(updatedClient);
            setClients(prev => 
                prev.map(c => c._id === updatedClient._id ? updatedClient : c)
            );

            // Réinitialiser les états
            setIsEditing(false);
            setPhotoFile(null);
            setPhotoPreview(null);
            
            // Rafraîchir la liste des clients
            fetchClients();
            
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour du client';
            alert(errorMessage);
        }
    };

    const getRegularityBadge = (count) => {
        if (count >= 10) return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">Trés Fidèle</span>;
        if (count >= 5) return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">Régulière</span>;
        if (count >= 1) return <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Cliente</span>;
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-full">Nouvelle</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-gray-800">Gestion des Clientes</h2>
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="bg-pink-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-pink-700 transition shadow-md font-medium"
                    >
                        <Plus size={18} /> Nouvelle Cliente
                    </button>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une cliente..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List Column */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
                            <User className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500">Aucune cliente trouvée</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredClients.map(client => (
                                <div
                                    key={client._id}
                                    onClick={() => {
                                        setSelectedClient(client);
                                        setEditData(client);
                                        setIsEditing(false);
                                        setPhotoFile(null);
                                        setPhotoPreview(null);
                                    }}
                                    className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-md ${selectedClient?._id === client._id ? 'border-pink-500 ring-1 ring-pink-500 shadow-sm' : 'border-gray-100'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-lg overflow-hidden">
                                            {client.photo ? (
                                                <img src={client.photo} alt={client.name} className="w-full h-full object-cover" />
                                            ) : (
                                                client.name.charAt(0)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-800 truncate">{client.name}</h4>
                                            <p className="text-xs text-gray-500 truncate">{client.phone}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {getRegularityBadge(client.regularity || 0)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Column */}
                <div className="lg:col-span-1">
                    {selectedClient ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
                            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white relative">
                                <button
                                    onClick={() => setSelectedClient(null)}
                                    className="absolute top-4 right-4 p-1 bg-white/20 rounded-full hover:bg-white/30 transition"
                                >
                                    <XCircle size={20} />
                                </button>
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-3xl mb-3 border-4 border-white/30 shadow-lg overflow-hidden">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : selectedClient.photo ? (
                                            <img src={selectedClient.photo} alt={selectedClient.name} className="w-full h-full object-cover" />
                                        ) : (
                                            selectedClient.name.charAt(0)
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold">{selectedClient.name}</h3>
                                    <p className="text-pink-100 text-sm">Inscrite le {format(new Date(selectedClient.createdAt), 'd MMMM yyyy', { locale: fr })}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(!isEditing);
                                            if (!isEditing) {
                                                setPhotoPreview(null);
                                                setPhotoFile(null);
                                            }
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition font-medium border border-gray-100"
                                    >
                                        <Edit2 size={16} /> {isEditing ? 'Annuler' : 'Modifier'}
                                    </button>
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleUpdateClient} className="space-y-4 animate-in fade-in duration-300">
                                        {/* Photo Upload */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Photo de profil</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 file:cursor-pointer"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nom complet</label>
                                            <input
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                                value={editData.name || ''}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Téléphone</label>
                                            <input
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                                value={editData.phone || ''}
                                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                                            <input
                                                type="email"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                                value={editData.email || ''}
                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Adresse complète</label>
                                            <input
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                                value={editData.address || ''}
                                                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Allergies / Particularités</label>
                                            <input
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                                placeholder="Ex: Teinture cils, latex..."
                                                value={editData.allergies || ''}
                                                onChange={(e) => setEditData({ ...editData, allergies: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Notes Admin</label>
                                            <textarea
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                                rows="3"
                                                placeholder="Observations..."
                                                value={editData.notes || ''}
                                                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                                            />
                                        </div>
                                        <button className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg hover:bg-pink-600 transition">
                                            Enregistrer les modifications
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-5 animate-in fade-in duration-300">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <Phone size={18} className="text-pink-500" />
                                                <span className="text-sm font-medium">{selectedClient.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <Mail size={18} className="text-pink-500" />
                                                <span className="text-sm font-medium">{selectedClient.email}</span>
                                            </div>
                                            <div className="flex items-start gap-3 text-gray-600">
                                                <MapPin size={18} className="text-pink-500 shrink-0 mt-0.5" />
                                                <span className="text-sm font-medium">{selectedClient.address || 'Aucune adresse renseignée'}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Rendez-vous</p>
                                                <p className="text-lg font-bold text-gray-800">{selectedClient.regularity || 0}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Statut</p>
                                                <div className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    <span className="text-sm font-bold text-gray-800 capitalize">{selectedClient.status || 'actif'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                                                <h4 className="flex items-center gap-2 text-orange-700 text-xs font-bold uppercase mb-2">
                                                    <AlertCircle size={14} /> Allergies & Vigilance
                                                </h4>
                                                <p className="text-sm text-orange-800 font-medium">
                                                    {selectedClient.allergies || 'Aucune contre-indication signalée.'}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                                <h4 className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase mb-2">
                                                    <Info size={14} /> Notes privées
                                                </h4>
                                                <p className="text-sm text-blue-800 italic">
                                                    {selectedClient.notes || 'Pas de notes pour cette cliente.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                            <User size={64} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium opacity-60">Sélectionnez une cliente pour voir son dossier complet</p>
                        </div>
                    )}
                </div>
            </div>
            <AddClientModal
                isOpen={isAddingNew}
                onClose={() => setIsAddingNew(false)}
                onAdd={handleAddClient}
                data={newClientData}
                setData={setNewClientData}
            />
        </div>
    );
};

/* New Client Modal (Helper) */
const AddClientModal = ({ isOpen, onClose, onAdd, data, setData }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-pink-100 flex flex-col max-h-[90vh]">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <User size={24} /> Ajouter une nouvelle cliente
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={onAdd} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nom complet *</label>
                            <input
                                required
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Téléphone *</label>
                            <input
                                required
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                value={data.phone}
                                onChange={(e) => setData({ ...data, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email *</label>
                            <input
                                required type="email"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Adresse complète</label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                value={data.address}
                                onChange={(e) => setData({ ...data, address: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Allergies / Vigilance</label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                                value={data.allergies}
                                onChange={(e) => setData({ ...data, allergies: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Notes Admin</label>
                            <textarea
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                                rows="2"
                                value={data.notes}
                                onChange={(e) => setData({ ...data, notes: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button" onClick={onClose}
                            className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg hover:bg-pink-600 transition"
                        >
                            Créer le dossier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Clients;
