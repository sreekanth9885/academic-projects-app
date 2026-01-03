"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";


export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("admin_logged_in");

    if (!token && path !== "/admin") router.push("/admin");

    if (token && path === "/admin") router.push("/admin/dashboard");

  }, [path]);

  if (path === "/admin") return <>{children}</>;

  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Header />

        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
