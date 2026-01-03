'use client';

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">

        <Header />

        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
