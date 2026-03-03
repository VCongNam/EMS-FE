import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, BlankLayout, DashboardLayout } from '../layouts';

// Feature Pages
import LandingPage from '../features/landing-page/pages/LandingPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import AdminLoginPage from '../features/auth/pages/AdminLoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import NotFoundPage from '../features/error/pages/NotFoundPage';

// Components
import ProtectedRoute from '../components/common/ProtectedRoute';

export const AppRoutes = () => {
     // Placeholder for authentication state
     const isAuthenticated = false; // Change to true to test Dashboard access

     return (
          <BrowserRouter>
               <Routes>
                    {/* Public Layout (Header + Footer) */}
                    <Route element={<MainLayout />}>
                         <Route index element={<LandingPage />} />
                         <Route path="about" element={<div className="container py-24"><h1>About Us</h1></div>} />
                         <Route path="features" element={<div className="container py-24"><h1>Features</h1></div>} />
                         <Route path="pricing" element={<div className="container py-24"><h1>Pricing</h1></div>} />
                         <Route path="contact" element={<div className="container py-24"><h1>Contact Us</h1></div>} />
                    </Route>

                    {/* Auth Layout (No Header/Footer, specialized UI) */}
                    <Route element={<BlankLayout />}>
                         <Route path="login" element={<LoginPage />} />
                         <Route path="register" element={<RegisterPage />} />
                         <Route path="admin/login" element={<AdminLoginPage />} />
                    </Route>

                    {/* Protected Dashboard Layout (SideMenu) */}
                    <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                         <Route element={<DashboardLayout />}>
                              <Route path="dashboard" element={<DashboardPage />} />
                         </Route>
                    </Route>

                    {/* Error Routes */}
                    <Route element={<BlankLayout />}>
                         <Route path="/404" element={<NotFoundPage />} />
                         <Route path="*" element={<Navigate to="/404" replace />} />
                    </Route>
               </Routes>
          </BrowserRouter>
     );
};

