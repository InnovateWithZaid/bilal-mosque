import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './PageTransition';
import Index from '@/pages/Index';
import LocationPage from '@/pages/LocationPage';
import MapPage from '@/pages/MapPage';
import MosquesListPage from '@/pages/MosquesListPage';
import MosqueDetailPage from '@/pages/MosqueDetailPage';
import CommunityPage from '@/pages/CommunityPage';
import ReportPage from '@/pages/ReportPage';
import SettingsPage from '@/pages/SettingsPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';

export const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/location" element={<PageTransition><LocationPage /></PageTransition>} />
        <Route path="/map" element={<PageTransition><MapPage /></PageTransition>} />
        <Route path="/mosques" element={<PageTransition><MosquesListPage /></PageTransition>} />
        <Route path="/mosque/:id" element={<PageTransition><MosqueDetailPage /></PageTransition>} />
        <Route path="/mosque/:id/community" element={<PageTransition><CommunityPage /></PageTransition>} />
        <Route path="/mosque/:id/report" element={<PageTransition><ReportPage /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
        <Route path="/admin/login" element={<PageTransition><AdminLoginPage /></PageTransition>} />
        <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};