"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE } from "./constants";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/admin_login.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",   // REQUIRED for PHP sessions
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await res.json();
      console.log("Login response:", data);
      if (data.status !== "success") {
        alert(data.message || "Invalid credentials");
        return;
      }

      // localStorage.setItem("admin_logged_in", "true");
      // localStorage.setItem("admin_email", email);

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      alert("Login failed — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form onSubmit={login} className="bg-white shadow p-6 rounded w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        <input
          required
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          required
          type="password"
          className="border p-2 w-full mb-5"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white py-2 w-full rounded disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
