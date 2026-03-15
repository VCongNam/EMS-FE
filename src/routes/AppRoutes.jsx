import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, BlankLayout, DashboardLayout } from '../layouts';

// Feature Pages
import LandingPage from '../features/landing-page/pages/LandingPage';
import AboutUs from '../features/landing-page/pages/AboutUs';
import Features from '../features/landing-page/pages/Features';
import Pricing from '../features/landing-page/pages/Pricing';
import ContactUs from '../features/landing-page/pages/ContactUs';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import AdminLoginPage from '../features/auth/pages/AdminLoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ProfilePage from '../features/dashboard/pages/ProfilePage';
import TeacherClassListPage from '../features/dashboard/pages/TeacherClassListPage';
import ClassDetailLayout from '../features/dashboard/components/classes/detail/ClassDetailLayout';
import ClassStreamPage from '../features/dashboard/components/classes/detail/ClassStreamPage';
import ClassworkPage from '../features/dashboard/components/classes/detail/ClassworkPage';
import ClassPeoplePage from '../features/dashboard/components/classes/detail/ClassPeoplePage';
import ClassGradesPage from '../features/dashboard/components/classes/detail/ClassGradesPage';
import NotFoundPage from '../features/error/pages/NotFoundPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import useAuthStore from '../store/authStore';

export const AppRoutes = () => {
     const { isAuthenticated } = useAuthStore();

     return (
          <BrowserRouter>
               <Routes>
                    {/* Public Layout (Header + Footer) */}
                    <Route element={<MainLayout />}>
                         <Route index element={<LandingPage />} />
                         <Route path="about" element={<AboutUs />} />
                         <Route path="features" element={<Features />} />
                         <Route path="pricing" element={<Pricing />} />
                         <Route path="contact" element={<ContactUs />} />
                    </Route>

                    {/* Auth Layout (No Header/Footer, specialized UI) */}
                    <Route element={<BlankLayout />}>
                         <Route path="login" element={<LoginPage />} />
                         <Route path="register" element={<RegisterPage />} />
                         <Route path="admin/login" element={<AdminLoginPage />} />
                    </Route>

                    {/* Protected Dashboard Layout (SideMenu) */}
                    <Route element={<ProtectedRoute isAuthenticated={isAuthenticated || true} />}>
                         <Route element={<DashboardLayout />}>
                              <Route path="dashboard" element={<DashboardPage />} />
                              <Route path="profile" element={<ProfilePage />} />
                              <Route path="teacher/classes" element={<TeacherClassListPage />} />
                              <Route path="teacher/classes/:classId" element={<ClassDetailLayout />}>
                                  <Route index element={<Navigate to="stream" replace />} />
                                  <Route path="stream" element={<ClassStreamPage />} />
                                  <Route path="classwork" element={<ClassworkPage />} />
                                  <Route path="people" element={<ClassPeoplePage />} />
                                  <Route path="grades" element={<ClassGradesPage />} />
                              </Route>
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

