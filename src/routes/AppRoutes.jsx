import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, BlankLayout, DashboardLayout } from '../layouts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import TAClassListPage from '../features/dashboard/pages/TAClassListPage';
import StudentClassListPage from '../features/dashboard/pages/StudentClassListPage';
import ClassDetailLayout from '../features/dashboard/components/classes/detail/ClassDetailLayout';
import ClassStreamPage from '../features/dashboard/components/classes/detail/ClassStreamPage';
import ClassMaterialsPage from '../features/dashboard/components/classes/detail/ClassMaterialsPage';
import ClassworkPage from '../features/dashboard/components/classes/detail/ClassworkPage';
import AssignmentDetailPage from '../features/dashboard/components/classes/detail/assignments/AssignmentDetailPage';
import CreateAssignmentPage from '../features/dashboard/components/classes/detail/assignments/CreateAssignmentPage';
import ClassPeoplePage from '../features/dashboard/components/classes/detail/ClassPeoplePage';
import ClassGradesPage from '../features/dashboard/components/classes/detail/ClassGradesPage';
import ClassSchedulePage from '../features/dashboard/components/classes/detail/ClassSchedulePage';
import ClassAttendancePage from '../features/dashboard/components/classes/detail/ClassAttendancePage';
import MyTasksPage from '../features/ta-management/pages/MyTasksPage';
import NotFoundPage from '../features/error/pages/NotFoundPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import useAuthStore from '../store/authStore';

// New Features Imports
import StudentManagementPage from '../features/student-management/pages/StudentManagementPage';
import TAManagementPage from '../features/ta-management/pages/TAManagementPage';
import ViewSchedulePage from '../features/schedule-attendance/pages/ViewSchedulePage';
import TakeAttendancePage from '../features/schedule-attendance/pages/TakeAttendancePage';
import UpdateAttendanceRecordPage from '../features/schedule-attendance/pages/UpdateAttendanceRecordPage';
import ScheduleManagementPage from '../features/schedule-management/pages/ScheduleManagementPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import UserAuthorizationPage from '../features/dashboard/pages/UserAuthorizationPage';

import AcademicAnalyticsPage from '../features/academic-analytics/pages/AcademicAnalyticsPage';
import ClassReportsPage from '../features/academic-analytics/pages/ClassReportsPage';
import TuitionManagementPage from '../features/tuition-management/pages/TuitionManagementPage';
import TotalRevenuePage from '../features/tuition-management/pages/TotalRevenuePage';
import ClassFinancialReportsPage from '../features/tuition-management/pages/ClassFinancialReportsPage';
import ClassFinancialDetailPage from '../features/tuition-management/pages/ClassFinancialDetailPage';
import StudentNotificationPage from '../features/notifications/pages/StudentNotificationPage';
import StudentTuitionPage from '../features/tuition-management/pages/StudentTuitionPage';

export const AppRoutes = () => {
     const { isAuthenticated } = useAuthStore();

     return (
          <BrowserRouter>
               <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="colored"
               />
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
                         <Route path="forgot-password" element={<ForgotPasswordPage />} />
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
                                   <Route path="materials" element={<ClassMaterialsPage />} />
                                   <Route path="classwork" element={<ClassworkPage />} />
                                   <Route path="create-assignment" element={<CreateAssignmentPage />} />
                                   <Route path="edit-assignment/:assignmentId" element={<CreateAssignmentPage />} />
                                   <Route path="assignment/:assignmentId" element={<AssignmentDetailPage />} />
                                   <Route path="people" element={<ClassPeoplePage />} />
                                   <Route path="grades" element={<ClassGradesPage />} />
                                   <Route path="schedule" element={<ClassSchedulePage />} />
                                   <Route path="attendance" element={<ClassAttendancePage />} />
                              </Route>

                              {/* TA Classes */}
                              <Route path="assisted-classes" element={<TAClassListPage />} />
                              <Route path="assisted-classes/:classId" element={<ClassDetailLayout />}>
                                   <Route index element={<Navigate to="stream" replace />} />
                                   <Route path="stream" element={<ClassStreamPage />} />
                                   <Route path="materials" element={<ClassMaterialsPage />} />
                                   <Route path="classwork" element={<ClassworkPage />} />
                                   <Route path="create-assignment" element={<CreateAssignmentPage />} />
                                   <Route path="edit-assignment/:assignmentId" element={<CreateAssignmentPage />} />
                                   <Route path="assignment/:assignmentId" element={<AssignmentDetailPage />} />
                                   <Route path="people" element={<ClassPeoplePage />} />
                                   <Route path="grades" element={<ClassGradesPage />} />
                                   <Route path="schedule" element={<ClassSchedulePage />} />
                                   <Route path="attendance" element={<ClassAttendancePage />} />
                              </Route>

                              {/* TA Tasks */}
                              <Route path="ta/tasks" element={<MyTasksPage />} />

                              {/* Student Classes */}
                              <Route path="student/classes" element={<StudentClassListPage />} />
                              <Route path="student/classes/:classId" element={<ClassDetailLayout />}>
                                   <Route index element={<Navigate to="stream" replace />} />
                                   <Route path="stream" element={<ClassStreamPage />} />
                                   <Route path="materials" element={<ClassMaterialsPage />} />
                                   <Route path="classwork" element={<ClassworkPage />} />
                                   <Route path="assignment/:assignmentId" element={<AssignmentDetailPage />} />
                                   <Route path="people" element={<ClassPeoplePage />} />
                                   <Route path="grades" element={<ClassGradesPage />} />
                                   <Route path="schedule" element={<ClassSchedulePage />} />
                                   <Route path="attendance" element={<ClassAttendancePage />} />
                              </Route>

                              {/* Student Notifications */}
                              <Route path="notifications" element={<StudentNotificationPage />} />
                              <Route path="tuition-payment" element={<StudentTuitionPage />} />

                              {/* Student Management */}
                              <Route path="students" element={<StudentManagementPage />} />

                              {/* TA Management */}
                              <Route path="assistants" element={<TAManagementPage />} />

                              {/* Schedule & Attendance */}
                              <Route path="schedule" element={<ViewSchedulePage />} />
                              <Route path="attendance/take" element={<TakeAttendancePage />} />
                              <Route path="attendance/update" element={<UpdateAttendanceRecordPage />} />

                              {/* Schedule Management */}
                              <Route path="schedule-management" element={<ScheduleManagementPage />} />

                              {/* Academic Analytics */}
                              <Route path="reports" element={<AcademicAnalyticsPage />} />
                              <Route path="reports/:classId" element={<ClassReportsPage />} />

                              {/* Tuition Management */}
                              <Route path="tuition" element={<TuitionManagementPage />} />
                              <Route path="tuition/revenue" element={<TotalRevenuePage />} />
                              <Route path="tuition/reports" element={<ClassFinancialReportsPage />} />
                              <Route path="tuition/reports/:classId" element={<ClassFinancialDetailPage />} />

                              {/* User Authorization (Admin) */}
                              <Route path="admin/authorization" element={<UserAuthorizationPage />} />
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

