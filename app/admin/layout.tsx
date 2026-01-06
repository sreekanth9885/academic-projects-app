"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("admin_logged_in");

    if (!logged) {
      router.replace("/admin");
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;   // prevents redirect loop

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
