'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  label: string;
  icon: React.ReactNode;
  href: string;
  collapsed?: boolean;
}

export default function SidebarItem({ label, icon, href, collapsed }: Props) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 p-3 rounded cursor-pointer
        ${active ? "bg-blue-600 text-white" : "hover:bg-gray-200"}
        ${collapsed ? "justify-center" : ""}
      `}
      >
        {icon}

        {!collapsed && <span>{label}</span>}
      </div>
    </Link>
  );
}
