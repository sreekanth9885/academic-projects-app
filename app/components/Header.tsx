'use client';

import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Header({ adminEmail, logout }: any) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center bg-white shadow p-4">
      <input
        placeholder="Search..."
        className="border rounded px-3 py-1 w-64"
      />

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2"
        >
          {adminEmail || "Admin"}
          <FiChevronDown />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-white shadow rounded w-40 z-50">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
