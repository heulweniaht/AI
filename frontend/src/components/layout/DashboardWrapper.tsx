import React from 'react';
import Sidebar from './Sidebar';

const DashboardWrapper = ({ children, role }: { children: React.ReactNode, role: 'patient' | 'doctor' | 'admin' }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans">
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardWrapper;
