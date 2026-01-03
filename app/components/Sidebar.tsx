'use client';

import { useState } from "react";
import SidebarItem from "./SidebarItem";
import {
  AiOutlineProject,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineLeft,
  AiOutlineRight
} from "react-icons/ai";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white shadow h-full p-4 transition-all duration-300
      ${collapsed ? "w-20" : "w-60"}
    `}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {!collapsed && <h2 className="font-bold text-lg">Admin</h2>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-200"
        >
          {collapsed ? <AiOutlineRight size={20} /> : <AiOutlineLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <div className="mt-6 space-y-2">
        <SidebarItem
          label="Dashboard"
          icon={<AiOutlineHome size={22} />}
          href="/admin"
          collapsed={collapsed}
        />

        <SidebarItem
          label="Projects"
          icon={<AiOutlineProject size={22} />}
          href="/admin/projects"
          collapsed={collapsed}
        />

        <SidebarItem
          label="Users"
          icon={<AiOutlineUser size={22} />}
          href="/admin/users"
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}
