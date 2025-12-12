import React from 'react';
import { Users, CreditCard, CalendarCheck, TrendingUp } from 'lucide-react';

const DashboardHome = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Vue d'ensemble</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Réservations</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">128</h3>
                        </div>
                        <div className="p-2 bg-pink-50 text-pink-500 rounded-lg">
                            <CalendarCheck />
                        </div>
                    </div>
                    <span className="text-green-500 text-sm font-medium mt-4 block">+12% ce mois</span>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Clients Actifs</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">84</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                            <Users />
                        </div>
                    </div>
                    <span className="text-green-500 text-sm font-medium mt-4 block">+5% nouveaux</span>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Revenu Mensuel</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">2,450 $</h3>
                        </div>
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                            <CreditCard />
                        </div>
                    </div>
                    <span className="text-red-500 text-sm font-medium mt-4 block">-2% vs dernier mois</span>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Taux de Conversion</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">24%</h3>
                        </div>
                        <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                            <TrendingUp />
                        </div>
                    </div>
                    <span className="text-green-500 text-sm font-medium mt-4 block">+4.5% ce mois</span>
                </div>
            </div>

            {/* Recent Activity or Reservation Table would go here */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Réservations Récentes</h3>
                <p className="text-gray-500 text-sm italic">Aucune donnée récente.</p>
            </div>
        </div>
    );
};

export default DashboardHome;
