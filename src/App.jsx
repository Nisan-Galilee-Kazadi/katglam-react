import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AdminLayout from './layouts/AdminLayout';
import DashboardHome from './pages/Admin/DashboardHome';
import CalendarView from './pages/Admin/CalendarView';
import PortfolioManager from './pages/Admin/PortfolioManager';
import FormationsManager from './pages/Admin/FormationsManager';
import PricingManager from './pages/Admin/PricingManager';
import AdminSettings from './pages/Admin/AdminSettings';
import ReservationRequests from './pages/Admin/ReservationRequests';
import Clients from './pages/Admin/Clients';
import ClientLayout from './layouts/ClientLayout';
import ClientLogin from './pages/Client/ClientLogin';
import ClientDashboard from './pages/Client/ClientDashboard';
import ClientCalendar from './pages/Client/ClientCalendar';
import MyReservations from './pages/Client/MyReservations';
import ReservationHistory from './pages/Client/ReservationHistory';
import ClientProfile from './pages/Client/ClientProfile';
import About from './pages/About';
import Formations from './pages/Formations';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import AdminLogin from './pages/Admin/AdminLogin';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="contact" element={<Contact />} />
          <Route path="formations" element={<Formations />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="requests" element={<ReservationRequests />} />
          <Route path="clients" element={<Clients />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="formations" element={<FormationsManager />} />
          <Route path="pricing" element={<PricingManager />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Client Routes */}
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="calendar" element={<ClientCalendar />} />
          <Route path="reservations" element={<MyReservations />} />
          <Route path="history" element={<ReservationHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
