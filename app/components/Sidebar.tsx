"use client";

import { useState } from "react";
import { FiMenu, FiUser, FiGrid } from "react-icons/fi";
import Link from "next/link";

export default function Sidebar() {

  const [open, setOpen] = useState(true);

  return (
    <aside className={`bg-gray-900 text-white p-4 transition-all 
      ${open ? "w-64" : "w-16"}`}>

      <button onClick={() => setOpen(!open)} className="mb-6">
        <FiMenu size={22} />
      </button>

      <nav className="space-y-4">

        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <FiGrid />
          {open && "Dashboard"}
        </Link>

        <Link href="/admin/projects" className="flex items-center gap-3">
          <FiGrid />
          {open && "Projects"}
        </Link>

        <Link href="/admin/users" className="flex items-center gap-3">
          <FiUser />
          {open && "Users"}
        </Link>

      </nav>
    </aside>
  );
}
