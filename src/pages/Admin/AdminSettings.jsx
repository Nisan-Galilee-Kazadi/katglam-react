import React, { useState } from 'react';
import { User, Lock, Mail, Phone, MapPin, Camera, Save, Check, AlertCircle, Clock, Bell, Download, Edit2, X } from 'lucide-react';

const AdminSettings = () => {
    const [profileData, setProfileData] = useState(() => {
        const saved = localStorage.getItem('admin_profile');
        return saved ? JSON.parse(saved) : {
            name: 'Rosette Kajinda',
            address: '46 croisement Plateau kabinda, Kinshasa, RDC',
            phone: '+243 827433351',
            email: 'rosettkat@gmail.com',
            photo: null
        };
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profileData);

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const [businessHours] = useState(() => {
        const saved = localStorage.getItem('business_hours');
        return saved ? JSON.parse(saved) : {
            monday: { open: '09:00', close: '18:00', closed: false },
            tuesday: { open: '09:00', close: '18:00', closed: false },
            wednesday: { open: '09:00', close: '18:00', closed: false },
            thursday: { open: '09:00', close: '18:00', closed: false },
            friday: { open: '09:00', close: '18:00', closed: false },
            saturday: { open: '10:00', close: '16:00', closed: false },
            sunday: { open: '10:00', close: '16:00', closed: true }
        };
    });

    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('notification_preferences');
        return saved ? JSON.parse(saved) : {
            newReservations: true,
            appointmentReminders: true,
            portfolioUpdates: false
        };
    });

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();

        const storedPasswords = ['admin123', 'katglam2025'];

        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            showNotification('error', 'Veuillez remplir tous les champs');
            return;
        }

        if (!storedPasswords.includes(passwordData.oldPassword)) {
            showNotification('error', 'Ancien mot de passe incorrect');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showNotification('error', 'Les nouveaux mots de passe ne correspondent pas');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showNotification('error', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }

        showNotification('success', 'Mot de passe changé avec succès !');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleProfileUpdate = () => {
        localStorage.setItem('admin_profile', JSON.stringify(editedProfile));
        setProfileData(editedProfile);
        setIsEditingProfile(false);
        showNotification('success', 'Profil mis à jour avec succès !');
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newProfile = { ...profileData, photo: reader.result };
                setProfileData(newProfile);
                setEditedProfile(newProfile);
                localStorage.setItem('admin_profile', JSON.stringify(newProfile));

                // Dispatch custom event to update photo in AdminLayout
                window.dispatchEvent(new Event('profilePhotoUpdated'));

                showNotification('success', 'Photo mise à jour !');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNotificationToggle = (key) => {
        const updated = { ...notifications, [key]: !notifications[key] };
        setNotifications(updated);
        localStorage.setItem('notification_preferences', JSON.stringify(updated));
        showNotification('success', 'Préférences sauvegardées');
    };

    const handleExportData = () => {
        const data = {
            profile: profileData,
            businessHours: businessHours,
            notifications: notifications,
            reservations: JSON.parse(localStorage.getItem('reservations') || '[]'),
            realizations: JSON.parse(localStorage.getItem('realizations') || '[]'),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `katglam-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('success', 'Données exportées avec succès !');
    };

    const dayNames = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche'
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top duration-300 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            <h2 className="text-3xl font-bold text-gray-800">Profil administrateur</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Information */}
                <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 p-6 rounded-xl shadow-sm border border-pink-200">
                    <h3 className="text-lg font-bold text-pink-700 mb-6 flex items-center gap-2">
                        <User size={20} />
                        Informations personnelles
                    </h3>

                    <div className="space-y-4">
                        {/* Profile Photo */}
                        <div className="flex items-center gap-4 pb-4 border-b border-pink-200">
                            <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                                {profileData.photo ? (
                                    <img src={profileData.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    profileData.name.charAt(0)
                                )}
                            </div>
                            <label className="px-4 py-2 bg-white border border-pink-300 text-pink-700 rounded-lg hover:bg-pink-50 transition flex items-center gap-2 text-sm font-medium cursor-pointer">
                                <Camera size={16} />
                                Changer la photo
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </label>
                        </div>

                        {isEditingProfile ? (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                        value={editedProfile.name}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                        value={editedProfile.address}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                        value={editedProfile.phone}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                        value={editedProfile.email}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleProfileUpdate}
                                        className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition flex items-center justify-center gap-2 font-medium"
                                    >
                                        <Save size={18} />
                                        Sauvegarder
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditedProfile(profileData);
                                            setIsEditingProfile(false);
                                        }}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <User size={16} className="text-pink-500" />
                                        <span>{profileData.name}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse</label>
                                    <div className="flex items-start gap-2 text-gray-800">
                                        <MapPin size={16} className="text-pink-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{profileData.address}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <Phone size={16} className="text-pink-500" />
                                        <span>{profileData.phone}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <Mail size={16} className="text-pink-500" />
                                        <span>{profileData.email}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="w-full mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition flex items-center justify-center gap-2 font-medium"
                                >
                                    <Edit2 size={18} />
                                    Modifier le profil
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Password Change */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-yellow-700 mb-6 flex items-center gap-2">
                        <Lock size={20} />
                        Changer le mot de passe
                    </h3>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ancien mot de passe</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                placeholder="Ancien mot de passe"
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                placeholder="Nouveau mot de passe"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                placeholder="Confirmer le mot de passe"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition font-semibold shadow-md"
                        >
                            Valider le changement
                        </button>
                    </form>
                </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-pink-600" />
                    Horaires d'ouverture
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(businessHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <span className="font-medium text-gray-700">{dayNames[day]}</span>
                            </div>
                            {hours.closed ? (
                                <span className="text-sm text-red-500 font-medium">Fermé</span>
                            ) : (
                                <span className="text-sm text-gray-600">{hours.open} - {hours.close}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notifications */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Bell size={20} className="text-pink-600" />
                        Préférences de notification
                    </h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-pink-600 rounded"
                                checked={notifications.newReservations}
                                onChange={() => handleNotificationToggle('newReservations')}
                            />
                            <span className="text-sm text-gray-700">Nouvelles réservations</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-pink-600 rounded"
                                checked={notifications.appointmentReminders}
                                onChange={() => handleNotificationToggle('appointmentReminders')}
                            />
                            <span className="text-sm text-gray-700">Rappels de rendez-vous</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-pink-600 rounded"
                                checked={notifications.portfolioUpdates}
                                onChange={() => handleNotificationToggle('portfolioUpdates')}
                            />
                            <span className="text-sm text-gray-700">Mises à jour du portfolio</span>
                        </label>
                    </div>
                </div>

                {/* Data Export */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Download size={20} className="text-pink-600" />
                        Sauvegarde des données
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Exportez toutes vos données (réservations, portfolio, paramètres) au format JSON.
                    </p>
                    <button
                        onClick={handleExportData}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        Exporter les données
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
