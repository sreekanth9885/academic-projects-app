"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { API_BASE } from "../constants";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`${API_BASE}/check_admin_session.php`, {
          credentials: "include"
        });

        const data = await res.json();
        console.log("Session check:", data);
        if (!data.authenticated) {
          router.replace("/admin");   // prevent back button return
        } else {
          setReady(true);             // NOW WE ALLOW RENDER
        }
      } catch (e) {
        router.replace("/admin");
      }
    }

    check();
  }, []);

  if (!ready) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
