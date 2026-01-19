"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";

export default function Header() {

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  function logout() {
    localStorage.removeItem("admin_logged_in");
localStorage.removeItem("admin_email");
router.replace("/");
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white p-4 shadow flex justify-end relative">

      <div ref={dropdownRef} className="relative">

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer"
        >
          Admin <FiChevronDown />
        </button>

        {open && (
          <div className="absolute right-0 mt-3 bg-white shadow rounded">
            <button
              onClick={logout}
              className="px-4 py-2 hover:bg-gray-100 w-full text-left cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}

      </div>

    </header>
  );
}
