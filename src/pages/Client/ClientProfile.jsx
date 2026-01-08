import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Phone, Mail, MapPin, AlertCircle, Info } from 'lucide-react';

const ClientProfile = () => {
    const { client } = useOutletContext();

    if (!client) return null;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <User className="text-pink-500" size={28} />
                    Mes informations
                </h2>
                <p className="text-gray-500 mt-1">
                    Consultez vos données personnelles enregistrées.
                </p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 space-y-6">
                    {/* Header Info Box */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Profile Photo */}
                        <div className="shrink-0 mx-auto md:mx-0">
                            {client.photo ? (
                                <img
                                    src={client.photo}
                                    alt={client.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-pink-50 shadow-md"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md border-4 border-pink-50">
                                    {client.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 flex-1 w-full">
                            <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="text-sm text-blue-800 font-medium">Mode lecture seule</p>
                                <p className="text-sm text-blue-700 mt-1">
                                    Pour des raisons de sécurité, ces informations sont gérées par l'administrateur.
                                    Si vous souhaitez modifier votre profil (adresse, téléphone, etc.), veuillez contacter l'administration.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nom complet</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                                <User size={18} className="text-gray-400" />
                                <span className="font-medium">{client.name}</span>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                                <Mail size={18} className="text-gray-400" />
                                <span>{client.email}</span>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                                <Phone size={18} className="text-gray-400" />
                                <span>{client.phone}</span>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Adresse</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                                <MapPin size={18} className="text-gray-400" />
                                <span>{client.address || 'Non renseignée'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Allergies / Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Allergies & Préférences</label>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 min-h-[80px]">
                            <AlertCircle size={18} className="text-gray-400 mt-0.5" />
                            <span>{client.allergies || 'Aucune allergie ou note spécifique enregistrée.'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
