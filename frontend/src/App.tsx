import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TemplateGallery } from './pages/TemplateGallery';
import { PortfolioBuilder } from './pages/PortfolioBuilder';
import { AdminDashboard } from './pages/AdminDashboard';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeGenerator } from './pages/ResumeGenerator';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex-grow flex flex-col h-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/templates" element={<TemplateGallery />} />
          <Route path="/builder" element={<PortfolioBuilder />} />
          <Route path="/resume" element={<ResumeGenerator />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
