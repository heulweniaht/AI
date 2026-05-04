import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageWrapper from './components/layout/PageWrapper';
import DashboardWrapper from './components/layout/DashboardWrapper';
import AuthGuard from './components/layout/AuthGuard';

import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import SymptomCheckerPage from './pages/ai/SymptomCheckerPage';
import SpecialtiesPage from './pages/public/SpecialtiesPage';
import DoctorListPage from './pages/public/DoctorListPage';

import DoctorDetailPage from './pages/patient/DoctorDetailPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import BookingPage from './pages/patient/BookingPage';
import ProfilePage from './pages/patient/ProfilePage';
import PatientHistoryPage from './pages/patient/PatientHistoryPage';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ScheduleManagement from './pages/doctor/ScheduleManagement';
import PatientsRecord from './pages/doctor/PatientsRecord';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DoctorApproval from './pages/admin/DoctorApproval';
import ReportPage from './pages/admin/ReportPage';

function App() {
   return (
      <Routes>
         <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
         <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
         <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
         <Route path="/ai-checker" element={<PageWrapper><SymptomCheckerPage /></PageWrapper>} />
         <Route path="/doctors" element={<PageWrapper><DoctorListPage /></PageWrapper>} />
         <Route path="/specialties" element={<PageWrapper><SpecialtiesPage /></PageWrapper>} />

         <Route path="/doctors/:id" element={<PageWrapper><DoctorDetailPage /></PageWrapper>} />

         <Route path="/booking/:id" element={
            <AuthGuard>
               <PageWrapper><BookingPage /></PageWrapper>
            </AuthGuard>
         } />

         {/* patient */}
         <Route path="/patient/*" element={
            <AuthGuard allowedRoles={['patient']}>
               <DashboardWrapper role="patient">
                  <Routes>
                     <Route path="dashboard" element={<PatientDashboard />} />
                     <Route path="history" element={<PatientHistoryPage />} />
                     <Route path="profile" element={<ProfilePage />} />
                     <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
               </DashboardWrapper>
            </AuthGuard>
         } />

         {/* doctor */}
         <Route path="/doctor/*" element={
            <AuthGuard allowedRoles={['doctor']}>
               <DashboardWrapper role="doctor">
                  <Routes>
                     <Route path="dashboard" element={<DoctorDashboard />} />
                     <Route path="schedule" element={<ScheduleManagement />} />
                     <Route path="patients" element={<PatientsRecord />} />
                     <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
               </DashboardWrapper>
            </AuthGuard>
         } />

         {/* admin */}
         <Route path="/admin/*" element={
            <AuthGuard allowedRoles={['admin']}>
               <DashboardWrapper role="admin">
                  <Routes>
                     <Route path="dashboard" element={<AdminDashboard />} />
                     <Route path="users" element={<UserManagement />} />
                     <Route path="doctors" element={<DoctorApproval />} />
                     <Route path="reports" element={<ReportPage />} />
                     <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
               </DashboardWrapper>
            </AuthGuard>
         } />

         <Route path="*" element={
            <PageWrapper>
               <div className="min-h-screen pt-24 text-center">
                  <h1 className="text-3xl font-bold">404 Not Found</h1>
               </div>
            </PageWrapper>
         } />
      </Routes>
   );
}

export default App;
